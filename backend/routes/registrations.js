const express = require('express');
const db = require('../models/Database');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get all registrations
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  const registrations = db.getRegistrations();
  res.json(registrations);
});

// Create registration
router.post('/', (req, res) => {
  try {
    const { firstName, lastName, email, phone, class: studentClass, parentName, parentPhone } = req.body;

    if (!firstName || !lastName || !email || !phone || !studentClass || !parentName || !parentPhone) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const registration = db.addRegistration({
      firstName,
      lastName,
      email,
      phone,
      class: studentClass,
      parentName,
      parentPhone
    });

    res.status(201).json({
      message: 'Inscription créée avec succès',
      registration
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

module.exports = router;
