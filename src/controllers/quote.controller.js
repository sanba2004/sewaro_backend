const emailService = require('../services/email.service');

exports.requestQuote = async (req, res) => {
    const { senderCountry, receiverCountry, weight, description, contactInfo } = req.body;

    if (!senderCountry || !receiverCountry || !weight || !description || !contactInfo) {
        return res.status(400).json({ error: "Missing required fields in submission." });
    }

    try {
        await emailService.sendQuoteRequest(req.body);
        return res.status(200).json({ success: true, message: "Quote request successfully transmitted!" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to process quote metrics via mail system." });
    }
};