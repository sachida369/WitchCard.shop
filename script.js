// Global variables for scratch functionality (declare only if not already exists)
window.globalScratchState = window.globalScratchState || {
    isScratching: false,
    scratchArea: 0,
    canvas: null,
    ctx: null
};

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
    setupSmoothScrolling();
    handleHashNavigation();
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle hash navigation on page load
function handleHashNavigation() {
    // Check if URL has a hash
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Delay scroll to ensure page is fully loaded
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
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
        key: 'rzp_live_Hd6RirzluzFacK', // Live key
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
    window.window.globalScratchState.canvas = document.getElementById('scratchCanvas');
    if (!window.window.globalScratchState.canvas) return;
    
    window.window.globalScratchState.ctx = window.window.globalScratchState.canvas.getContext('2d');
    const revealedCard = document.querySelector('.revealed-card');
    
    // Set canvas size to match the revealed card
    const resizeCanvas = () => {
        const rect = revealedCard.getBoundingClientRect();
        window.window.globalScratchState.canvas.width = rect.width;
        window.window.globalScratchState.canvas.height = rect.height;
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
    if (!window.window.globalScratchState.canvas || !window.window.globalScratchState.ctx) return;
    
    // Create gradient for silver foil effect
    const gradient = window.window.globalScratchState.ctx.createLinearGradient(0, 0, window.window.globalScratchState.canvas.width, window.window.globalScratchState.canvas.height);
    gradient.addColorStop(0, '#E8E8E8');
    gradient.addColorStop(0.2, '#F5F5F5');
    gradient.addColorStop(0.4, '#DCDCDC');
    gradient.addColorStop(0.6, '#C0C0C0');
    gradient.addColorStop(0.8, '#B8B8B8');
    gradient.addColorStop(1, '#A8A8A8');
    
    window.globalScratchState.ctx.fillStyle = gradient;
    window.globalScratchState.ctx.fillRect(0, 0, window.globalScratchState.canvas.width, window.globalScratchState.canvas.height);
    
    // Add texture lines for foil effect
    window.globalScratchState.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    window.globalScratchState.ctx.lineWidth = 1;
    for (let i = 0; i < window.globalScratchState.canvas.width; i += 10) {
        window.globalScratchState.ctx.beginPath();
        window.globalScratchState.ctx.moveTo(i, 0);
        window.globalScratchState.ctx.lineTo(i + 20, window.globalScratchState.canvas.height);
        window.globalScratchState.ctx.stroke();
    }
    
    // Add "SCRATCH HERE" text
    window.globalScratchState.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    window.globalScratchState.ctx.font = 'bold 24px Orbitron';
    window.globalScratchState.ctx.textAlign = 'center';
    window.globalScratchState.ctx.fillText('SCRATCH HERE', window.globalScratchState.canvas.width / 2, window.globalScratchState.canvas.height / 2 - 20);
    
    window.globalScratchState.ctx.font = '16px Noto Sans KR';
    window.globalScratchState.ctx.fillText('Reveal Your Destiny', window.globalScratchState.canvas.width / 2, window.globalScratchState.canvas.height / 2 + 10);
}

// Add Scratch Event Listeners
function addScratchEventListeners() {
    if (!window.globalScratchState.canvas) return;
    
    // Mouse events
    window.globalScratchState.canvas.addEventListener('mousedown', startScratch);
    window.globalScratchState.canvas.addEventListener('mousemove', scratch);
    window.globalScratchState.canvas.addEventListener('mouseup', stopScratch);
    window.globalScratchState.canvas.addEventListener('mouseleave', stopScratch);
    
    // Touch events
    window.globalScratchState.canvas.addEventListener('touchstart', startScratchTouch);
    window.globalScratchState.canvas.addEventListener('touchmove', scratchTouch);
    window.globalScratchState.canvas.addEventListener('touchend', stopScratch);
    window.globalScratchState.canvas.addEventListener('touchcancel', stopScratch);
    
    // Prevent scrolling on touch
    window.globalScratchState.canvas.addEventListener('touchstart', e => e.preventDefault());
    window.globalScratchState.canvas.addEventListener('touchmove', e => e.preventDefault());
}

// Start Scratching (Mouse)
function startScratch(e) {
    window.globalScratchState.isScratching = true;
    scratch(e);
}

// Start Scratching (Touch)
function startScratchTouch(e) {
    window.globalScratchState.isScratching = true;
    scratchTouch(e);
}

// Scratch Function (Mouse)
function scratch(e) {
    if (!window.globalScratchState.isScratching || !window.globalScratchState.ctx) return;
    
    const rect = window.globalScratchState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    performScratch(x, y);
}

// Scratch Function (Touch)
function scratchTouch(e) {
    if (!window.globalScratchState.isScratching || !window.globalScratchState.ctx) return;
    
    e.preventDefault();
    const rect = window.globalScratchState.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    performScratch(x, y);
}

// Perform Scratch Action
function performScratch(x, y) {
    window.globalScratchState.ctx.globalCompositeOperation = 'destination-out';
    window.globalScratchState.ctx.beginPath();
    window.globalScratchState.ctx.arc(x, y, 20, 0, 2 * Math.PI);
    window.globalScratchState.ctx.fill();
    
    // Calculate scratched area
    calculateScratchedArea();
}

// Stop Scratching
function stopScratch() {
    window.globalScratchState.isScratching = false;
}

// Calculate Scratched Area
function calculateScratchedArea() {
    if (!window.globalScratchState.ctx || !window.globalScratchState.canvas) return;
    
    const imageData = window.globalScratchState.ctx.getImageData(0, 0, window.globalScratchState.canvas.width, window.globalScratchState.canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparent++;
        }
    }
    
    window.globalScratchState.scratchArea = (transparent / (pixels.length / 4)) * 100;
    
    // If more than 30% is scratched, show action buttons
    if (window.globalScratchState.scratchArea > 30) {
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

// Enhanced Download Card Function with html2canvas
async function downloadCard() {
    const revealedCard = document.querySelector('.revealed-card');
    if (!revealedCard) {
        console.error('No revealed card found');
        return;
    }
    
    try {
        // Show loading indicator
        const downloadBtn = document.getElementById('downloadButton');
        const originalText = downloadBtn ? downloadBtn.textContent : '';
        if (downloadBtn) downloadBtn.textContent = 'Generating...';
        
        // Wait for fonts and images to load
        await document.fonts.ready;
        
        // Use html2canvas with better options
        const canvas = await html2canvas(revealedCard, {
            useCORS: true,
            allowTaint: false,
            scale: 2, // Higher resolution
            backgroundColor: '#1a1a2e',
            logging: false,
            width: revealedCard.offsetWidth,
            height: revealedCard.offsetHeight,
            onclone: (clonedDoc) => {
                // Ensure styles are applied to cloned document
                const clonedCard = clonedDoc.querySelector('.revealed-card');
                if (clonedCard) {
                    clonedCard.style.transform = 'none';
                    clonedCard.style.position = 'relative';
                }
            }
        });
        
        // Get partner name for filename
        const partnerNameElement = document.getElementById('partnerName');
        const partnerName = partnerNameElement ? partnerNameElement.textContent : 'MysticalReading';
        
        // Create download link
        const link = document.createElement('a');
        link.download = `WitchCard_${partnerName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset button text
        if (downloadBtn) downloadBtn.textContent = originalText;
        
        console.log('Card downloaded successfully');
        
    } catch (error) {
        console.error('Download failed:', error);
        
        // Fallback: simple canvas method
        fallbackDownload();
        
        // Reset button text
        const downloadBtn = document.getElementById('downloadButton');
        if (downloadBtn) downloadBtn.textContent = 'Download';
    }
}

// Fallback download method
function fallbackDownload() {
    const revealedCard = document.querySelector('.revealed-card');
    if (!revealedCard) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const rect = revealedCard.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Fill background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Add simple text
    const partnerName = document.getElementById('partnerName')?.textContent || 'Your Reading';
    
    ctx.fillStyle = '#00cec9';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Mystical Reading', rect.width / 2, 100);
    
    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(partnerName, rect.width / 2, 150);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Generated by WitchCard.shop', rect.width / 2, 200);
    
    const link = document.createElement('a');
    link.download = `WitchCard_${partnerName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Enhanced Share on WhatsApp Function
function shareOnWhatsApp() {
    try {
        const partnerNameElement = document.getElementById('partnerName');
        const readingTitleElement = document.getElementById('readingTitle');
        
        const partnerName = partnerNameElement ? partnerNameElement.textContent : 'Amazing Result';
        const readingType = readingTitleElement ? readingTitleElement.textContent : 'Mystical Reading';
        
        const message = `🔮 I just got my ${readingType} from WitchCard! The result: ${partnerName} ✨\n\nGet your mystical reading at witchcard.shop 🌟\n\n#WitchCard #MysticalReading #Astrology`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        
        // Check if on mobile for better UX
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // On mobile, try to open WhatsApp app directly
            const whatsappApp = `whatsapp://send?text=${encodedMessage}`;
            const whatsappWeb = whatsappUrl;
            
            // Try app first, fallback to web
            const link = document.createElement('a');
            link.href = whatsappApp;
            link.click();
            
            // Fallback to web after short delay
            setTimeout(() => {
                window.open(whatsappWeb, '_blank');
            }, 1000);
        } else {
            // On desktop, open WhatsApp Web
            window.open(whatsappUrl, '_blank');
        }
        
        console.log('Share initiated');
        
    } catch (error) {
        console.error('Share failed:', error);
        
        // Ultimate fallback
        const fallbackMessage = 'Check out WitchCard.shop for mystical readings!';
        const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(fallbackMessage)}`;
        window.open(fallbackUrl, '_blank');
    }
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

// Debounced resize handler (prevent duplicate declarations)
if (!window.debouncedResizeHandler) {
    window.debouncedResizeHandler = debounce(() => {
        if (canvas && document.getElementById('scratchCanvas')) {
            const revealedCard = document.querySelector('.revealed-card');
            const rect = revealedCard.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            drawScratchLayer();
        }
    }, 250);

    window.addEventListener('resize', window.debouncedResizeHandler);
}

// Card selection function for product page (flip and navigate)
function selectCard(cardType) {
    console.log('Card selected:', cardType);
    
    // Add a small delay for animation then navigate to card form
    setTimeout(() => {
        window.location.href = `card-form.html?card=${cardType}`;
    }, 300);
}

// Tarot card selection function
function selectTarotCard(tarotType) {
    // Store the selected tarot card
    localStorage.setItem('selectedTarot', tarotType);
    
    // Show a mystical message
    const messages = {
        'star': '🌟 The Star guides you to hope and spiritual guidance. Let the cards reveal your path...',
        'warrior': '⚔️ The Warrior brings courage and strength. Your battle awaits revelation...',
        'moon': '🌙 The Moon illuminates hidden truths and intuition. Mysteries shall unfold...',
        'sun': '☀️ The Sun radiates joy and success. Bright fortune is approaching...',
        'emperor': '👑 The Emperor commands authority and structure. Power flows through you...',
        'empress': '🌸 The Empress nurtures creativity and abundance. Life blossoms around you...',
        'fortune': '🌀 The Wheel of Fortune spins destiny. Change brings new opportunities...',
        'tower': '🔥 The Tower breaks old patterns. Transformation through revelation...'
    };
    
    // Create mystical alert
    const message = messages[tarotType] || 'The cosmos have chosen your path...';
    
    // Show beautiful notification
    showTarotNotification(message, tarotType);
    
    // Scroll to cards section after a moment
    setTimeout(() => {
        document.getElementById('cards-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 2000);
}

// Show tarot notification with mystical styling
function showTarotNotification(message, tarotType) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.tarot-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'tarot-notification';
    notification.innerHTML = `
        <div class="tarot-notification-content">
            <div class="tarot-icon">${getTarotIcon(tarotType)}</div>
            <div class="tarot-message">${message}</div>
            <div class="cosmic-sparkles">✨✨✨</div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Get tarot icon
function getTarotIcon(tarotType) {
    const icons = {
        'star': '🌟',
        'warrior': '⚔️',
        'moon': '🌙',
        'sun': '☀️',
        'emperor': '👑',
        'empress': '🌸',
        'fortune': '🌀',
        'tower': '🔥'
    };
    return icons[tarotType] || '🔮';
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

// Tarot card selection functionality
function selectTarotCard(cardType) {
    // Store selected tarot card in session
    sessionStorage.setItem('selectedTarot', cardType);
    
    // Visual feedback
    const clickedCard = event.target;
    clickedCard.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        clickedCard.style.transform = 'translateY(-10px) scale(1.05)';
        
        // Navigate to cards page with tarot parameter
        window.location.href = `cards.html?tarot=${cardType}`;
    }, 150);
}

// Navigation functions for the new sections
function navigateToCards() {
    window.location.href = 'cards.html';
}

// Card selection function for the home page cards (navigate to product page)
function selectHomeCard(cardType) {
    // Store selected card type
    sessionStorage.setItem('selectedCard', cardType);
    
    // Navigate to product page
    window.location.href = `product.html?card=${cardType}`;
}
