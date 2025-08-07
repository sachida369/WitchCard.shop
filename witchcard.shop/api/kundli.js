// File: api/kundli.js (Vercel Serverless Function with Razorpay + Prokerala)

import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_OMhwadNjZxkUle',
  key_secret: process.env.RAZORPAY_SECRET
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      fullName,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      lat,
      lng,
      isTimeUnknown = false,
      createOrderOnly = false
    } = req.body;

    if (createOrderOnly) {
      try {
        const order = await razorpay.orders.create({
          amount: 5000,
          currency: 'INR',
          receipt: 'kundali_' + Date.now(),
          payment_capture: 1
        });
        return res.status(200).json({ order });
      } catch (err) {
        return res.status(500).json({ error: 'Razorpay order error: ' + err.message });
      }
    }

    const time = isTimeUnknown ? '12:00' : timeOfBirth;
    const timezone = 5.5;

    const payload = {
      datetime: `${dateOfBirth} ${time}`,
      coordinates: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      },
      timezone,
      ayanamsa: 1
    };

    try {
      const apiResponse = await fetch('https://api.prokerala.com/v2/astrology/birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PROKERALA_SECRET}`,
          'X-Client-Id': process.env.PROKERALA_CLIENT_ID
        },
        body: JSON.stringify(payload)
      });

      if (!apiResponse.ok) {
        const error = await apiResponse.json();
        return res.status(500).json({ error: error.message || 'Prokerala API error' });
      }

      const result = await apiResponse.json();

      return res.status(200).json(result);

    } catch (err) {
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
  } else {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
}
