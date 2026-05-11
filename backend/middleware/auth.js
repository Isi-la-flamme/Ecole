const jwt = require('jsonwebtoken');
const db = require('../models/Database');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const authMiddleware = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  const user = db.getUserById(decoded.id);

  if (!user) {
    return next(new AppError('L\'utilisateur appartenant à ce token n\'existe plus.', 401));
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
