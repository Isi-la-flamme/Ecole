const express = require('express');
const db = require('../models/Database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', (req, res) => {
  const courses = db.getCourses();
  res.json(courses);
});

// Get course by ID
router.get('/:id', (req, res) => {
  const course = db.getCourseById(parseInt(req.params.id));
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: 'Cours non trouvé' });
  }
});

module.exports = router;
