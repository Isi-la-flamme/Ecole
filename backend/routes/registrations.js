const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../models/Database');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();
const uploadsDir = path.join(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${req.userId}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.zip'];
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Type de fichier non autorisé'));
    }

    cb(null, true);
  }
});

// Get all registrations
router.get('/', authMiddleware, (req, res) => {
  const registrations = db.getRegistrations();
  if (req.user.role === 'admin') {
    return res.json(registrations);
  }
  
  const userId = req.userId ? String(req.userId) : null;
  const userEmail = req.userEmail ? req.userEmail.toLowerCase() : null;

  // Filtrage robuste (ID et Email insensibles à la casse/type)
  res.json(registrations.filter(r =>
    r.status !== 'archived' && (
      (r.userId && String(r.userId) === userId) ||
      (r.email && r.email.toLowerCase() === userEmail)
    )
  ));
});

// Accept or reject a registration request
router.patch('/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, reason } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const registration = db.updateRegistrationStatus(id, status, reason);

    if (!registration) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    res.json({
      message: status === 'accepted' ? 'Demande acceptée' : 'Demande refusée',
      registration
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la demande' });
  }
});

// Supprimer (archiver) une demande depuis l'administration
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;

    // On utilise le statut 'archived' pour masquer la demande tout en gardant une trace
    const registration = db.updateRegistrationStatus(id, 'archived', reason || 'Suppression administrative (archivage)');

    if (!registration) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    res.json({
      message: 'La demande a été archivée avec succès (trace conservée en base)',
      registration
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression administrative' });
  }
});

// Create registration
router.post('/', authMiddleware, upload.fields([
  { name: 'attestationPrimaire', maxCount: 1 },
  { name: 'attestationBEPC', maxCount: 1 }
]), (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, class: studentClass, parentName, parentPhone, mamanName, mamanPhone } = req.body;

    // Vérifier les champs manquants
    const missingFields = [];
    if (!firstName) missingFields.push('Nom de l\'élève');
    if (!lastName) missingFields.push('Prénoms de l\'élève');
    if (!email && !req.userEmail) missingFields.push('Email');
    if (!birthDate) missingFields.push('Date de naissance');
    if (!studentClass) missingFields.push('Classe');
    if (!parentName) missingFields.push('Nom du père');
    if (!parentPhone) missingFields.push('Téléphone du père');
    if (!mamanName) missingFields.push('Nom de la mère');
    if (!mamanPhone) missingFields.push('Téléphone de la mère');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Champs manquants: ${missingFields.join(', ')}` });
    }

    const registration = db.addRegistration({
      userId: req.userId,
      firstName,
      lastName,
      birthDate,
      class: studentClass,
      parentName,
      parentPhone,
      mamanName,
      mamanPhone,
      phone: phone || null,
      email: req.userEmail || email,
      attestationPrimaire: req.files && req.files.attestationPrimaire ? req.files.attestationPrimaire[0].filename : null,
      attestationBEPC: req.files && req.files.attestationBEPC ? req.files.attestationBEPC[0].filename : null
    });

    res.status(201).json({
      message: 'Inscription créée avec succès',
      registration
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

module.exports = router;
