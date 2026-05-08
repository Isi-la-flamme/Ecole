const express = require('express');
const db = require('../models/Database');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get all submissions
router.get('/', authMiddleware, (req, res) => {
  const submissions = db.getSubmissions();

  if (req.user.role === 'admin') {
    return res.json(submissions);
  }

  res.json(submissions.filter(submission => submission.userId === req.userId));
});

// Get all submissions for admin space
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  const submissions = db.getSubmissions();
  res.json(submissions);
});

// Submit a file/document
router.post('/', authMiddleware, (req, res) => {
  try {
    const { documentType, description, fileName, fileSize, mimeType } = req.body;

    if (!documentType || !fileName) {
      return res.status(400).json({ error: 'Type de document et nom de fichier obligatoires' });
    }

    const submission = db.addSubmission({
      userId: req.userId,
      userEmail: req.userEmail,
      documentType,
      description,
      fileName,
      fileSize,
      mimeType,
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
