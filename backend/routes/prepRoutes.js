const express = require('express');
const router = express.Router();
const prepController = require('../controllers/prepController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// AI Prep endpoints
router.get('/questions', prepController.generateQuestions);
router.get('/bookmarks', prepController.getBookmarks);
router.post('/bookmarks', prepController.saveBookmark);

// Calendar Events endpoints
router.get('/events', prepController.getEvents);
router.post('/events', prepController.addEvent);
router.delete('/events/:id', prepController.deleteEvent);

module.exports = router;
