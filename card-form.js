// Enhanced Card Form JavaScript with Razorpay Integration
// Configuration - Replace with your actual Razorpay key
const RAZORPAY_KEY = 'rzp_live_Hd6RirzluzFacK'; // Production Razorpay key
const PAYMENT_AMOUNT = 1000; // ₹10 in paise

// Card configurations
const cardConfigs = {
    pastlife: {
        title: 'Past Life Regression',
        description: 'Discover your previous incarnation through ancient numerology',
        image: 'attached_assets/generated_images/Past_Life_Mystical_Card_9d9ab67d.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    mangalik: {
        title: 'Mangalik Check',
        description: 'Discover if you\'re Mangalik and Mars influences on marriage',
        image: 'attached_assets/generated_images/Mangalik_Dosha_Card_b269f97c.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    marriage: {
        title: 'Marriage Timing',
        description: 'When will you get married? Cosmic timing revealed',
        image: 'attached_assets/generated_images/Marriage_Prediction_Card_eac6eb1b.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    luckyname: {
        title: 'Lucky Name',
        description: 'Analyse if your name attracts luck and prosperity',
        image: 'attached_assets/generated_images/Lucky_Name_Card_c03b949c.png',
        inputs: ['name', 'dob']
    },
    blocking: {
        title: 'Blocking Planet',
        description: 'Which planet is blocking your success and growth?',
        image: 'attached_assets/generated_images/Blocking_Planet_Card_47710299.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    child: {
        title: 'Future Child',
        description: 'When will you have children? Gender and timing revealed',
        image: 'attached_assets/generated_images/Future_Child_Card_e4ce9e0f.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    twinflame: {
        title: 'Twin Flame',
        description: 'Have you met your twin flame? Cosmic connection revealed',
        image: 'attached_assets/generated_images/Twin_Flame_Card_7a559b97.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    karma: {
        title: 'Relationship Karma',
        description: 'What karmic patterns affect your relationships?',
        image: 'attached_assets/generated_images/Karmic_Relationship_Card_03452b0e.png',
        inputs: ['name', 'dob', 'time', 'place']
    },
    partner: {
        title: 'Future Life Partner',
        description: 'Details about your destined life partner revealed',
        image: 'attached_assets/generated_images/Future_Life_Partner_Card_80768890.png',
        inputs: ['name', 'dob', 'time', 'place']
    }
};

// Global form state
let formState = {
    isValid: false,
    consentGiven: false,
    paymentInProgress: false
};

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCardForm();
});

// Main initialization function
function initializeCardForm() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const cardType = urlParams.get('card') || 'pastlife';
        
        setupSelectedCard(cardType);
        generateFormFields(cardType);
        setupFormValidation();
        setupConsentHandler();
        setupPaymentButton();
        setupMobileMenu();
    } catch (error) {
        console.error('Application Error:', error);
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Setup selected card display
function setupSelectedCard(cardType) {
    try {
        const config = cardConfigs[cardType] || cardConfigs.pastlife;
        
        // Update card display with null checks
        const cardImage = document.getElementById('cardDisplayImg');
        const cardTitle = document.getElementById('selectedCardTitle');
        const cardDescription = document.getElementById('selectedCardDescription');
        const cardPrice = document.getElementById('selectedCardPrice');
        const finalPrice = document.getElementById('finalPrice');
        
        if (cardImage && config.image) {
            cardImage.src = config.image;
            cardImage.alt = config.title + ' Card';
        }
        if (cardTitle && config.title) {
            cardTitle.textContent = config.title;
        }
        if (cardDescription && config.description) {
            cardDescription.textContent = config.description;
        }
        if (cardPrice) {
            cardPrice.textContent = '₹10';
        }
        if (finalPrice) {
            finalPrice.textContent = '₹10';
        }
    } catch (error) {
        console.error('Card Form Error:', error);
    }
}

// Generate dynamic form fields based on card type
function generateFormFields(cardType) {
    const config = cardConfigs[cardType] || cardConfigs.pastlife;
    const formFields = document.getElementById('formFields');
    
    if (!formFields) return;
    
    let fieldsHTML = '';
    
    // Full Name (always required)
    if (config.inputs.includes('name')) {
        fieldsHTML += `
            <div class="form-field" data-field="name">
                <label for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" required 
                       placeholder="Enter your full name"
                       autocomplete="name">
                <div class="error-message">Please enter your full name</div>
            </div>
        `;
    }
    
    // Date of Birth (always required)
    if (config.inputs.includes('dob')) {
        fieldsHTML += `
            <div class="form-field" data-field="dob">
                <label for="dob">Date of Birth *</label>
                <input type="date" id="dob" name="dob" required>
                <div class="error-message">Please enter your date of birth</div>
            </div>
        `;
    }
    
    // Time of Birth (optional with checkbox)
    if (config.inputs.includes('time')) {
        fieldsHTML += `
            <div class="form-field optional-field" data-field="time">
                <label for="timeOfBirth">Time of Birth</label>
                <input type="time" id="timeOfBirth" name="timeOfBirth">
                <div class="optional-checkbox">
                    <input type="checkbox" id="timeUnknown" name="timeUnknown">
                    <label for="timeUnknown">I don't know my exact birth time</label>
                </div>
                <div class="error-message">Please enter time or check unknown</div>
            </div>
        `;
    }
    
    // Place of Birth (required if needed)
    if (config.inputs.includes('place')) {
        fieldsHTML += `
            <div class="form-field" data-field="place">
                <label for="birthPlace">Place of Birth *</label>
                <input type="text" id="birthPlace" name="birthPlace" required 
                       placeholder="City, State, Country"
                       autocomplete="address-level2">
                <div class="error-message">Please enter your birth place</div>
            </div>
        `;
    }
    
    // Email (always optional)
    fieldsHTML += `
        <div class="form-field optional-field" data-field="email">
            <label for="email">Email (Optional)</label>
            <input type="email" id="email" name="email" 
                   placeholder="Get a copy of your reading"
                   autocomplete="email">
            <div class="error-message">Please enter a valid email address</div>
        </div>
    `;
    
    formFields.innerHTML = fieldsHTML;
    
    // Setup time field logic
    setupTimeFieldLogic();
}

// Setup time field logic
function setupTimeFieldLogic() {
    const timeField = document.getElementById('timeOfBirth');
    const timeUnknown = document.getElementById('timeUnknown');
    
    if (timeField && timeUnknown) {
        timeUnknown.addEventListener('change', function() {
            if (this.checked) {
                timeField.disabled = true;
                timeField.value = '';
                timeField.style.opacity = '0.5';
            } else {
                timeField.disabled = false;
                timeField.style.opacity = '1';
            }
            validateForm();
        });
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('dynamicCardForm');
    if (!form) return;
    
    // Add event listeners to all form fields
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', validateField);
        field.addEventListener('blur', validateField);
    });
    
    // Initial validation
    validateForm();
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const fieldContainer = field.closest('.form-field');
    const isRequired = field.hasAttribute('required');
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is required and empty
    if (isRequired && !fieldValue) {
        isValid = false;
        errorMessage = `Please enter ${field.placeholder || field.name}`;
    }
    
    // Email validation
    if (fieldType === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Name validation
    if (field.name === 'fullName' && fieldValue) {
        if (fieldValue.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
    }
    
    // Birth place validation
    if (field.name === 'birthPlace' && fieldValue) {
        if (fieldValue.length < 2) {
            isValid = false;
            errorMessage = 'Please enter a valid place name';
        }
    }
    
    // Time field special handling
    if (field.name === 'timeOfBirth') {
        const timeUnknown = document.getElementById('timeUnknown');
        if (timeUnknown && timeUnknown.checked) {
            isValid = true; // Valid if unknown is checked
        }
    }
    
    // Update field UI
    if (isValid) {
        fieldContainer.classList.remove('error');
    } else {
        fieldContainer.classList.add('error');
        const errorElement = fieldContainer.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
    
    // Validate entire form
    validateForm();
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('dynamicCardForm');
    if (!form) return;
    
    let isFormValid = true;
    
    // Check all required fields
    const requiredFields = form.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        const fieldValue = field.value.trim();
        
        // Special handling for time field
        if (field.name === 'timeOfBirth') {
            const timeUnknown = document.getElementById('timeUnknown');
            if (timeUnknown && timeUnknown.checked) {
                return; // Skip validation if unknown is checked
            }
        }
        
        if (!fieldValue) {
            isFormValid = false;
        }
    });
    
    // Check email validity if provided
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            isFormValid = false;
        }
    }
    
    formState.isValid = isFormValid;
    updatePayButtonState();
}

// Setup consent handler
function setupConsentHandler() {
    const consentCheckbox = document.getElementById('consentCheckbox');
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            formState.consentGiven = this.checked;
            updatePayButtonState();
        });
    }
}

// Update pay button state
function updatePayButtonState() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        const canPay = formState.isValid && formState.consentGiven && !formState.paymentInProgress;
        payButton.disabled = !canPay;
        
        if (canPay) {
            payButton.classList.remove('disabled');
        } else {
            payButton.classList.add('disabled');
        }
    }
}

// Setup payment button
function setupPaymentButton() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', initiatePayment);
    }
}

// Initiate Razorpay payment
async function initiatePayment() {
    if (!formState.isValid || !formState.consentGiven || formState.paymentInProgress) {
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Set loading state
    setPaymentLoading(true);
    
    // Create order first
    let order;
    try {
        order = await createOrder(formData);
    } catch (error) {
        console.error('Order creation failed:', error);
        setPaymentLoading(false);
        showPaymentMessage('Failed to initiate payment. Please try again.', 'error');
        return;
    }
    
    // Razorpay options
    const options = {
        key: RAZORPAY_KEY, // Your Razorpay test key
        amount: order.amount, // Amount from order
        currency: order.currency,
        name: 'WitchCard',
        description: `${formData.cardTitle} Reading`,
        image: 'https://2zi.kirk.replit.dev/assets/witch-globe.png',
        order_id: order.id, // Order created by server
        prefill: {
            name: formData.fullName,
            email: formData.email || '',
            contact: '' // Add phone if needed
        },
        notes: {
            card_type: formData.cardType,
            user_name: formData.fullName
        },
        theme: {
            color: '#6c5ce7'
        },
        modal: {
            ondismiss: function() {
                setPaymentLoading(false);
                showPaymentMessage('Payment cancelled', 'error');
            }
        },
        handler: function(response) {
            handlePaymentSuccess(response, formData);
        }
    };
    
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        console.error('Razorpay library not loaded');
        setPaymentLoading(false);
        showPaymentMessage('Payment system not loaded. Please refresh and try again.', 'error');
        return;
    }
    
    try {
        const rzp = new Razorpay(options);
        
        rzp.on('payment.failed', function(response) {
            handlePaymentFailure(response);
        });
        
        rzp.open();
    } catch (error) {
        console.error('Razorpay open error:', error);
        setPaymentLoading(false);
        showPaymentMessage('Failed to open payment gateway: ' + error.message, 'error');
    }
}

// Create order via server API
async function createOrder(formData) {
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: PAYMENT_AMOUNT,
                currency: 'INR',
                receipt: `${formData.cardType}_${Date.now()}`
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Order creation failed');
        }
        
        return data.order;
    } catch (error) {
        console.error('Order creation failed:', error);
        throw error;
    }
}

// Collect form data
function collectFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const cardType = urlParams.get('card') || 'pastlife';
    const config = cardConfigs[cardType] || cardConfigs.pastlife;
    
    return {
        cardType: cardType,
        cardTitle: config.title,
        fullName: document.getElementById('fullName')?.value || '',
        dob: document.getElementById('dob')?.value || '',
        timeOfBirth: document.getElementById('timeOfBirth')?.value || '',
        timeUnknown: document.getElementById('timeUnknown')?.checked || false,
        birthPlace: document.getElementById('birthPlace')?.value || '',
        email: document.getElementById('email')?.value || ''
    };
}

// Handle payment success
function handlePaymentSuccess(response, formData) {
    console.log('Payment successful:', response);
    setPaymentLoading(false);
    
    // Store payment data for result page
    const paymentData = {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        ...formData,
        timestamp: Date.now()
    };
    
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    localStorage.setItem('paymentStatus', 'success');
    
    // Show success message
    showPaymentMessage('Payment successful! Redirecting to your reading...', 'success');
    
    // Redirect to scratch page after delay
    setTimeout(() => {
        window.location.href = `scratch.html?card=${formData.cardType}&payment=${response.razorpay_payment_id}`;
    }, 2000);
}

// Handle payment failure
function handlePaymentFailure(response) {
    console.error('Payment failed:', response);
    setPaymentLoading(false);
    
    const errorMessage = response.error?.description || 'Payment failed. Please try again.';
    showPaymentMessage(errorMessage, 'error');
    
    // Store failure data
    localStorage.setItem('paymentStatus', 'failed');
}

// Set payment loading state
function setPaymentLoading(loading) {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        formState.paymentInProgress = loading;
        
        if (loading) {
            payButton.classList.add('loading');
            payButton.disabled = true;
        } else {
            payButton.classList.remove('loading');
            updatePayButtonState();
        }
    }
}

// Show payment message
function showPaymentMessage(message, type) {
    let messageElement = document.querySelector('.payment-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'payment-message';
        const paymentSection = document.querySelector('.payment-section');
        if (paymentSection) {
            paymentSection.appendChild(messageElement);
        }
    }
    
    messageElement.textContent = message;
    messageElement.className = `payment-message ${type}`;
    messageElement.style.display = 'block';
    
    // Auto hide after 5 seconds for error messages
    if (type === 'error') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Card Form Error:', e.error);
    if (formState.paymentInProgress) {
        setPaymentLoading(false);
        showPaymentMessage('An error occurred. Please try again.', 'error');
    }
});

// Export functions for global access
window.cardFormApp = {
    initiatePayment,
    validateForm,
    collectFormData
};