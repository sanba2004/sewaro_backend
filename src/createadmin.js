const sequelize = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function bootstrapAdmin() {
    try {
        // 1. Authenticate with Aiven cloud database
        await sequelize.authenticate();
        console.log('🔗 Connected to cloud database...');

        // 2. 🛡️ Force Sequelize to create tables in the empty cloud database if they don't exist
        console.log('🏗️ Syncing database models to build missing tables...');
        await sequelize.sync({ alter: true }); 
        console.log('✅ Database tables verified/created successfully.');

        const adminEmail = 'sewaro151@gmail.com'; // Change to your desired admin email
        const adminPassword = 'adminisgood8808'; // Change to a secure password

        // 3. Check if the admin already exists
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists inside database.');
            process.exit(0);
        }

        // 4. Hash the admin password 
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // 5. Inject the admin record directly into the users table
        await User.create({
            full_name: 'System Administrator',
            email: adminEmail,
            password_hash: hashedPassword,
            role: 'admin',
            is_verified: 1, // Bypass verification step entirely
            otp_code: null
        });

        console.log('🎉 Success! Admin user created successfully in your Aiven Cloud Database.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

bootstrapAdmin();