import Razorpay from "razorpay";
import crypto from "crypto";

// Netlify functions must export `handler`
export async function handler(event, context) {
  // Enable CORS for frontend calls
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { action, ...data } = body;

    switch (action) {
      case "create-order":
        return await createRazorpayOrder(data, headers);

      case "verify-payment":
        return await verifyPayment(data, headers);

      case "generate-kundali":
        return await generateKundali(data, headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid action" })
        };
    }
  } catch (err) {
    console.error("Server Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}

// ✅ Create Razorpay Order
async function createRazorpayOrder({ amount, currency = "INR", receipt }, headers) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, order })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Order creation failed", message: error.message })
    };
  }
}

// ✅ Verify Razorpay Payment
async function verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }, headers) {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid signature" }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Payment verified" }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Payment verification failed", message: error.message }) };
  }
}

// ✅ Generate Kundali from Prokerala API
async function generateKundali({ name, dob, time, lat, lng, place }, headers) {
  try {
    // 1. Get Prokerala API token
    const tokenResponse = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.PROKERALA_CLIENT_ID,
        client_secret: process.env.PROKERALA_SECRET
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to get Prokerala API token");

    // 2. Call Kundli API
    const kundaliResponse = await fetch("https://api.prokerala.com/v2/astrology/kundli", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ayanamsa: 1,
        datetime: `${dob}T${time}:00`,
        coordinates: `${lat},${lng}`,
        language: "en"
      })
    });

    const kundaliData = await kundaliResponse.json();
    if (!kundaliResponse.ok) throw new Error(kundaliData.message || "Kundali API call failed");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: kundaliData,
        user: { name, dob, time, place }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Kundali generation failed", message: error.message })
    };
  }
}
