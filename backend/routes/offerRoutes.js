const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', offerController.getOffers);
router.post('/', offerController.addOffer);
router.delete('/:id', offerController.deleteOffer);

module.exports = router;
