const emailService = require('../services/email.service');

// exports.requestQuote = async (req, res) => {
//     const { senderCountry, receiverCountry, weight, description, contactInfo } = req.body;

//     if (!senderCountry || !receiverCountry || !weight || !description || !contactInfo) {
//         return res.status(400).json({ error: "Missing required fields in submission." });
//     }

//     try {
//         await emailService.sendQuoteRequest(req.body);
//         return res.status(200).json({ success: true, message: "Quote request successfully transmitted!" });
//     } catch (error) {
//         return res.status(500).json({ error: "Failed to process quote metrics via mail system." });
//     }
// };
exports.requestQuote = async (req, res) => {
    // ✨ FIX: Added deliveryType to the body destructuring layout
    const { senderCountry, receiverCountry, weight, description, deliveryType, contactInfo } = req.body;

    // ✨ FIX: Added deliveryType to the validation strict conditions
    if (!senderCountry || !receiverCountry || !weight || !description || !deliveryType || !contactInfo) {
        return res.status(400).json({ error: "Missing required fields in submission payload." });
    }

    try {
        await emailService.sendQuoteRequest(req.body);
        return res.status(200).json({ success: true, message: "Quote request successfully transmitted!" });
    } catch (error) {
        // Log the real system error stack behind the scenes in Render logs for tracing
        console.error("Mailer pipeline execution failure:", error);
        return res.status(500).json({ error: "Failed to process quote metrics via mail system." });
    }
};