const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/Database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Vérifier les champs manquants
    const missingFields = [];
    if (!username) missingFields.push('Nom d\'utilisateur');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Mot de passe');
    if (!fullName) missingFields.push('Nom complet');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Champs manquants: ${missingFields.join(', ')}` });
    }

    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = db.addUser({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: 'student'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier les champs manquants
    const missingFields = [];
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Mot de passe');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Champs manquants: ${missingFields.join(', ')}` });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
