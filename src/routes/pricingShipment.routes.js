const express = require('express');
const router = express.Router();
// Ensure this path goes back accurately out of 'routes' up into 'controllers'
const pricingShipmentController = require('../controllers/pricingShipmentController');

// 🌐 Dynamic evaluation line (Always keep above general parameters like /:id)
router.get('/lookup', pricingShipmentController.lookupLiveRate);

// 📊 CRUD Actions
router.get('/', pricingShipmentController.getAllShipmentRates);
router.post('/create', pricingShipmentController.createTier); 
router.put('/:id', pricingShipmentController.updateTier);     
router.delete('/:id', pricingShipmentController.deleteTier);  

module.exports = router;