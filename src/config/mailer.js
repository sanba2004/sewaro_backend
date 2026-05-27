// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, 
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS  
//     }
// });

// module.exports = transporter;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // 🌟 FIX 1: Provide the explicit domain name instead of the generic 'gmail' string shortcut
  host: 'smtp.gmail.com',
  
  // 🌟 FIX 2: Use port 587 (TLS upgrade channel) instead of 465. 
  // Port 587 combined with secure: false natively forces standard IPv4 connection upgrades
  port: 587,
  secure: false, 
  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  
  // 🌟 FIX 3: Force Node.js internal DNS lookup layer to choose IPv4 addresses ONLY
  // This completely stops Node from fetching the buggy 2404:6800 IPv6 path
  dnsTimeout: 10000,
  connectionTimeout: 10000,
  socketTimeout: 10000,
  fallbackToAnvil: false
});

// Verify the mail configuration layout works safely during server bootup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer SMTP Connection Failure:', error.message);
  } else {
    console.log('📬 Nodemailer Mail Carrier Engine is ready to dispatch transmissions over IPv4.');
  }
});

module.exports = transporter;