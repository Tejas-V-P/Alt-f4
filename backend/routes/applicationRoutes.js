const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', applicationController.getApplications);
router.post('/', applicationController.addApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
