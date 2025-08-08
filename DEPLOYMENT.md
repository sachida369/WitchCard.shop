# WitchCard Deployment Guide

This guide covers deploying WitchCard to various platforms with proper payment integration and environment configuration.

## 🚀 Quick Deploy Options

### Replit (Recommended)
```bash
# 1. Import this repository to Replit
# 2. Add environment variables in Replit Secrets:
#    - RAZORPAY_KEY_SECRET
#    - PROKERALA_CLIENT_ID  
#    - PROKERALA_CLIENT_SECRET
# 3. Run the project
npm start
```

### Heroku
```bash
# 1. Install Heroku CLI
# 2. Create app
heroku create witchcard-app

# 3. Set environment variables
heroku config:set RAZORPAY_KEY_SECRET=your_secret_key
heroku config:set PROKERALA_CLIENT_ID=your_client_id
heroku config:set PROKERALA_CLIENT_SECRET=your_client_secret

# 4. Deploy
git push heroku main
```

### Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
```

## 🔐 Environment Variables

### Required Variables
```env
RAZORPAY_KEY_SECRET=rzp_test_your_secret_key
PROKERALA_CLIENT_ID=your_prokerala_client_id
PROKERALA_CLIENT_SECRET=your_prokerala_client_secret
```

### Optional Variables
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public
PORT=5000
NODE_ENV=production
```

## 💳 Payment Configuration

### Razorpay (Primary)
1. **Test Mode** (Current)
   - Key ID: `rzp_test_OMhwadNjZxkUle`
   - Secret: Set in environment variables

2. **Production Mode**
   - Get production keys from Razorpay dashboard
   - Update key ID in frontend files:
     - `card-form.js` line 4
     - `card-engine.js` line 270
     - `kundali.html` line 754

### Stripe (Additional Option)
- Configure both `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`
- Endpoint: `/api/create-payment-intent`

## 🌐 Domain Configuration

### Custom Domain Setup
1. **Update CORS origins** in `server.js`:
```javascript
app.use(cors({
    origin: ['https://yourdomain.com', 'http://localhost:5000'],
    credentials: true
}));
```

2. **Update Razorpay webhook URLs**:
   - Payment success: `https://yourdomain.com/api/verify-payment`
   - Webhook endpoint for real-time updates

## 📦 Build Process

### Production Build Steps
```bash
# 1. Install dependencies
npm install

# 2. Set NODE_ENV
export NODE_ENV=production

# 3. Start server
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 🔍 Health Checks

### API Endpoints
- Health: `GET /api/health`
- Kundali: `POST /api/kundali`
- Payment Verification: `POST /api/verify-payment`
- Order Creation: `POST /api/create-order`

### Testing Commands
```bash
# Health check
curl https://yourdomain.com/api/health

# Test Kundali API (requires credentials)
curl -X POST https://yourdomain.com/api/kundali \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","dob":"1990-01-15","place":"Mumbai"}'
```

## 🛡️ Security Checklist

### Pre-Production
- [ ] All API keys stored in environment variables
- [ ] HTTPS enabled for production
- [ ] CORS configured for your domain
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Payment webhook signatures verified

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Ensure all payment endpoints use HTTPS
- Configure HSTS headers

## 📊 Monitoring

### Essential Metrics
- Payment success/failure rates
- API response times
- Error rates by endpoint
- Kundali generation success rates

### Logging
- Payment transactions (without sensitive data)
- API errors and timeouts
- User session data (anonymized)

## 🔄 Updates and Maintenance

### API Key Rotation
1. Generate new keys in respective dashboards
2. Update environment variables
3. Test thoroughly before switching
4. Monitor for any payment failures

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Security audit
npm audit
```

## 🚨 Troubleshooting

### Common Issues

1. **Payment Verification Fails**
   - Check RAZORPAY_KEY_SECRET is set correctly
   - Verify webhook signature calculation
   - Ensure order_id format matches

2. **Kundali API Timeout**
   - Check ProKerala API credentials
   - Verify internet connectivity
   - Implement retry mechanism

3. **CORS Errors**
   - Update allowed origins in server.js
   - Check domain configuration

### Performance Optimization

1. **Caching**
   - Implement Redis for payment session data
   - Cache ProKerala API responses (with TTL)

2. **CDN Integration**
   - Serve static assets via CDN
   - Optimize image compression

## 📞 Support

### Pre-deployment Testing
- Test all payment flows
- Verify Kundali generation with real data
- Check mobile responsiveness
- Validate all form submissions

### Production Monitoring
- Set up uptime monitoring
- Configure error alerting
- Monitor payment success rates
- Track API usage limits

---

**Note**: This deployment guide assumes you have proper API credentials and have tested the application in development mode first.