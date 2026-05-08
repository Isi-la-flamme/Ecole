const jwt = require('jsonwebtoken');
const db = require('../models/Database');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = db.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;
