const Razorpay = require('razorpay');
const crypto = require('crypto');
const fetch = require('node-fetch');

// Initialize Razorpay using environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight (CORS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { action, ...data } = JSON.parse(event.body);

    switch (action) {
      case 'get-public-key':
        return sendResponse({ key: process.env.RAZORPAY_KEY_ID });

      case 'create-order':
        return await createOrder(data);

      case 'verify-payment':
        return await verifyPayment(data);

      case 'generate-kundali':
        return await generateKundali(data);

      default:
        return sendError('Invalid action');
    }
  } catch (err) {
    console.error('Function error:', err);
    return sendError('Internal server error', 500);
  }

  // Helper functions
  function sendResponse(data, status = 200) {
    return { statusCode: status, headers, body: JSON.stringify({ success: true, ...data }) };
  }

  function sendError(message, status = 400) {
    return { statusCode: status, headers, body: JSON.stringify({ success: false, error: message }) };
  }

  async function createOrder({ amount }) {
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      });
      return sendResponse({ order });
    } catch (err) {
      console.error('Order creation error:', err);
      return sendError('Failed to create order', 500);
    }
  }

  async function verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
    try {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return sendError('Payment verification failed');
      }

      return sendResponse({ message: 'Payment verified successfully' });
    } catch (err) {
      console.error('Payment verification error:', err);
      return sendError('Verification failed', 500);
    }
  }

  async function generateKundali({ name, dob, time, lat, lng, place }) {
    try {
      // Get ProKerala OAuth token
      const tokenRes = await fetch('https://api.prokerala.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.PROKERALA_CLIENT_ID,
          client_secret: process.env.PROKERALA_CLIENT_SECRET
        })
      });

      if (!tokenRes.ok) throw new Error('Failed to get ProKerala token');
      const { access_token } = await tokenRes.json();

      const birthDate = new Date(`${dob}T${time}:00`);
      const coordinates = `${lat},${lng}`;
      const apiParams = new URLSearchParams({
        ayanamsa: '1',
        coordinates,
        datetime: birthDate.toISOString()
      });

      // Call ProKerala API
      const kundaliRes = await fetch(`https://api.prokerala.com/v2/astrology/kundli/advanced?${apiParams}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'WitchCard/1.0' }
      });

      if (!kundaliRes.ok) throw new Error('ProKerala API request failed');
      const kundaliData = await kundaliRes.json();

      return sendResponse({
        data: {
          name,
          birth_details: { date: dob, time, place, coordinates },
          chart_data: kundaliData.data || {},
          planetary_positions: kundaliData.data?.planets || {},
          houses: kundaliData.data?.houses || {},
          timestamp: new Date().toISOString(),
          source: 'ProKerala Vedic Astrology API'
        }
      });
    } catch (err) {
      console.error('Kundali generation error:', err);
      return sendError('Failed to generate kundali', 500);
    }
  }
};
