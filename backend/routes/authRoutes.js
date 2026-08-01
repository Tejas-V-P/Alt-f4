const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/github', authController.githubAuth);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
