
/**
 * Dispatches an automated update to a customer via Nest SMS
 * @param {string} phoneNumber - The recipient's phone number (e.g., s.receiver_contact)
 */
export const sendCollectionNotification = async (phoneNumber) => {
  try {
    const endpoint = 'https://auth.nestsms.com/api/v1/sms/send';
    
    const payload = {
      to: phoneNumber,
      // This is the specific verified template ID from your "Ready to collect" image
      template_id: '0ead6c3b-27f4-47b6-a45e-82a638f5db14' 
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        // process.env loads this securely from your environment configuration file
        'X-API-Key': process.env.NEST_SMS_KEY, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Nest SMS Gateway Rejected Request:', result);
      return { success: false, error: result.message || 'SMS transmission failed.' };
    }

    console.log(`✨ Status update text dispatched to ${phoneNumber}.`);
    return { success: true, data: result };

  } catch (error) {
    console.error('Critical exception inside SMS Service:', error);
    return { success: false, error: error.message };
  }
};