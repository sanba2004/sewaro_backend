const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const emailService = require('./email.service');
// State map matches original volatile registry lifecycle
const temporaryRegistrations = new Map();

class AuthService {
    async registerPendingCustomer({ email, password, fullName }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new Error("Email already registered");

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        temporaryRegistrations.set(email.toLowerCase(), {
            fullName,
            password_hash: hashedPassword,
            otp_code: otp
        });

        await emailService.sendVerificationOtp(email, fullName, otp);
        return { message: "OTP sent to email. Please verify." };
    }

    async verifyOtpCode(email, otp) {
        const normalizedEmail = email.toLowerCase();
        const pendingUser = temporaryRegistrations.get(normalizedEmail);
        
        if (!pendingUser) {
            const error = new Error("Registration session expired. Please register again.");
            error.statusCode = 444; // Maintain your exact error response code layout
            throw error;
        }

        if (pendingUser.otp_code !== otp) {
            const error = new Error("Invalid OTP code");
            error.statusCode = 400;
            throw error;
        }

        await User.create({
            full_name: pendingUser.fullName,
            email: normalizedEmail,
            password_hash: pendingUser.password_hash,
            role: 'customer',
            is_verified: 1,
            otp_code: null
        });

        temporaryRegistrations.delete(normalizedEmail);
        return { message: "Verified and registered!" };
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");

        if (user.is_verified === 0) {
            const error = new Error("Email not verified. Check mailbox.");
            error.statusCode = 403;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) throw new Error("Invalid password");

        return {
            id: user.id,
            name: user.full_name,
            role: user.role
        };
    }


    async dispatchProfileUpdateOtp(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Target user entity not found.");

        // Generate 6-digit cryptographic security code token
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // Code valid for 15 minutes

        await user.update({
            otp_code: otp,
            otp_expiry: expiry
        });

        // Email dispatch execution payload
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '🛡️ SEWA LOGISTICS - Profile Alteration Verification Token',
            html: `<p>A modification request was generated for your profile. Use this code to authorize the change:</p>
                   <h2>${otp}</h2>
                   <p>If you did not execute this choice, update your credentials immediately.</p>`
        };

        await mailer.sendMail(mailOptions);
        return true;
    }

    async commitProfileUpdates(userId, email, plainPassword, tokenValue) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Identity record missing.");

        // OTP verification security assertions
        if (!user.otp_code || user.otp_code !== tokenValue) {
            throw new Error("Invalid authorization token values.");
        }
        if (new Date() > new Date(user.otp_expiry)) {
            throw new Error("Expired security authorization token. Generate a new code.");
        }

        const updates = { email };

        // Process conditional password change safely
        if (plainPassword) {
            updates.password_hash = await bcrypt.hash(plainPassword, 10);
        }

        // Clear tokens after use
        updates.otp_code = null;
        updates.otp_expiry = null;

        await user.update(updates);
        return true;
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("All password verification parameters are strictly required.");
        }

        // 1. Fetch user profile from database ledger
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Target identity profile missing.");

        // 2. Security Check: Compare entered current password with the DB hash
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            throw new Error("The current password you entered is incorrect.");
        }

        // 3. Prevent reuse: Ensure the new password isn't identical to the old one
        const isSameAsOld = await bcrypt.compare(newPassword, user.password_hash);
        if (isSameAsOld) {
            throw new Error("New password cannot be identical to your current password.");
        }

        // 4. Hash and save the new password
        const secureHash = await bcrypt.hash(newPassword, 10);
        await user.update({ password_hash: secureHash });

        return true;
    }
    // Place this right inside your AuthService class (e.g., above changeUserPassword)
    async fetchProfileById(userId) {
        if (!userId) {
            throw new Error("User ID is required to fetch profile records.");
        }

        // Target the record by primary key using Sequelize
        const user = await User.findByPk(userId, {
            attributes: ['id', ['full_name', 'name'], 'email', 'role'] 
            // 💡 Notice ['full_name', 'name'] aliases your DB column to 'name' automatically!
        });

        if (!user) {
            throw new Error("User profile not found.");
        }

        return user;
    }
}

module.exports = new AuthService();