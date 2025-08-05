// Card Engine - Dynamic Form Generation and Mystical Algorithms
class CardEngine {
    constructor() {
        this.consentGiven = false;
        this.paymentConfig = {
            key: 'rzp_test_1DP5mmOlF5G5ag',
            currency: 'INR',
            name: 'WitchCard',
            description: 'Mystical Fortune Reading',
            theme: { color: '#6c5ce7' }
        };
        this.cardData = {
            pastlife: {
                icon: '🌌',
                title: 'Past Life Regression',
                description: 'Discover who you were in your previous life, what karma you carry, and what lesson you\'re here to complete.',
                price: 15,
                fields: [
                    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            mangalik: {
                icon: '🔥',
                title: 'Are You Mangalik?',
                description: 'Check if you\'re Mangalik and what it means for your marriage & remedies.',
                price: 12,
                fields: [
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            marriage: {
                icon: '💍',
                title: 'When Will You Get Married?',
                description: 'Know your likely age, year & month of marriage with a mysterious twist!',
                price: 18,
                fields: [
                    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            luckyname: {
                icon: '✨',
                title: 'Your Lucky Name',
                description: 'Discover the most auspicious name variant based on numerology and astrology.',
                price: 10,
                fields: [
                    { name: 'fullName', label: 'Current Name', type: 'text', required: true },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            planet: {
                icon: '🚫',
                title: 'Which Planet Blocks You?',
                description: 'Reveal which Graha is most malefic in your life and get quick remedies.',
                price: 20,
                fields: [
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true },
                    { name: 'currentIssue', label: 'What area of life is blocked?', type: 'select', required: true,
                      options: ['Career & Money', 'Love & Relationships', 'Health & Wellness', 'Family & Home', 'Studies & Education', 'Travel & Foreign', 'Spiritual Growth']
                    }
                ]
            },
            child: {
                icon: '🧒',
                title: 'Future Child Prediction',
                description: 'Will your first child be a boy or girl? What traits will they have?',
                price: 16,
                fields: [
                    { name: 'fullName', label: 'Your Name', type: 'text', required: true },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            twinflame: {
                icon: '🔥',
                title: 'Your Twin Flame',
                description: 'Who was your twin flame in a past life? Discover your karmic soulmate connection.',
                price: 22,
                fields: [
                    { name: 'fullName', label: 'Your Full Name', type: 'text', required: true },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
                    { name: 'timeOfBirth', label: 'Time of Birth', type: 'time', required: true },
                    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true }
                ]
            },
            relationship: {
                icon: '❤️',
                title: 'Karmic or Forever Love?',
                description: 'Is this relationship karmic or forever? Get cosmic compatibility analysis.',
                price: 25,
                fields: [
                    { name: 'yourName', label: 'Your Full Name', type: 'text', required: true },
                    { name: 'yourDOB', label: 'Your Date of Birth', type: 'date', required: true },
                    { name: 'partnerName', label: 'Partner\'s Full Name', type: 'text', required: true },
                    { name: 'partnerDOB', label: 'Partner\'s Date of Birth', type: 'date', required: true }
                ]
            }
        };
        
        this.initializeForm();
    }

    initializeForm() {
        // Get selected card from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCard = urlParams.get('card') || localStorage.getItem('selectedCard') || 'pastlife';
        
        this.displaySelectedCard(selectedCard);
        this.generateForm(selectedCard);
        this.setupFormValidation();
        this.setupPaymentButton(selectedCard);
    }

    displaySelectedCard(cardType) {
        const card = this.cardData[cardType];
        if (!card) return;

        document.getElementById('selectedCardIcon').textContent = card.icon;
        document.getElementById('selectedCardTitle').textContent = card.title;
        document.getElementById('selectedCardDescription').textContent = card.description;
        document.getElementById('selectedCardPrice').textContent = `₹${card.price}`;
        document.getElementById('finalPrice').textContent = `₹${card.price}`;
    }

    generateForm(cardType) {
        const card = this.cardData[cardType];
        if (!card) return;

        const formFields = document.getElementById('formFields');
        formFields.innerHTML = '';

        card.fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'form-field';

            let fieldHTML = '';
            
            if (field.type === 'select') {
                fieldHTML = `
                    <label for="${field.name}" class="field-label">${field.label}</label>
                    <select id="${field.name}" name="${field.name}" class="field-input" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;
            } else {
                fieldHTML = `
                    <label for="${field.name}" class="field-label">${field.label}</label>
                    <input type="${field.type}" id="${field.name}" name="${field.name}" 
                           class="field-input" ${field.required ? 'required' : ''}
                           ${field.type === 'date' ? 'max="' + new Date().toISOString().split('T')[0] + '"' : ''}>
                `;
            }

            fieldDiv.innerHTML = fieldHTML;
            formFields.appendChild(fieldDiv);
        });
    }

    setupFormValidation() {
        const form = document.getElementById('dynamicCardForm');
        const consentCheckbox = document.getElementById('consentCheckbox');
        const payButton = document.getElementById('payButton');

        const validateForm = () => {
            const allFields = form.querySelectorAll('input[required], select[required]');
            let allValid = true;

            allFields.forEach(field => {
                if (!field.value.trim()) {
                    allValid = false;
                }
            });

            const consentChecked = consentCheckbox.checked;
            payButton.disabled = !(allValid && consentChecked);
        };

        // Add event listeners to all form fields
        form.addEventListener('input', validateForm);
        form.addEventListener('change', validateForm);
        consentCheckbox.addEventListener('change', validateForm);

        // Initial validation
        validateForm();
    }

    setupPaymentButton(cardType) {
        const payButton = document.getElementById('payButton');
        const card = this.cardData[cardType];

        payButton.addEventListener('click', () => {
            if (payButton.disabled) return;

            const formData = this.collectFormData();
            this.initiatePayment(cardType, card.price, formData);
        });
    }

    collectFormData() {
        const form = document.getElementById('dynamicCardForm');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    initiatePayment(cardType, amount, formData) {
        // Check consent first
        const consentCheckbox = document.getElementById('consentCheckbox');
        if (!consentCheckbox.checked) {
            alert('Please agree to the Terms and Privacy Policy before proceeding.');
            return;
        }

        // Store form data for after payment
        localStorage.setItem('cardFormData', JSON.stringify({
            cardType: cardType,
            formData: formData,
            timestamp: Date.now()
        }));

        // Razorpay payment options
        const options = {
            key: 'rzp_test_your_key_here', // Replace with your Razorpay key
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'WitchCard',
            description: this.cardData[cardType].title,
            image: 'https://your-domain.com/logo.png',
            handler: (response) => {
                // Payment successful
                this.handlePaymentSuccess(response, cardType);
            },
            prefill: {
                name: formData.fullName || formData.yourName || '',
                email: '',
                contact: ''
            },
            theme: {
                color: '#6c5ce7'
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment cancelled');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    handlePaymentSuccess(response, cardType) {
        // Store payment info
        localStorage.setItem('paymentStatus', 'completed');
        localStorage.setItem('paymentId', response.razorpay_payment_id);
        localStorage.setItem('selectedCard', cardType);

        // Track affiliate conversion (GoAffPro)
        this.trackAffiliate(response.razorpay_payment_id, this.cardData[cardType].price);

        // Redirect to scratch page
        window.location.href = 'scratch.html';
    }

    trackAffiliate(paymentId, amount) {
        // GoAffPro conversion tracking
        const affiliateData = {
            order_id: paymentId,
            order_value: amount,
            currency: 'INR',
            payload_key: '_npBJud7vfLLFaP-AcC4Kgmg'
        };

        // Send to GoAffPro
        fetch('https://api.goaffpro.com/track-conversion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(affiliateData)
        }).catch(err => console.log('Affiliate tracking error:', err));
    }
}

// Initialize card engine when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('card-form.html')) {
        new CardEngine();
    }
});

// Card selection function (called from cards.html)
function selectCard(cardType) {
    localStorage.setItem('selectedCard', cardType);
    window.location.href = `card-form.html?card=${cardType}`;
}