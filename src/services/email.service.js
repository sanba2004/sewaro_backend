// const transporter = require('../config/mailer');

// class EmailService {
//     async sendVerificationOtp(email, fullName, otp) {
//         const mailOptions = {
//             from: `"Sewa Logistics" <${process.env.EMAIL_USER}>`,
//             to: email, 
//             subject: 'Verify Your Sewa Logistics Account',
//             html: `<h3>Welcome ${fullName}</h3>
//                    <p>Your verification code is: <b style="font-size: 20px; color: #007bff;">${otp}</b></p>`
//         };
//         return transporter.sendMail(mailOptions);
//     }

//     async sendQuoteRequest(quoteData) {
//         const { senderCountry, receiverCountry, weight, description, deliveryType, contactInfo } = quoteData;
        
//         const mailLayoutOptions = {
//             from: `"Sewa Quotes Desk" <${process.env.EMAIL_USER}>`,
//             to: 'redsanba@gmail.com',
//             subject: `🚨 New Quote Request Alert: [${deliveryType.toUpperCase()} Handling]`,
//             html: `
//               <div style="font-family: sans-serif; padding: 20px; color: #1a2530; max-width: 600px; border: 1px solid #eceff0; border-radius: 12px;">
//                 <h2 style="color: #0250a3; border-bottom: 2px solid #0250a3; padding-bottom: 10px; margin-top: 0;">New Shipment Valuation Request</h2>
//                 <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//                   <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Route:</td><td style="padding: 6px 0; color: #0f1c2a;">From ${senderCountry} to ${receiverCountry}</td></tr>
//                   <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Mass Weight:</td><td style="padding: 6px 0; color: #0f1c2a;">${weight} kg</td></tr>
//                   <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Service Type:</td><td style="padding: 6px 0; color: #0f1c2a;">${deliveryType === 'special' ? '🔴 Special Service' : '🔵 Standard Service'}</td></tr>
//                   <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Client Contact:</td><td style="padding: 6px 0; color: #0056b3; font-weight: bold;">${contactInfo}</td></tr>
//                 </table>
//                 <div style="background: #f7f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0250a3;">
//                   <p style="margin: 0; line-height: 1.6; color: #566573; font-size: 14px;">${description}</p>
//                 </div>
//               </div>`
//         };
//         return transporter.sendMail(mailLayoutOptions);
//     }
// }

// module.exports = new EmailService();
const transporter = require('../config/mailer');

class EmailService {
    async sendVerificationOtp(email, fullName, otp) {
        const mailOptions = {
            from: `"Sewa Logistics" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: 'Verify Your Sewa Logistics Account',
            html: `<h3>Welcome ${fullName}</h3>
                   <p>Your verification code is: <b style="font-size: 20px; color: #007bff;">${otp}</b></p>`
        };

        // ✨ FIX: Wrap this inside a robust try/catch block so an email failure NEVER kills the server process
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('📬 OTP successfully dispatched to:', email);
            return info;
        } catch (mailerError) {
            // 🚨 This prints the EXACT configuration problem straight to your Render Logs without crashing the site
            console.error('❌ Nodemailer failed internally inside email.service.js:', mailerError.message);
            
            // Re-throw the clean error so your auth controller knows the email failed, 
            // but the Node.js master process stays alive safely.
            throw new Error(`Email dispatch failed: ${mailerError.message}`);
        }
    }

    async sendQuoteRequest(quoteData) {
        const { senderCountry, receiverCountry, weight, description, deliveryType, contactInfo } = quoteData;
        
        const mailLayoutOptions = {
            from: `"Sewa Quotes Desk" <${process.env.EMAIL_USER}>`,
            to: 'redsanba@gmail.com',
            subject: `🚨 New Quote Request Alert: [${deliveryType ? deliveryType.toUpperCase() : 'STANDARD'} Handling]`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #1a2530; max-width: 600px; border: 1px solid #eceff0; border-radius: 12px;">
                <h2 style="color: #0250a3; border-bottom: 2px solid #0250a3; padding-bottom: 10px; margin-top: 0;">New Shipment Valuation Request</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Route:</td><td style="padding: 6px 0; color: #0f1c2a;">From ${senderCountry} to ${receiverCountry}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Mass Weight:</td><td style="padding: 6px 0; color: #0f1c2a;">${weight} kg</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Service Type:</td><td style="padding: 6px 0; color: #0f1c2a;">${deliveryType === 'special' ? '🔴 Special Service' : '🔵 Standard Service'}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold; color: #566573;">Client Contact:</td><td style="padding: 6px 0; color: #0056b3; font-weight: bold;">${contactInfo}</td></tr>
                </table>
                <div style="background: #f7f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0250a3;">
                  <p style="margin: 0; line-height: 1.6; color: #566573; font-size: 14px;">${description}</p>
                </div>
              </div>`
        };

        // ✨ FIX: Wrap quote emails inside a safety net as well
        try {
            const info = await transporter.sendMail(mailLayoutOptions);
            console.log('📬 Quote notification successfully routed to admin.');
            return info;
        } catch (mailerError) {
            console.error('❌ Nodemailer failed inside sendQuoteRequest:', mailerError.message);
            throw new Error(`Email dispatch failed: ${mailerError.message}`);
        }
    }
}

module.exports = new EmailService();