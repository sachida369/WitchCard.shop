# WitchCard - Mystical Fortune Platform 🔮

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sachida369/witchcard.shop)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://witchcard.shop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive mystical fortune platform featuring authentic Vedic astrology, interactive tarot cards, and personalized readings with secure payment processing.

## ✨ Features

### 🎴 Mystical Cards (9 Types)
- **Past Life Regression** - Discover your previous incarnations
- **Mangalik Analysis** - Mars compatibility readings
- **Marriage Prediction** - Future partnership insights  
- **Lucky Name Analysis** - Numerological name optimization
- **Blocking Planet** - Identify cosmic obstacles
- **Future Child** - Offspring predictions
- **Twin Flame** - Soul mate connections
- **Karmic Relationships** - Past life connections
- **Future Life Partner** - Destiny partnership

### 🌟 Kundali Generator
- Authentic **ProKerala API** integration
- Interactive **Leaflet maps** for location selection
- Real-time **astronomical calculations**
- **PDF export** functionality
- **WhatsApp sharing** capabilities
- Mobile-responsive design

### 💳 Payment Integration
- **Primary**: Razorpay (UPI, Cards, Net Banking, Wallets)
- **Secondary**: Stripe (International cards)
- Secure server-side verification
- Production-ready payment flows

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Razorpay account (live keys)
- ProKerala API credentials

### Local Development

```bash
# Clone repository
git clone https://github.com/sachida369/witchcard.shop.git
cd witchcard.shop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# ProKerala API
PROKERALA_CLIENT_ID=your_prokerala_client_id
PROKERALA_SECRET=your_prokerala_secret

# Optional: Stripe (for additional payment option)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public

# Server
PORT=5000
NODE_ENV=production
```

## 🌐 Deployment Options

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sachida369/witchcard.shop)

### Netlify

```bash
# Build command: npm run build
# Publish directory: .
# Environment variables: Set in Netlify dashboard
```

### Heroku

```bash
heroku create witchcard-app
heroku config:set RAZORPAY_KEY_SECRET=your_key
heroku config:set PROKERALA_CLIENT_ID=your_id  
heroku config:set PROKERALA_SECRET=your_secret
git push heroku main
```

## 📁 Project Structure

```
witchcard.shop/
├── 🏠 Core Pages
│   ├── index.html              # Homepage with hero & navigation
│   ├── product.html            # Product gallery with 9 cards
│   ├── kundali.html            # Vedic astrology generator
│   ├── card-form.html          # Dynamic form for readings
│   └── scratch.html            # Interactive reveal page
│
├── 🎨 Styling & Scripts
│   ├── style.css               # Main responsive stylesheet
│   ├── card-form.css           # Form-specific styles
│   ├── script.js               # Homepage interactions
│   ├── card-form.js            # Form validation & payments
│   ├── card-engine.js          # Card logic & mystical algorithms
│   ├── enhanced-scratch.js     # Scratch reveal mechanics
│   └── mystical-algorithms.js  # Fortune calculation engine
│
├── 🖼️ Assets
│   ├── assets/                 # Static images & icons
│   └── attached_assets/        # Generated mystical artwork
│       └── generated_images/   # AI-generated card artwork
│
├── 🌐 Backend (Vercel Functions)
│   └── api/
│       └── kundli.js           # Serverless API endpoints
│
├── 📄 SEO & PWA
│   ├── sitemap.xml            # Search engine sitemap
│   ├── robots.txt             # Crawler instructions
│   ├── manifest.json          # PWA configuration
│   └── vercel.json            # Deployment configuration
│
└── 📋 Documentation
    ├── README.md              # This file
    ├── DEPLOYMENT.md          # Detailed deployment guide
    ├── CONTRIBUTING.md        # Developer guidelines
    ├── SECURITY.md            # Security policies
    └── LICENSE                # MIT license
```

## 🔧 API Endpoints

### Server Endpoints (Replit/Local)
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment signature  
- `POST /api/kundali` - Generate Vedic birth chart
- `GET /api/health` - Health check

### Vercel Functions
- `POST /api/kundli` - Unified kundali & payment API

## 🎯 SEO Optimization

- ✅ Semantic HTML5 structure
- ✅ Open Graph meta tags
- ✅ Twitter Card integration  
- ✅ Structured data markup
- ✅ Mobile-first responsive design
- ✅ Fast loading with image optimization
- ✅ Progressive Web App (PWA) ready

## 🛡️ Security Features

- 🔒 Environment variables for secrets
- 🔒 Payment signature verification
- 🔒 CORS protection
- 🔒 Rate limiting on API endpoints
- 🔒 Input validation & sanitization
- 🔒 HTTPS-only in production

## 💰 Payment Flow

1. **User selects service** (Kundali ₹50, Cards ₹10 each)
2. **Form validation** ensures all required fields
3. **Order creation** via secure backend API
4. **Razorpay checkout** with UPI/Cards/Wallets
5. **Payment verification** using cryptographic signatures
6. **Content delivery** after successful payment

## 🔮 Mystical Algorithms

The platform uses sophisticated algorithms for:

- **Vedic Astrology**: Planetary position calculations
- **Numerology**: Name analysis and lucky numbers
- **Tarot Logic**: Card interpretation systems
- **Karmic Analysis**: Past-life regression calculations

*Note: For production accuracy, integrate Swiss Ephemeris library for astronomical calculations.*

## 🌍 Browser Support

- ✅ Chrome 80+ (Primary target)
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance

- **Lighthouse Score**: 90+ (Performance, SEO, Accessibility)
- **Load Time**: <3s on 3G networks
- **Image Optimization**: WebP format with fallbacks
- **CSS/JS**: Minified and compressed
- **CDN Ready**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@witchcard.shop
- 🐛 Issues: [GitHub Issues](https://github.com/sachida369/witchcard.shop/issues)
- 📖 Documentation: [Wiki](https://github.com/sachida369/witchcard.shop/wiki)

## 🙏 Acknowledgments

- **ProKerala** for authentic Vedic astrology API
- **Razorpay** for secure payment processing
- **OpenStreetMap** for geocoding services
- **Leaflet** for interactive maps
- **Google Fonts** for typography

---

**Built with ❤️ for seekers of cosmic wisdom**

*WitchCard - Where destiny meets technology* ✨