const authService = require('../services/auth.service');

exports.registerCustomer = async (req, res) => {
    try {
        const result = await authService.registerPendingCustomer(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Auth Registration Error:", error);
        return res.status(500).json({ error: error.message || "Registration failed." });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtpCode(email, otp);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(error.statusCode || 500).json({ error: error.message || "Verification failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userPayload = await authService.authenticateUser(email, password);
        return res.status(200).json({ message: "Login successful", user: userPayload });
    } catch (error) {
        return res.status(error.statusCode || 401).json({ error: error.message || "Login failed" });
    }
};

exports.updateUserPassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing parameters. Current and new passwords are required.' 
            });
        }

        // Execute password modification pipeline
        await authService.changeUserPassword(userId, currentPassword, newPassword);

        return res.status(200).json({
            success: true,
            message: 'Your account password has been safely updated.'
        });
    } catch (err) {
        console.error('❌ Password Reset Control Fault:', err.message);
        return res.status(400).json({ 
            success: false, 
            error: err.message || 'Database error rewriting security records.' 
        });
    }
};

// 🎯 GET USER PROFILE CONTROLLER
exports.getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const userProfile = await authService.fetchProfileById(userId);
        
        return res.status(200).json({ 
            success: true, 
            user: userProfile 
        });
    } catch (error) {
        console.error('Error in getUserProfile controller:', error);
        
        if (error.message === "User profile not found.") {
            return res.status(404).json({ success: false, error: error.message });
        }
        
        return res.status(500).json({ success: false, error: "Internal server error." });
    }
};