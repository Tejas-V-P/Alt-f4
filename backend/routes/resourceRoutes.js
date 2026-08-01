const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', resourceController.getResources);
router.post('/', resourceController.addResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
