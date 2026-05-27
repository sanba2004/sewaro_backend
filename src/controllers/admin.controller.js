const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const { generateUniqueAgentId } = require('../utils/generateId');

// exports.getAgents = async (req, res) => {
//     try {
//         const agents = await User.findAll({
//             where: { role: 'agent' },
//             attributes: ['id', 'full_name', 'email', 'agent_id', 'is_verified', 'created_at'],
//             order: [['created_at', 'DESC']]
//         });
//         return res.status(200).json(agents);
//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error fetching agents' });
//     }
// };
// src/controllers/admin.controller.js
exports.getAgents = async (req, res) => {
    try {
        const agents = await User.findAll({
            where: { role: 'agent' },
            // 🎯 Remove 'created_at' if it isn't explicitly defined in the model attributes
            attributes: ['id', 'full_name', 'email', 'agent_id', 'is_verified'], 
            // 🎯 Sort by 'id' descending to show the newest creations first
            order: [['id', 'DESC']] 
        });
        return res.status(200).json(agents);
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: 'Internal server error fetching agents' });
    }
};

exports.createAgent = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email is already registered' });

        const password_hash = await bcrypt.hash(password, 10);
        let agent_id = generateUniqueAgentId();
        let isUnique = false;

        while (!isUnique) {
            const collisionCheck = await User.findOne({ where: { agent_id } });
            if (!collisionCheck) isUnique = true;
            else agent_id = generateUniqueAgentId();
        }

        const newAgent = await User.create({
            full_name,
            email,
            password_hash,
            role: 'agent',
            agent_id,
            otp_code: null,      
            otp_expiry: null,    
            is_verified: true,   
            created_at: new Date()
        });

        return res.status(201).json({
            message: 'Agent created successfully!',
            agent: { id: newAgent.id, full_name: newAgent.full_name, email: newAgent.email, agent_id: newAgent.agent_id }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Database transaction error creating agent' });
    }
};
const adminService = require('../services/admin.service');
// ... your existing imports (User, bcrypt, generateUniqueAgentId) stay right here
exports.getDashboardStats = async (req, res) => {
    try {
        const overviewData = await adminService.getDashboardOverview();
        return res.status(200).json({
            success: true,
            data: overviewData
        });
    } catch (error) {
        console.error('❌ Error rendering admin stats control panel:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to securely fetch backend administrative dashboard overview metrics.' 
        });
    }
};

// 2. NEW METHOD: Handler to send Year/Month analytics data to your Frontend Graph
exports.getYearlyMonthVolumeAnalytics = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        // Grab values from URL parameters (e.g., ?startYear=2025&endYear=2026)
        const startYear = parseInt(req.query.startYear) || (currentYear - 1);
        const endYear = parseInt(req.query.endYear) || currentYear;

        // Fetch calculations from service layer
        const analyticsData = await adminService.getYearlyMonthVolume(startYear, endYear);

        return res.status(200).json({
            success: true,
            data: {
                configuredRange: { startYear, endYear },
                chartMatrix: analyticsData
            }
        });
    } catch (error) {
        console.error('❌ Controller Analytics Fault:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Database ledger extraction error analyzing yearly month volume metrics.' 
        });
    }

};

exports.deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔍 Find the user record by Primary Key
        const agent = await User.findByPk(id);

        // 🛡️ Guard Clause 1: Check if the user exists
        if (!agent) {
            return res.status(404).json({ error: 'Agent record not found' });
        }

        // 🛡️ Guard Clause 2: Ensure you are only deleting an agent (safety mechanism)
        if (agent.role !== 'agent') {
            return res.status(403).json({ error: 'Unauthorized: Only accounts with an agent role can be removed here.' });
        }

        // 🗑️ Delete the record from your cloud database ledger row
        await agent.destroy();

        return res.status(200).json({ 
            message: `Agent profile "${agent.full_name}" has been successfully deleted from the database.` 
        });
    } catch (error) {
        console.error('❌ Error executing agent deletion sequence:', error);
        return res.status(500).json({ 
            error: 'Database transaction error occurred while removing the agent profile.' 
        });
    }
};