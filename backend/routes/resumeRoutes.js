const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', resumeController.getResume);
router.post('/', resumeController.saveResume);

module.exports = router;
