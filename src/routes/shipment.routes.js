const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');

router.post('/confirm', shipmentController.confirmShipment);
router.get('/all', shipmentController.getAllShipments);
router.get('/track/:trackingId', shipmentController.trackShipment);
router.put('/status', shipmentController.updateStatus);
router.put('/update/:trackingId', shipmentController.updateShipmentDetails);

module.exports = router;