const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');

router.post('/request', quoteController.requestQuote);

module.exports = router;