// Payment Configuration for WitchCard
// Primary: Razorpay | Additional: Stripe

const PaymentConfig = {
    // Razorpay Configuration (Primary)
    razorpay: {
        keyId: 'rzp_test_OMhwadNjZxkUle', // Your test key
        enabled: true,
        methods: ['card', 'netbanking', 'wallet', 'upi'],
        theme: {
            color: '#6c5ce7',
            backdrop_color: 'rgba(108, 92, 231, 0.1)'
        }
    },
    
    // Stripe Configuration (Additional)
    stripe: {
        enabled: false, // Enable when STRIPE keys are configured
        theme: {
            variables: {
                colorPrimary: '#6c5ce7',
                colorBackground: '#000000',
                colorText: '#ffffff',
                borderRadius: '10px'
            }
        }
    },
    
    // Payment amounts (in paise for Razorpay, cents for Stripe)
    amounts: {
        cards: {
            pastlife: 1000,      // ₹10
            mangalik: 1000,      // ₹10
            marriage: 1000,      // ₹10
            luckyname: 1000,     // ₹10
            blocking: 1000,      // ₹10
            futurechild: 1000,   // ₹10
            twinflame: 1000,     // ₹10
            karma: 1000,         // ₹10
            partner: 1000        // ₹10
        },
        kundali: 5000           // ₹50
    },
    
    // Available payment methods display
    getPaymentMethods() {
        const methods = [];
        
        if (this.razorpay.enabled) {
            methods.push({
                id: 'razorpay',
                name: 'Razorpay',
                description: 'UPI, Cards, Net Banking, Wallets',
                icon: '💳',
                primary: true
            });
        }
        
        if (this.stripe.enabled) {
            methods.push({
                id: 'stripe',
                name: 'Stripe',
                description: 'International Cards',
                icon: '🌍',
                primary: false
            });
        }
        
        return methods;
    },
    
    // Get payment method configuration
    getConfig(method) {
        return this[method] || null;
    }
};

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentConfig;
} else if (typeof window !== 'undefined') {
    window.PaymentConfig = PaymentConfig;
}