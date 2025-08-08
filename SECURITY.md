# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in WitchCard, please report it responsibly.

### How to Report

**Do NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues by emailing: **security@witchcard.shop**

Include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Resolution**: Within 30 days (depending on complexity)

## Security Measures

### Payment Security
- All payment processing uses HTTPS
- API keys stored in environment variables only
- Payment signatures verified server-side
- No sensitive payment data stored locally

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- Environment variable protection

### Data Protection
- No personal data stored without consent
- Kundali calculations performed client-side when possible
- Location data used only for astronomical calculations
- Session data expires automatically

### Authentication
- OAuth2 flow for ProKerala API
- Secure token management
- API key rotation support

## Security Best Practices

### For Developers
```javascript
// ✅ Good - Environment variables
const apiKey = process.env.RAZORPAY_KEY_SECRET;

// ❌ Bad - Hardcoded secrets
const apiKey = 'rzp_test_12345...';
```

### For Deployment
- Use HTTPS in production
- Set secure environment variables
- Enable proper CORS headers
- Implement proper logging (without sensitive data)

### For Users
- Never share payment credentials
- Use official payment gateways only
- Verify SSL certificates
- Report suspicious activity

## Vulnerability Disclosure

We follow responsible disclosure:

1. **Report** received and acknowledged
2. **Investigation** and impact assessment
3. **Fix** developed and tested
4. **Release** of security update
5. **Public disclosure** after fix is deployed

## Security Dependencies

### Payment Processors
- **Razorpay**: PCI DSS compliant
- **Stripe**: PCI Level 1 Service Provider

### APIs
- **ProKerala**: OAuth2 authentication
- **OpenStreetMap**: No authentication required

### Infrastructure
- **HTTPS** encryption for all connections
- **Environment variables** for secrets management
- **Rate limiting** for abuse prevention

## Known Security Considerations

### Client-Side Calculations
- Kundali calculations performed client-side for privacy
- Fallback to server API when needed
- No sensitive astronomical data exposed

### Payment Flow
1. Order created server-side
2. Payment processed via secure gateway
3. Signature verification server-side
4. Results delivered after successful payment

## Security Updates

Security updates will be:
- Released as patches to supported versions
- Announced via GitHub releases
- Documented in CHANGELOG.md
- Communicated to users through proper channels

## Contact

For security-related questions or concerns:
- Email: security@witchcard.shop
- Create a private security advisory on GitHub
- Contact maintainers directly for urgent issues

---

**Note**: This security policy covers the WitchCard platform. For payment processor security, refer to their respective security policies (Razorpay, Stripe).