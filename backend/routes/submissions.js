const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
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

// Get all submissions
router.get('/', authMiddleware, (req, res) => {
  const submissions = db.getSubmissions();

  if (req.user.role === 'admin') {
    return res.json(submissions);
  }

  const userId = req.userId ? String(req.userId) : null;
  const userEmail = req.userEmail ? req.userEmail.toLowerCase() : null;

  res.json(submissions.filter(s => 
    (s.userId && String(s.userId) === userId) || 
    (s.userEmail && s.userEmail.toLowerCase() === userEmail)
  ));
});

// Get all submissions for admin space
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  const submissions = db.getSubmissions();
  res.json(submissions);
});

// Open/download a submitted file
router.get('/:id/file', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const submission = db.getSubmissions().find(item => item.id === id);

  if (!submission) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }

  if (req.user.role !== 'admin' && submission.userId !== req.userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  if (!submission.storedFileName) {
    return res.status(404).json({ error: 'Fichier non disponible pour ce dossier' });
  }

  const filePath = path.join(uploadsDir, submission.storedFileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fichier introuvable sur le serveur' });
  }

  res.setHeader('Content-Type', submission.mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${submission.fileName}"`);
  res.sendFile(filePath);
});

// Accept or reject a submitted document
router.patch('/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, reason } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const submission = db.updateSubmissionStatus(id, status, reason);

    if (!submission) {
      return res.status(404).json({ error: 'Dossier introuvable' });
    }

    res.json({
      message: status === 'accepted' ? 'Dossier accepté' : 'Dossier refusé',
      submission
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier' });
  }
});

// Submit a file/document
router.post('/', authMiddleware, upload.single('document'), (req, res) => {
  try {
    const { documentType, description } = req.body;

    if (!documentType || !req.file) {
      return res.status(400).json({ error: 'Type de document et nom de fichier obligatoires' });
    }

    const submission = db.addSubmission({
      userId: req.userId,
      userEmail: req.userEmail,
      documentType,
      description,
      fileName: req.file.originalname,
      storedFileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Document envoyé avec succès',
      submission
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du document' });
  }
});

module.exports = router;
