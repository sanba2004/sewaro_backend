// pricing.controller.js
const PricingTier = require('../models/PricingTier');

// Fetch all pricing tiers ordered by weight range floor
exports.getAllTiers = async (req, res) => {
  try {
    // 🎯 FIXED: Order by min_weight so the ranges flow sequentially from lightest to heaviest
    const tiers = await PricingTier.findAll({ order: [['min_weight', 'ASC']] });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tiers: ' + error.message });
  }
};

// Update a specific tier rate/weight range boundaries
exports.updateTier = async (req, res) => {
  try {
    const { id } = req.params;
    // 🎯 FIXED: Pull min_weight from the request body along with the other fields
    const { tier_name, min_weight, max_weight, rate_per_kg } = req.body;
    
    const tier = await PricingTier.findByPk(id);
    if (!tier) return res.status(404).json({ error: 'Tier not found' });

    // 🎯 FIXED: Pass min_weight to your database record update method
    await tier.update({ 
      tier_name, 
      min_weight: min_weight !== undefined ? parseFloat(min_weight) : tier.min_weight,
      max_weight: max_weight !== undefined ? parseFloat(max_weight) : tier.max_weight, 
      rate_per_kg: rate_per_kg !== undefined ? parseFloat(rate_per_kg) : tier.rate_per_kg 
    });

    res.status(200).json({ message: 'Pricing tier updated successfully!', tier });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tier: ' + error.message });
  }
};
// Add this to your pricing.controller.js file

exports.createTier = async (req, res) => {
  try {
    const { tier_name, min_weight, max_weight, rate_per_kg } = req.body;

    // Validate that required attributes were submitted
    if (!tier_name || min_weight === undefined || max_weight === undefined || !rate_per_kg) {
      return res.status(400).json({ error: 'All fields are strictly required to define a pricing tier range.' });
    }

    // Insert structural tracking record entry row into database
    const newTier = await PricingTier.create({
      tier_name,
      min_weight: parseFloat(min_weight),
      max_weight: parseFloat(max_weight),
      rate_per_kg: parseFloat(rate_per_kg)
    });

    res.status(201).json({ message: 'New pricing range registered successfully!', newTier });
  } catch (error) {
    console.error('❌ Error executing pricing tier registration:', error);
    res.status(500).json({ error: 'Failed to create new pricing tier: ' + error.message });
  }
};
// Append this separate function block to your existing pricing.controller.js file

exports.deleteTier = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 1. Locate the specific bracket row by its Primary Key ID
    const tier = await PricingTier.findByPk(id);

    // 🛡️ 2. If it doesn't exist, return a descriptive error
    if (!tier) {
      return res.status(404).json({ error: 'The requested pricing tier could not be found.' });
    }

    // 🗑️ 3. Drop the row record from the database table
    await tier.destroy();

    return res.status(200).json({ message: 'Pricing tier range dropped successfully.' });
  } catch (error) {
    console.error('❌ Error executing pricing tier deletion sequence:', error);
    return res.status(500).json({ error: 'Database transaction error occurred while removing the pricing tier.' });
  }
};