// Vercel Serverless Function for Kundali Generation
// This handles Razorpay order creation and ProKerala API integration

// /api/kundli.js
import Razorpay from "razorpay";
import crypto from "crypto";

// Enable fetch on Node 18+ (Vercel supports it natively)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { action, ...data } = req.body;

    switch (action) {
      case "create-order":
        return await createRazorpayOrder(res, data);

      case "verify-payment":
        return await verifyPayment(res, data);

      case "generate-kundali":
        return await generateKundali(res, data);

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
}

// ✅ Create Razorpay Order
async function createRazorpayOrder(res, { amount, currency = "INR", receipt }) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ error: "Order creation failed", message: error.message });
  }
}

// ✅ Verify Razorpay Payment
async function verifyPayment(res, { razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ error: "Payment verification failed", message: error.message });
  }
}

// ✅ Generate Kundali from Prokerala API
async function generateKundali(res, { name, dob, time, lat, lng, place }) {
  try {
    // 1. Get Prokerala API token
    const tokenResponse = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.PROKERALA_CLIENT_ID,
        client_secret: process.env.PROKERALA_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to get Prokerala API token");

    // 2. Call Kundli API
    const kundaliResponse = await fetch("https://api.prokerala.com/v2/astrology/kundli", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ayanamsa: 1,
        datetime: `${dob}T${time}:00`,
        coordinates: `${lat},${lng}`,
        language: "en",
      }),
    });

    const kundaliData = await kundaliResponse.json();
    if (!kundaliResponse.ok) throw new Error(kundaliData.message || "Kundali API call failed");

    return res.status(200).json({
      success: true,
      data: kundaliData,
      user: { name, dob, time, place },
    });
  } catch (error) {
    return res.status(500).json({ error: "Kundali generation failed", message: error.message });
  }
}
