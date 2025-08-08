const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with your live keys
const razorpay = new Razorpay({
  key_id: 'rzp_live_ZTZl8KJQSoEtd0',
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, ...data } = JSON.parse(event.body);

    switch (action) {
      case 'create-order':
        return await createOrder(data);
      
      case 'verify-payment':
        return await verifyPayment(data);
      
      case 'generate-kundali':
        return await generateKundali(data);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }

  async function createOrder(data) {
    try {
      const { amount } = data;
      
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          order: order
        })
      };
    } catch (error) {
      console.error('Order creation error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to create order'
        })
      };
    }
  }

  async function verifyPayment(data) {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;
      
      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Payment verification failed'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Payment verified successfully'
        })
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Verification failed'
        })
      };
    }
  }

  async function generateKundali(data) {
    try {
      const { name, dob, time, lat, lng, place } = data;
      
      // Get ProKerala OAuth token
      const tokenResponse = await fetch('https://api.prokerala.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': process.env.PROKERALA_CLIENT_ID,
          'client_secret': process.env.PROKERALA_CLIENT_SECRET
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get ProKerala token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Prepare birth date and coordinates
      const birthDate = new Date(`${dob}T${time}:00`);
      const coordinates = `${lat},${lng}`;
      
      const apiParams = new URLSearchParams({
        'ayanamsa': '1',
        'coordinates': coordinates,
        'datetime': birthDate.toISOString()
      });

      // Call ProKerala Kundali API
      const kundaliResponse = await fetch(`https://api.prokerala.com/v2/astrology/kundli/advanced?${apiParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'WitchCard/1.0'
        }
      });

      if (!kundaliResponse.ok) {
        throw new Error('ProKerala API request failed');
      }

      const kundaliResult = await kundaliResponse.json();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            name: name,
            birth_details: {
              date: dob,
              time: time,
              place: place,
              coordinates: coordinates
            },
            chart_data: kundaliResult.data || {},
            planetary_positions: kundaliResult.data?.planets || {},
            houses: kundaliResult.data?.houses || {},
            timestamp: new Date().toISOString(),
            source: 'ProKerala Vedic Astrology API'
          }
        })
      };
    } catch (error) {
      console.error('Kundali generation error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to generate kundali'
        })
      };
    }
  }
};
