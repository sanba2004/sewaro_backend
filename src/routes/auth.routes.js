const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register-customer', authController.registerCustomer);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.put('/change-password', authController.updateUserPassword);
// 🎯 Fetch full user profile details by ID
router.get('/profile/:id', authController.getUserProfile);
module.exports = router;