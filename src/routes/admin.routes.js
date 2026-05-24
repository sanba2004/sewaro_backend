const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/overview', adminController.getDashboardStats);
router.get('/agents', adminController.getAgents);
router.post('/agents/create', adminController.createAgent);
router.get('/analytics/volume-matrix', adminController.getYearlyMonthVolumeAnalytics);

module.exports = router;