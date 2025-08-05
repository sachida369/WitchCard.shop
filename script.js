// Global variables
let isScratching = false;
let scratchArea = 0;
let canvas, ctx;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupMobileMenu();
    setupPaymentHandler();
    setupScratchCard();
    generateRandomPartnerName();
    checkPaymentStatus();
    initializeAffiliateTracking();
    setupConsentHandler();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Payment Handler Setup
function setupPaymentHandler() {
    const payButton = document.getElementById('payButton');
    const astrologyForm = document.getElementById('astrologyForm');
    
    if (payButton && astrologyForm) {
        payButton.addEventListener('click', function() {
            handlePayment();
        });
    }
}

// Consent Handler Setup
function setupConsentHandler() {
    const consentCheckbox = document.getElementById('consentCheckbox');
    const payButton = document.getElementById('payButton');
    
    if (consentCheckbox && payButton) {
        consentCheckbox.addEventListener('change', function() {
            payButton.disabled = !consentCheckbox.checked;
        });
    }
}

// Handle Payment Process
function handlePayment() {
    const form = document.getElementById('astrologyForm');
    const payButton = document.getElementById('payButton');
    const consentCheckbox = document.getElementById('consentCheckbox');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check consent checkbox
    if (consentCheckbox && !consentCheckbox.checked) {
        alert('Please agree to the Privacy Policy and Terms & Conditions before proceeding.');
        return;
    }
    
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        rashi: document.getElementById('rashi').value,
        birthDateTime: document.getElementById('birthDateTime').value,
        birthCity: document.getElementById('birthCity').value
    };
    
    // Store user data in localStorage for later use
    localStorage.setItem('userAstrologyData', JSON.stringify(formData));
    
    // Disable pay button
    payButton.disabled = true;
    payButton.innerHTML = '<span class="button-text">Processing...</span>';
    
    // Razorpay Payment Options
    const options = {
        key: 'rzp_test_1234567890', // Test key
        amount: 1000, // 10 INR in paise
        currency: 'INR',
        name: 'WitchCard',
        description: 'Cosmic Witch Card Reading',
        image: 'attached_assets/witch-globe_1754366241649.png',
        handler: function(response) {
            console.log('Payment Success:', response);
            // Store payment success flag
            localStorage.setItem('paymentSuccess', 'true');
            localStorage.setItem('paymentId', response.razorpay_payment_id);
            
            // Redirect to scratch page
            window.location.href = 'scratch.html?paid=true';
        },
        prefill: {
            name: formData.fullName,
            contact: '',
            email: ''
        },
        theme: {
            color: '#6c5ce7'
        },
        modal: {
            ondismiss: function() {
                // Re-enable pay button if payment is cancelled
                payButton.disabled = false;
                payButton.innerHTML = '<span class="button-text">Pay & Reveal Your Card</span>';
            }
        }
    };
    
    // Open Razorpay checkout
    if (typeof Razorpay !== 'undefined') {
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        // Fallback for testing without Razorpay
        console.log('Razorpay not loaded, simulating payment success');
        setTimeout(() => {
            localStorage.setItem('paymentSuccess', 'true');
            localStorage.setItem('paymentId', 'test_payment_' + Date.now());
            window.location.href = 'scratch.html?paid=true';
        }, 1000);
    }
}

// Check Payment Status
function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const paid = urlParams.get('paid');
    const paymentSuccess = localStorage.getItem('paymentSuccess');
    
    // If on scratch page but no payment made, redirect to product page
    if (window.location.pathname.includes('scratch.html') && !paid && !paymentSuccess) {
        window.location.href = 'product.html';
        return;
    }
}

// Generate Random Partner Name
function generateRandomPartnerName() {
    const partnerNameElement = document.getElementById('partnerName');
    if (partnerNameElement) {
        const names = [
            'Aria', 'Luna', 'Nova', 'Zara', 'Maya', 'Kira', 'Eva', 'Ava',
            'Sage', 'Ruby', 'Jade', 'Rose', 'Iris', 'Ivy', 'Hope', 'Faith',
            'Alex', 'Ryan', 'Sam', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Sage',
            'Blake', 'Drew', 'Jesse', 'Morgan', 'Reese', 'Sidney', 'Taylor'
        ];
        
        const randomName = names[Math.floor(Math.random() * names.length)];
        partnerNameElement.textContent = randomName;
    }
}

// Scratch Card Setup
function setupScratchCard() {
    canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    const revealedCard = document.querySelector('.revealed-card');
    
    // Set canvas size to match the revealed card
    const resizeCanvas = () => {
        const rect = revealedCard.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawScratchLayer();
    };
    
    // Initial setup
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Add event listeners for scratching
    addScratchEventListeners();
}

// Draw Scratch Layer (Silver Foil Effect)
function drawScratchLayer() {
    if (!canvas || !ctx) return;
    
    // Create gradient for silver foil effect
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#E8E8E8');
    gradient.addColorStop(0.2, '#F5F5F5');
    gradient.addColorStop(0.4, '#DCDCDC');
    gradient.addColorStop(0.6, '#C0C0C0');
    gradient.addColorStop(0.8, '#B8B8B8');
    gradient.addColorStop(1, '#A8A8A8');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add texture lines for foil effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 20, canvas.height);
        ctx.stroke();
    }
    
    // Add "SCRATCH HERE" text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 24px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '16px Noto Sans KR';
    ctx.fillText('Reveal Your Destiny', canvas.width / 2, canvas.height / 2 + 10);
}

// Add Scratch Event Listeners
function addScratchEventListeners() {
    if (!canvas) return;
    
    // Mouse events
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('mouseleave', stopScratch);
    
    // Touch events
    canvas.addEventListener('touchstart', startScratchTouch);
    canvas.addEventListener('touchmove', scratchTouch);
    canvas.addEventListener('touchend', stopScratch);
    canvas.addEventListener('touchcancel', stopScratch);
    
    // Prevent scrolling on touch
    canvas.addEventListener('touchstart', e => e.preventDefault());
    canvas.addEventListener('touchmove', e => e.preventDefault());
}

// Start Scratching (Mouse)
function startScratch(e) {
    isScratching = true;
    scratch(e);
}

// Start Scratching (Touch)
function startScratchTouch(e) {
    isScratching = true;
    scratchTouch(e);
}

// Scratch Function (Mouse)
function scratch(e) {
    if (!isScratching || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    performScratch(x, y);
}

// Scratch Function (Touch)
function scratchTouch(e) {
    if (!isScratching || !ctx) return;
    
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    performScratch(x, y);
}

// Perform Scratch Action
function performScratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Calculate scratched area
    calculateScratchedArea();
}

// Stop Scratching
function stopScratch() {
    isScratching = false;
}

// Calculate Scratched Area
function calculateScratchedArea() {
    if (!ctx || !canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparent++;
        }
    }
    
    scratchArea = (transparent / (pixels.length / 4)) * 100;
    
    // If more than 30% is scratched, show action buttons
    if (scratchArea > 30) {
        showActionButtons();
    }
}

// Show Action Buttons
function showActionButtons() {
    const actionButtons = document.getElementById('actionButtons');
    const scratchInstructions = document.getElementById('scratchInstructions');
    
    if (actionButtons && scratchInstructions) {
        actionButtons.style.display = 'flex';
        scratchInstructions.style.display = 'none';
        
        // Setup button handlers
        setupActionButtons();
    }
}

// Setup Action Buttons
function setupActionButtons() {
    const downloadButton = document.getElementById('downloadButton');
    const shareButton = document.getElementById('shareButton');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCard);
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', shareOnWhatsApp);
    }
}

// Download Card Function
function downloadCard() {
    const revealedCard = document.querySelector('.revealed-card');
    if (!revealedCard) return;
    
    // Create a new canvas for the revealed card
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    
    // Set canvas size
    const rect = revealedCard.getBoundingClientRect();
    downloadCanvas.width = rect.width * 2; // Higher resolution
    downloadCanvas.height = rect.height * 2;
    
    // Scale context for higher resolution
    downloadCtx.scale(2, 2);
    
    // Fill background
    downloadCtx.fillStyle = '#1a1a2e';
    downloadCtx.fillRect(0, 0, rect.width, rect.height);
    
    // Draw the revealed card content
    const cardImage = revealedCard.querySelector('img');
    const partnerName = document.getElementById('partnerName').textContent;
    
    if (cardImage) {
        downloadCtx.drawImage(cardImage, 20, 20, rect.width - 40, 200);
    }
    
    // Add text content
    downloadCtx.fillStyle = '#00cec9';
    downloadCtx.font = 'bold 24px Orbitron';
    downloadCtx.textAlign = 'center';
    downloadCtx.fillText('Your Future Life Partner', rect.width / 2, 250);
    
    downloadCtx.fillStyle = '#6c5ce7';
    downloadCtx.font = 'bold 36px Orbitron';
    downloadCtx.fillText(partnerName, rect.width / 2, 290);
    
    downloadCtx.fillStyle = '#ffffff';
    downloadCtx.font = '16px Noto Sans KR';
    downloadCtx.fillText('The cosmic energies have aligned to reveal this sacred name', rect.width / 2, 320);
    downloadCtx.fillText('from the depths of the universe.', rect.width / 2, 340);
    
    // Download the image
    const link = document.createElement('a');
    link.download = `WitchCard_${partnerName}_${Date.now()}.png`;
    link.href = downloadCanvas.toDataURL();
    link.click();
}

// Share on WhatsApp Function
function shareOnWhatsApp() {
    const partnerName = document.getElementById('partnerName').textContent;
    const message = `🔮 I just discovered my future life partner's name through WitchCard! It's ${partnerName}! ✨ Check your Witch Card at witchcard.shop 🌟`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility Functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatCurrency(amount) {
    return `₹${amount}`;
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
});

// Page Visibility API - Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations or heavy operations
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Page visible - resuming animations');
    }
});

// Performance optimization - Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced resize handler
const debouncedResize = debounce(() => {
    if (canvas && document.getElementById('scratchCanvas')) {
        const revealedCard = document.querySelector('.revealed-card');
        const rect = revealedCard.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawScratchLayer();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Card selection function (called from cards.html)
function selectCard(cardType) {
    localStorage.setItem('selectedCard', cardType);
    window.location.href = `card-form.html?card=${cardType}`;
}

// GoAffPro Integration Functions
function initializeAffiliateTracking() {
    const affiliateButtons = document.querySelectorAll('.affiliate-button');
    
    affiliateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            trackAffiliateClick();
        });
    });
}

function trackAffiliateClick() {
    // Track affiliate button clicks
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_signup_click', {
            'event_category': 'Affiliate',
            'event_label': 'Footer Button Click'
        });
    }
    
    console.log('Affiliate signup button clicked');
}

// Secure payload verification for GoAffPro
function verifySecurePayload(payload, providedKey) {
    const SECURE_PAYLOAD_KEY = '_npBJud7vfLLFaP-AcC4Kgmg';
    
    if (providedKey !== SECURE_PAYLOAD_KEY) {
        console.error('Invalid payload key provided');
        return false;
    }
    
    return true;
}

// Handle conversion tracking for affiliate program
function trackConversion(orderData) {
    const payload = {
        order_id: orderData.id,
        total: orderData.total,
        currency: 'INR',
        timestamp: new Date().toISOString()
    };
    
    // Verify secure payload
    if (verifySecurePayload(payload, '_npBJud7vfLLFaP-AcC4Kgmg')) {
        console.log('Conversion tracked:', payload);
        // API call implementation would go here when backend is ready
    }
}

// Enhanced payment handler with affiliate tracking
function handlePaymentWithAffiliateTracking() {
    const originalHandler = handlePayment;
    
    return function() {
        // Track payment attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'payment_attempt', {
                'event_category': 'Purchase',
                'event_label': 'Witch Card Payment'
            });
        }
        
        // Call original payment handler
        originalHandler.apply(this, arguments);
    };
}
