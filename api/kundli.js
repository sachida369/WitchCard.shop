// Vercel Serverless Function for Kundali Generation
// This handles Razorpay order creation and ProKerala API integration

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action, ...data } = req.body;
    
    // Environment variables from Vercel
    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
    const PROKERALA_CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
    const PROKERALA_SECRET = process.env.PROKERALA_SECRET;

    switch (action) {
      case 'create-order':
        return await createRazorpayOrder(req, res, data);
        
      case 'generate-kundali':
        return await generateKundali(req, res, data);
        
      case 'verify-payment':
        return await verifyPayment(req, res, data);
        
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function createRazorpayOrder(req, res, { amount, currency = 'INR', receipt }) {
  try {
    // In production, integrate actual Razorpay Orders API
    const order = {
      id: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      entity: 'order',
      amount: amount,
      amount_paid: 0,
      amount_due: amount,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Order creation failed',
      message: error.message 
    });
  }
}

async function generateKundali(req, res, { name, dob, time, place, lat, lng }) {
  try {
    // Step 1: Get ProKerala API token
    const tokenResponse = await fetch('https://api.prokerala.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.PROKERALA_CLIENT_ID,
        client_secret: process.env.PROKERALA_SECRET
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get API token');
    }

    // Step 2: Make kundali API call
    const kundaliResponse = await fetch('https://api.prokerala.com/v2/astrology/kundli', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ayanamsa: 1, // Lahiri
        datetime: `${dob}T${time}:00`,
        coordinates: `${lat},${lng}`,
        language: 'en'
      })
    });

    const kundaliData = await kundaliResponse.json();
    
    if (!kundaliResponse.ok) {
      throw new Error(kundaliData.message || 'Kundali generation failed');
    }

    res.status(200).json({
      success: true,
      data: kundaliData,
      user: { name, dob, time, place }
    });

  } catch (error) {
    console.error('Kundali generation error:', error);
    res.status(500).json({ 
      error: 'Kundali generation failed',
      message: error.message 
    });
  }
}

async function verifyPayment(req, res, { razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  try {
    const crypto = require('crypto');
    
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        error: 'Payment verification failed',
        details: 'Invalid signature'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Payment verification failed',
      message: error.message 
    });
  }
}