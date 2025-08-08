// Express server for WitchCard with Kundali API integration and security
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://witchcard.shop', 'http://localhost:5000', /\.replit\.app$/],
    credentials: true
}));

// Rate limiting for API endpoints
const rateLimitMap = new Map();
const rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }
    
    const requests = rateLimitMap.get(ip);
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    next();
};

// Serve static files
app.use(express.static('./', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Kundali API endpoint with security and error handling
app.post('/api/kundali', rateLimit, async (req, res) => {
    try {
        const { name, dob, tob, place, gender } = req.body;
        
        // Input validation
        if (!name || !dob || !place) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, dob, place' 
            });
        }
        
        // Sanitize inputs
        const sanitizedName = name.trim().slice(0, 50);
        const sanitizedPlace = place.trim().slice(0, 100);
        const sanitizedGender = gender === 'female' ? 'female' : 'male';
        
        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dob)) {
            return res.status(400).json({ 
                error: 'Invalid date format. Use YYYY-MM-DD' 
            });
        }
        
        // Get ProKerala credentials from environment
        const clientId = process.env.PROKERALA_CLIENT_ID;
        const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
            console.error('Missing ProKerala API credentials');
            return res.status(500).json({ 
                error: 'Server configuration error' 
            });
        }
        
        console.log('Getting OAuth2 token from ProKerala...');
        
        // First, get OAuth2 token from ProKerala
        const tokenResponse = await fetch('https://api.prokerala.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': clientId,
                'client_secret': clientSecret
            })
        });
        
        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('ProKerala token error:', tokenResponse.status, errorText);
            return res.status(502).json({ 
                error: 'Authentication failed with ProKerala API' 
            });
        }
        
        const tokenData = await tokenResponse.json();
        console.log('Token received successfully');
        const accessToken = tokenData.access_token;
        
        // Parse birth date and time
        const birthDate = new Date(`${dob}T${tob || '12:00'}:00`);
        
        // Convert place name to coordinates using a geocoding service
        let coordinates;
        try {
            const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(sanitizedPlace)}&limit=1`, {
                headers: {
                    'User-Agent': 'WitchCard/1.0 (https://witchcard.shop)'
                }
            });
            
            if (!geocodeResponse.ok) {
                throw new Error(`Geocoding service returned ${geocodeResponse.status}`);
            }
            
            const geocodeData = await geocodeResponse.json();
            
            if (!Array.isArray(geocodeData) || geocodeData.length === 0) {
                return res.status(400).json({ 
                    error: 'Location not found. Please provide a valid place name like "New Delhi, India" or "Mumbai, Maharashtra"' 
                });
            }
            
            coordinates = `${geocodeData[0].lat},${geocodeData[0].lon}`;
        } catch (error) {
            console.error('Geocoding error:', error);
            return res.status(500).json({ 
                error: 'Unable to process location information. Please try a different location format.' 
            });
        }
        
        // Prepare ProKerala API request parameters
        const apiParams = new URLSearchParams({
            'ayanamsa': '1', // Lahiri ayanamsa
            'coordinates': coordinates,
            'datetime': birthDate.toISOString()
        });
        
        // Make API call to ProKerala Kundali service
        const kundaliResponse = await fetch(`https://api.prokerala.com/v2/astrology/kundli/advanced?${apiParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'WitchCard/1.0'
            }
        });
        
        if (!kundaliResponse.ok) {
            const errorText = await kundaliResponse.text();
            console.error('ProKerala API error:', kundaliResponse.status, errorText);
            return res.status(502).json({ 
                error: 'ProKerala API service temporarily unavailable' 
            });
        }
        
        const kundaliResult = await kundaliResponse.json();
        
        // Sanitize and format ProKerala response for frontend
        const sanitizedResult = {
            success: true,
            name: sanitizedName,
            birth_details: {
                date: dob,
                time: tob || 'Time not specified',
                place: sanitizedPlace,
                coordinates: coordinates
            },
            chart_data: kundaliResult.data || {},
            planetary_positions: kundaliResult.data?.planets || {},
            houses: kundaliResult.data?.houses || {},
            ayanamsa: kundaliResult.data?.ayanamsa || {},
            predictions: kundaliResult.data?.birth_details || {},
            timestamp: new Date().toISOString(),
            source: 'ProKerala Vedic Astrology API'
        };
        
        res.json(sanitizedResult);
        
    } catch (error) {
        console.error('Kundali API error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Payment verification endpoint for Razorpay
app.post('/api/verify-payment', rateLimit, async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;
        
        if (!payment_id || !order_id || !signature) {
            return res.status(400).json({ 
                error: 'Missing payment verification data' 
            });
        }
        
        // Verify Razorpay payment signature
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpaySecret) {
            return res.status(500).json({ error: 'Payment configuration error' });
        }

        // Create expected signature for verification
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', razorpaySecret)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ 
                error: 'Payment verification failed',
                details: 'Invalid signature'
            });
        }
        
        // Store payment data temporarily (in production, use database)
        const paymentData = {
            payment_id,
            order_id,
            signature,
            status: 'verified',
            timestamp: new Date().toISOString()
        };
        
        res.json({ 
            success: true, 
            payment: paymentData 
        });
        
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

// Create Razorpay order endpoint
app.post('/api/create-order', rateLimit, async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                error: 'Valid amount is required' 
            });
        }

        // In production, create actual order with Razorpay API
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

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Stripe payment intent endpoint (additional option)
app.post('/api/create-payment-intent', rateLimit, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(503).json({ 
                error: 'Stripe not configured' 
            });
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'inr',
            payment_method_types: ['card'],
        });

        res.json({
            success: true,
            client_secret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Stripe payment intent error:', error);
        res.status(500).json({ 
            error: 'Failed to create payment intent',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'product.html'));
});

app.get('/kundali', (req, res) => {
    res.sendFile(path.join(__dirname, 'kundali.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔮 WitchCard server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`Kundali API: ${process.env.KUNDALI_CLIENT_ID ? 'Configured' : 'Missing credentials'}`);
    console.log(`Razorpay: ${process.env.RAZORPAY_KEY ? 'Configured' : 'Missing key'}`);
});

module.exports = app;