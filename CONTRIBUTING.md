# Contributing to WitchCard

Thank you for your interest in contributing to WitchCard! This document provides guidelines for contributing to our mystical fortune platform.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Razorpay API credentials
- ProKerala API credentials

### Setting Up Development Environment

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/witchcard.git
cd witchcard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with:
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_OMhwadNjZxkUle
RAZORPAY_KEY_SECRET=your_secret_key

# ProKerala API
PROKERALA_CLIENT_ID=your_client_id
PROKERALA_CLIENT_SECRET=your_client_secret

# Server
PORT=5000
NODE_ENV=development
```

4. **Start development server**
```bash
npm run dev
```

## 🎯 Project Structure

```
witchcard/
├── server.js              # Express server
├── index.html             # Home page
├── product.html           # Product gallery
├── kundali.html           # Kundali generator
├── card-form.html         # Dynamic form
├── scratch.html           # Scratch reveal
├── assets/                # Static assets
├── attached_assets/       # Media files
├── style.css             # Main stylesheet
├── card-form.css         # Form styling
└── mystical-algorithms.js # Calculation engine
```

## 💳 Payment Integration

### Razorpay (Primary)
- Test Key: `rzp_test_OMhwadNjZxkUle`
- Used for all product purchases and Kundali generation
- Supports UPI, cards, netbanking

### Stripe (Additional Option)
- Available as secondary payment method
- Requires STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY

## 🔮 Feature Areas

### 1. Mystical Cards System
- 9 different reading types
- Dynamic form generation
- Interactive scratch reveals

### 2. Kundali Generator
- ProKerala API integration
- Interactive maps
- PDF generation

### 3. Payment Processing
- Razorpay integration
- Stripe support
- Payment verification

### 4. UI/UX
- Korean cyber-astrology theme
- Mobile-responsive design
- Neon animations

## 🛠️ Development Guidelines

### Code Style
- Use vanilla JavaScript (no frameworks)
- Follow existing naming conventions
- Add comments for complex algorithms
- Maintain responsive design principles

### Payment Implementation
```javascript
// Always use the configured Razorpay key
const options = {
    key: 'rzp_test_OMhwadNjZxkUle',
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    name: 'WitchCard',
    // ... other options
};
```

### API Integration
- Use authentic data sources only
- Implement proper error handling
- Add loading states for better UX

## 🧪 Testing

### Payment Testing
- Use Razorpay test cards for testing
- Test all payment flows (success/failure)
- Verify webhook integrations

### API Testing
- Test with real ProKerala credentials
- Handle rate limiting gracefully
- Test geocoding edge cases

## 📝 Commit Guidelines

Use conventional commit format:
```
feat: add Stripe payment integration
fix: resolve Kundali API timeout issue
style: update neon button animations
docs: update API documentation
```

## 🐛 Bug Reports

When reporting bugs, include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Payment method used (if applicable)
- Console errors

## 💡 Feature Requests

For new features:
- Describe the use case
- Consider mobile compatibility
- Align with mystical theme
- Consider payment implications

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables
- Validate all user inputs
- Follow payment security best practices

## 📚 Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [ProKerala API Docs](https://api.prokerala.com/docs)
- [Vedic Astrology Basics](https://www.prokerala.com/astrology/)

## 💬 Getting Help

- Create issues for bugs and features
- Join discussions in Issues tab
- Follow existing code patterns
- Ask questions in pull requests

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for making WitchCard better! 🌟