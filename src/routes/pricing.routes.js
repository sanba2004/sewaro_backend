const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricing.controller');
// Note: Add your admin verification middleware here if you have one configured!

router.get('/', pricingController.getAllTiers);
router.put('/:id', pricingController.updateTier);
router.post('/create', pricingController.createTier);
router.delete('/:id', pricingController.deleteTier);

module.exports = router;