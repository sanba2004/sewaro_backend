const { Op, sequelize } = require('sequelize');
const PricingShipment = require('../models/PricingShipment');

// 1. GET ALL TIERS
exports.getAllShipmentRates = async (req, res) => {
    try {
        const rates = await PricingShipment.findAll({ order: [['id', 'ASC']] });
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. LOOKUP DYNAMIC LIVE ROUTE MATCH
exports.lookupLiveRate = async (req, res) => {
    try {
        const { senderCountry, receiverCountry, weight } = req.query;
        if (!senderCountry || !receiverCountry || !weight) {
            return res.status(400).json({ error: 'Missing parameters.' });
        }
        const targetWeight = parseFloat(weight) || 0;

        // Clean up input variables
        const cleanSender = senderCountry.trim();
        const cleanReceiver = receiverCountry.trim();

        // Use Op.iLike for case-insensitive matching
        const matchedTier = await PricingShipment.findOne({
            where: {
                sender_country: { [Op.iLike]: cleanSender },
                receiver_country: { [Op.iLike]: cleanReceiver },
                min_weight: { [Op.lte]: targetWeight },
                max_weight: { [Op.gte]: targetWeight }
            }
        });

        if (matchedTier) {
            return res.status(200).json({
                success: true,
                rate_per_kg: parseFloat(matchedTier.rate_per_kg),
                tier_name: matchedTier.tier_name
            });
        }

        // Fallback query using Op.iLike
        const fallbackTier = await PricingShipment.findOne({
            where: { 
                sender_country: { [Op.iLike]: cleanSender }, 
                receiver_country: { [Op.iLike]: cleanReceiver } 
            },
            order: [['max_weight', 'DESC']]
        });

        if (fallbackTier) {
            return res.status(200).json({
                success: true,
                rate_per_kg: parseFloat(fallbackTier.rate_per_kg),
                tier_name: `${fallbackTier.tier_name} (Fallback)`
            });
        }

        return res.status(404).json({ success: false, message: 'No route matched.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. CREATE NEW ROUTE BRACKET
exports.createTier = async (req, res) => {
    try {
        const { sender_country, receiver_country, tier_name, min_weight, max_weight, rate_per_kg } = req.body;
        const newTier = await PricingShipment.create({
            sender_country,
            receiver_country,
            tier_name,
            min_weight,
            max_weight,
            rate_per_kg
        });
        res.status(201).json(newTier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. UPDATE EXISTING ROUTE BRACKET
exports.updateTier = async (req, res) => {
    try {
        const { id } = req.params;
        const { sender_country, receiver_country, tier_name, min_weight, max_weight, rate_per_kg } = req.body;
        
        await PricingShipment.update(
            { sender_country, receiver_country, tier_name, min_weight, max_weight, rate_per_kg },
            { where: { id } }
        );
        res.status(200).json({ message: 'Tier updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE ROUTE BRACKET
exports.deleteTier = async (req, res) => {
    try {
        const { id } = req.params;
        await PricingShipment.destroy({ where: { id } });
        res.status(200).json({ message: 'Tier deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};