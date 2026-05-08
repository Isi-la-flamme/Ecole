const express = require('express');
const db = require('../models/Database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all interactions
router.get('/', (req, res) => {
  const interactions = db.getInteractions();
  res.json(interactions);
});

// Create interaction (post)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, message, category } = req.body;

    if (!title || !message || !category) {
      return res.status(400).json({ error: 'Titre, message et catégorie obligatoires' });
    }

    const interaction = db.addInteraction({
      userId: req.userId,
      author: req.userEmail,
      title,
      message,
      category
    });

    res.status(201).json({
      message: 'Message posté avec succès',
      interaction
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
});

// Reply to interaction
router.post('/:id/replies', authMiddleware, (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message obligatoire' });
    }

    const reply = db.replyToInteraction(parseInt(req.params.id), {
      userId: req.userId,
      author: req.userEmail,
      message
    });

    if (reply) {
      res.status(201).json({
        message: 'Réponse postée avec succès',
        reply
      });
    } else {
      res.status(404).json({ error: 'Interaction non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la réponse' });
  }
});

module.exports = router;
