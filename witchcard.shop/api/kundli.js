// ====== KUNDALI GENERATOR JavaScript ======  

// Configuration  
const CONFIG = {  
    API_BASE_URL: 'http://localhost:5000/api', // Change this to your server URL  
    RAZORPAY_KEY_ID: 'rzp_test_OMhwadNjZxkUle',  
    PROKERALA_CLIENT_ID: '553d987e-16d1-4805-9541-51fa833ad3a3',  
    PROKERALA_CLIENT_SECRET: '6d6cptckAuk4Bj5RbkxXATc8VFnsqwvb4ypoxAo5'  
};  

// Global state  
let currentStep = 'form'; // form, payment, loading, results, error  
let kundaliRequestId = '';  
let kundaliData = null;  
let userDetails = null;  
let selectedLocation = null;  

let loadingSteps = [  
    "Authenticating payment...",  
    "Verifying payment...",  
    "Payment verified! Generating Kundali...",  
    "Calculating planetary positions...",  
    "Generating birth chart...",  
    "Finalizing your cosmic report..."  
];  
let currentLoadingStep = 0;  

// ====== UTILITIES ======  

// Show specific sections and hide others  
function showSection(sectionName) {  
    const sections = ['formSection', 'paymentSection', 'loadingSection', 'resultsSection', 'errorSection'];  
    sections.forEach(sec => {  
        document.getElementById(sec).classList.add('hidden');  
    });  
    document.getElementById(sectionName).classList.remove('hidden');  
    currentStep = sectionName.replace('Section', '');  
}  

// Display error message  
function showError(message) {  
    document.getElementById('errorMessage').textContent = message;  
    showSection('errorSection');  
}  

// Clear all error messages  
function clearErrors() {  
    const errorElements = document.querySelectorAll('.text-error');  
    errorElements.forEach(el => el.textContent = '');  
    document.getElementById('errorMessage').textContent = '';  
}  

// Set individual field error  
function setFieldError(fieldName, message) {  
    const errorElement = document.getElementById(fieldName + 'Error');  
    if (errorElement) {  
        errorElement.textContent = message;  
    }  
}  

// ====== LOCATION SEARCH ======  

let locationSearchTimeout;  

function setupLocationSearch() {  
    const locationInput = document.getElementById('location');  
    locationInput.addEventListener('input', function(e) {  
        const query = e.target.value.trim();  
        clearTimeout(locationSearchTimeout);  
        if (query.length < 3) {  
            hideSuggestions();  
            clearSelectedLocation();  
            return;  
        }  
        locationSearchTimeout = setTimeout(() => {  
            searchLocations(query);  
        }, 300);  
    });  
    document.getElementById('clearLocation').addEventListener('click', function() {  
        clearSelectedLocation();  
        document.getElementById('location').value = '';  
        document.getElementById('location').focus();  
    });  
}  

async function searchLocations(query) {  
    try {  
        const response = await apiRequest('GET', `/locations/search?q=${encodeURIComponent(query)}`);  
        displayLocationSuggestions(response.locations || []);  
    } catch (error) {  
        console.error('Location search failed:', error);  
        hideSuggestions();  
    }  
}  

function displayLocationSuggestions(locations) {  
    const suggestionsDiv = document.getElementById('locationSuggestions');  
    if (locations.length === 0) {  
        hideSuggestions();  
        return;  
    }  
    suggestionsDiv.innerHTML = '';  
    locations.forEach(location => {  
        const suggestionItem = document.createElement('div');  
        suggestionItem.className = 'suggestion-item';  
        suggestionItem.innerHTML = `  
            <div style="color: white; font-weight: 500; margin-bottom: 0.2rem;">${location.name}</div>  
            <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.8rem;">  
                ${location.lat.toFixed(4)}° N, ${location.lon.toFixed(4)}° E  
            </div>  
        `;  
        suggestionItem.addEventListener('click', () => {  
            selectLocation(location);  
        });  
        suggestionsDiv.appendChild(suggestionItem);  
    });  
    suggestionsDiv.classList.remove('hidden');  
}  

function hideSuggestions() {  
    document.getElementById('locationSuggestions').classList.add('hidden');  
}  

function selectLocation(location) {  
    selectedLocation = location;  
    document.getElementById('location').value = location.name;  
    hideSuggestions();  
    displaySelectedLocation(location);  
}  

function clearSelectedLocation() {  
    selectedLocation = null;  
    document.getElementById('selectedLocationDisplay').classList.add('hidden');  
}  

function displaySelectedLocation(location) {  
    const display = document.getElementById('selectedLocationDisplay');  
    document.getElementById('selectedLocationName').textContent = location.name;  
    document.getElementById('selectedLocationCoords').textContent = `${location.lat.toFixed(4)}° N, ${location.lon.toFixed(4)}° E`;  
    // Update map iframe  
    const bbox = `${location.lon - 0.01},${location.lat - 0.01},${location.lon + 0.01},${location.lat + 0.01}`;  
    document.getElementById('locationMap').src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lon}`;  
    // Google Maps link  
    document.getElementById('googleMapsLink').href = `https://www.google.com/maps?q=${location.lat},${location.lon}`;  
    display.classList.remove('hidden');  
}  

// ====== FORM VALIDATION ======  

function validateForm() {  
    clearErrors();  
    let isValid = true;  

    const fullName = document.getElementById('fullName').value.trim();  
    if (fullName.length < 2) {  
        setFieldError('fullName', 'Name must be at least 2 characters');  
        isValid = false;  
    }  

    const gender = document.getElementById('gender').value;  
    if (!gender) {  
        setFieldError('gender', 'Please select your gender');  
        isValid = false;  
    }  

    const birthDate = document.getElementById('birthDate').value;  
    if (!birthDate) {  
        setFieldError('birthDate', 'Please enter your birth date');  
        isValid = false;  
    }  

    const birthTime = document.getElementById('birthTime').value;  
    const unknownTime = document.getElementById('unknownTime').checked;  
    if (!birthTime && !unknownTime) {  
        setFieldError('birthTime', 'Please enter your birth time or check "unknown time"');  
        isValid = false;  
    }  

    if (!selectedLocation) {  
        setFieldError('location', 'Please select your birth location from the suggestions');  
        isValid = false;  
    }  

    const email = document.getElementById('email').value.trim();  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(email)) {  
        setFieldError('email', 'Please enter a valid email address');  
        isValid = false;  
    }  

    const agreeTerms = document.getElementById('agreeTerms').checked;  
    if (!agreeTerms) {  
        setFieldError('agreeTerms', 'You must agree to the terms and conditions');  
        isValid = false;  
    }  

    return isValid;  
}  

// ====== FORM SUBMISSION ======  

async function submitForm() {  
    if (!validateForm()) {  
        return;  
    }  

    const submitBtn = document.getElementById('submitBtn');  
    submitBtn.disabled = true;  
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Request...';  

    try {  
        const formData = {  
            fullName: document.getElementById('fullName').value.trim(),  
            gender: document.getElementById('gender').value,  
            birthDate: document.getElementById('birthDate').value,  
            birthTime: document.getElementById('unknownTime').checked ? '12:00' : document.getElementById('birthTime').value,  
            email: document.getElementById('email').value.trim(),  
            location: selectedLocation  
        };  

        const response = await apiRequest('POST', '/kundali/create', formData);  

        if (response.success) {  
            kundaliRequestId = response.requestId;  
            userDetails = { ...formData, location: selectedLocation };  
            showSection('paymentSection');  
        } else {  
            showError('Failed to create kundali request. Please try again.');  
        }  
    } catch (error) {  
        console.error('Form submission error:', error);  
        showError('Failed to submit form. Please check your connection and try again.');  
    } finally {  
        submitBtn.disabled = false;  
        submitBtn.innerHTML = '<i class="fas fa-star-and-crescent"></i> Generate My Kundali';  
    }  
}  

// ====== PAYMENT PROCESS ======  

async function processPayment() {  
    if (!kundaliRequestId) {  
        showError('Invalid request. Please start over.');  
        return;  
    }  

    const paymentBtn = document.getElementById('paymentBtn');  
    paymentBtn.disabled = true;  
    paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';  

    try {  
        // Create Razorpay order  
        const orderResponse = await apiRequest('POST', '/payment/create-order', {  
            kundaliRequestId: kundaliRequestId  
        });  

        if (!orderResponse.orderId) {  
            throw new Error('Failed to create payment order');  
        }  

        // Initialize Razorpay payment  
        const paymentResult = await initializeRazorpay({  
            orderId: orderResponse.orderId,  
            amount: orderResponse.amount,  
            currency: orderResponse.currency,  
            key: orderResponse.key,  
            kundaliRequestId: kundaliRequestId  
        });  

        if (paymentResult.success) {  
            showSection('loadingSection');  
            startLoadingAnimation();  

            // Verify payment and generate Kundali  
            const verifyResponse = await apiRequest('POST', '/payment/verify', {  
                razorpay_payment_id: paymentResult.paymentId,  
                razorpay_order_id: paymentResult.orderId,  
                razorpay_signature: paymentResult.signature,  
                kundaliRequestId: kundaliRequestId  
            });  

            if (verifyResponse.success) {  
                kundaliData = verifyResponse.kundali;  
                setTimeout(() => {  
                    displayResults();  
                }, 2000);  
            } else {  
                showError('Payment successful but Kundali generation failed. Please contact support.');  
            }  
        } else {  
            showError(paymentResult.error || 'Payment failed. Please try again.');  
        }  
    } catch (error) {  
        console.error('Payment error:', error);  
        showError('Payment processing failed. Please try again.');  
    } finally {  
        paymentBtn.disabled = false;  
        paymentBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Pay ₹100 Securely';  
    }  
}  

// ====== Razorpay Initialization ======  

async function initializeRazorpay(options) {  
    return new Promise((resolve) => {  
        if (typeof Razorpay === 'undefined') {  
            resolve({  
                success: false,  
                error: "Payment system not loaded. Please refresh the page and try again."  
            });  
            return;  
        }  

        const razorpayOptions = {  
            key: options.key,  
            amount: options.amount,  
            currency: options.currency,  
            name: "Know Your Kundali",  
            description: "Vedic Birth Chart Generation",  
            order_id: options.orderId,  
            theme: {  
                color: "#6c5ce7"  
            },  
            handler: function (response) {  
                resolve({  
                    success: true,  
                    paymentId: response.razorpay_payment_id,  
                    orderId: response.razorpay_order_id,  
                    signature: response.razorpay_signature  
                });  
            },  
            modal: {  
                ondismiss: function () {  
                    resolve({  
                        success: false,  
                        error: "Payment cancelled by user"  
                    });  
                }  
            }  
        };  

        const rzp = new Razorpay(razorpayOptions);  

        rzp.on('payment.failed', function (response) {  
            resolve({  
                success: false,  
                error: response.error.description || "Payment failed"  
            });  
        });  

        rzp.open();  
    });  
}  

// ====== Loading Animation ======  

function startLoadingAnimation() {  
    currentLoadingStep = 0;  
    updateLoadingStep();  
    const interval = setInterval(() => {  
        currentLoadingStep++;  
        if (currentLoadingStep < loadingSteps.length) {  
            updateLoadingStep();  
        } else {  
            clearInterval(interval);  
        }  
    }, 2000);  
}  

function updateLoadingStep() {  
    const stepElement = document.getElementById('loadingStep');  
    if (stepElement && loadingSteps[currentLoadingStep]) {  
        stepElement.textContent = loadingSteps[currentLoadingStep];  
    }  
}  

// ====== RESULTS DISPLAY ======  

function displayResults() {  
    if (!kundaliData || !userDetails) {  
        showError('No data to display. Please try again.');  
        return;  
    }  

    // Populate sections  
    populatePersonalDetails();  
    populatePlanetaryPositions();  
    populateAstrologicalSummary();  
    populateHousesChart();  
    populateDetailedAnalysis();  

    showSection('resultsSection');  
}  

// Populate personal details  
function populatePersonalDetails() {  
    const container = document.getElementById('personalDetails');  
    container.innerHTML = `  
        <div class="summary-item">  
            <span class="summary-label">Name:</span>  
            <span class="summary-value">${userDetails.fullName}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Birth Date:</span>  
            <span class="summary-value">${userDetails.birthDate}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Time:</span>  
            <span class="summary-value">${userDetails.birthTime}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Location:</span>  
            <span class="summary-value">${userDetails.location.name}</span>  
        </div>  
    `;  
}  

// Populate planetary positions  
function populatePlanetaryPositions() {  
    const container = document.getElementById('planetaryPositions');  
    let html = '';  

    if (kundaliData.planetary_positions) {  
        Object.entries(kundaliData.planetary_positions).forEach(([planet, data]) => {  
            html += `  
                <div class="summary-item">  
                    <span class="summary-label">${planet.charAt(0).toUpperCase() + planet.slice(1)}:</span>  
                    <span class="summary-value" style="color: #00ff7f;">${data.sign} ${data.degree.toFixed(0)}°</span>  
                </div>  
            `;  
        });  
    }  
    container.innerHTML = html;  
}  

// Populate astrological summary  
function populateAstrologicalSummary() {  
    const container = document.getElementById('astrologicalSummary');  
    const analysis = kundaliData.analysis || {};  

    container.innerHTML = `  
        <div class="summary-item">  
            <span class="summary-label">Rashi:</span>  
            <span class="summary-value">${analysis.rashi || 'N/A'}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Nakshatra:</span>  
            <span class="summary-value">${analysis.nakshatra || 'N/A'}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Lagna:</span>  
            <span class="summary-value">${analysis.lagna || 'N/A'}</span>  
        </div>  
        <div class="summary-item">  
            <span class="summary-label">Dasha:</span>  
            <span class="summary-value">${analysis.dasha || 'N/A'}</span>  
        </div>  
    `;  
}  

// Populate Houses Chart  
function populateHousesChart() {  
    const container = document.getElementById('housesGrid');  
    container.innerHTML = '';  

    if (kundaliData.houses) {  
        // Assumed mapping to create grid  
        for (let i = 0; i < 16; i++) {  
            const cell = document.createElement('div');  

            if (i === 5 || i === 6 || i === 9 || i === 10) {  
                // continue for center cells (skip)  
                continue;  
            }  

            const houseMapping = [1, 2, 3, 4, 0, 0, 5, 6, 7, 0, 0, 8, 9, 10, 11, 12];  
            const houseNumber = houseMapping[i];  

            if (houseNumber > 0) {  
                const house = kundaliData.houses.find(h => h.number === houseNumber);  
                if (house) {  
                    cell.className = 'house';  
                    cell.innerHTML = `  
                        <div class="house-number">${getRomanNumeral(house.number)}</div>  
                        <div class="house-sign">${house.sign}</div>  
                        <div class="house-planets">${house.planets.length > 0 ? house.planets.join(', ') : '-'}</div>  
                    `;  
                }  
            }  
            container.appendChild(cell);  
        }  
    }  
}  

// Populate detailed analysis  
function populateDetailedAnalysis() {  
    const planetaryContainer = document.getElementById('planetaryAnalysis');  
    let planetaryHtml = '';  

    if (kundaliData.planetary_positions) {  
        Object.entries(kundaliData.planetary_positions).forEach(([planet, data]) => {  
            planetaryHtml += `  
                <div class="glass-card" style="padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.1);">  
                    <h4 style="color: #00ff7f; margin-bottom: 0.5rem; text-transform: capitalize;">  
                        ${planet} in ${data.sign}  
                    </h4>  
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">  
                        ${getPlanetaryDescription(planet, data)}  
                    </p>  
                </div>  
            `;  
        });  
    }  
    planetaryContainer.innerHTML = planetaryHtml;  

    // House Analysis  
    const houseContainer = document.getElementById('houseAnalysis');  
    let houseHtml = '';  

    if (kundaliData.houses) {  
        kundaliData.houses.slice(0, 6).forEach(house => {  
            houseHtml += `  
                <div style="display: flex; align-items: start; margin-bottom: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">  
                    <div style="width: 30px; height: 30px; background: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 1rem; flex-shrink: 0;">  
                        ${house.number}  
                    </div>  
                    <div>  
                        <h4 style="color: #00ff7f; margin-bottom: 0.5rem;">  
                            ${getHouseTitle(house.number)} - ${house.sign}  
                        </h4>  
                        <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">  
                            ${getHouseDescription(house.number, house.planets)}  
                        </p>  
                    </div>  
                </div>  
            `;  
        });  
    }  
    houseContainer.innerHTML = houseHtml;  

    // Remedies  
    const remediesContainer = document.getElementById('remediesContent');  
    let remediesHtml = '';  

    if (kundaliData.remedies) {  
        kundaliData.remedies.forEach(remedy => {  
            const icon = remedy.type === 'gemstone' ? 'gem' : 'pray';  
            remediesHtml += `  
                <div class="glass-card" style="padding: 1rem; border: 1px solid rgba(0, 255, 127, 0.3);">  
                    <h4 style="color: #00ff7f; margin-bottom: 0.5rem;">  
                        <i class="fas fa-${icon}"></i> ${remedy.title}  
                    </h4>  
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">  
                        ${remedy.description}  
                    </p>  
                </div>  
            `;  
        });  
    }  
    remediesContainer.innerHTML = remediesHtml;  
}  

// Helper functions  
function getRomanNumeral(num) {  
    const romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];  
    return romans[num] || num.toString();  
}  

function getPlanetaryDescription(planet, data) {  
    const descriptions = {  
        sun: "Strong placement indicating leadership abilities, creativity, and natural charisma that draws others to you.",  
        moon: "Provides emotional stability, love for beauty, and a practical approach to achieving your goals.",  
        mars: "Indicates energy, ambition, and a pioneering spirit with strong initiative.",  
        mercury: "Represents communication skills, intelligence, and adaptability in various situations.",  
        jupiter: "Brings wisdom, good fortune, and spiritual growth opportunities.",  
        venus: "Influences love, relationships, and artistic talents.",  
        saturn: "Teaches discipline, patience, and the value of hard work."  
    };  
    return descriptions[planet.toLowerCase()] || "Significant planetary influence in your chart.";  
}  

function getHouseTitle(num) {  
    const titles = [  
        '', 'First House - Self & Personality', 'Second House - Wealth & Values', 'Third House - Communication',  
        'Fourth House - Home & Family', 'Fifth House - Creativity & Children', 'Sixth House - Health & Service',  
        'Seventh House - Partnerships', 'Eighth House - Transformation', 'Ninth House - Wisdom & Travel',  
        'Tenth House - Career & Status', 'Eleventh House - Friends & Goals', 'Twelfth House - Spirituality'  
    ];  
    return titles[num] || `House ${num}`;  
}  

function getHouseDescription(num, planets) {  
    const descriptions = [  
        '',  
        "Represents your personality, physical appearance, and approach to life. This house influences how others perceive you.",  
        "Governs your finances, possessions, and value system. It indicates your earning potential and material security.",  
        "Rules communication, siblings, and short journeys. It shows your learning style and mental agility.",  
        "Represents home, family, and emotional foundations. It indicates your roots and private life.",  
        "Governs creativity, children, and romance. It shows your creative expression and capacity for joy.",  
        "Rules health, daily routine, and service to others. It indicates your work environment and health habits."  
    ];  

    let desc = descriptions[num] || "Significant area of life influence.";  
    if (planets && planets.length > 0) {  
        desc += ` With ${planets.join(', ')} placed here, this area gains additional significance.`;  
    }  
    return desc;  
}  

// Download PDF of Kundali  
function downloadPDF() {  
    try {  
        if (typeof jsPDF === 'undefined') {  
            alert('PDF library not loaded. Please refresh the page and try again.');  
            return;  
        }  
        const { jsPDF } = window;  
        const doc = new jsPDF();  

        // Set title  
        doc.setFontSize(20);  
        doc.setTextColor(108, 92, 231);  
        doc.text('Your Vedic Kundali Report', 20, 20);  

        // Basic info  
        doc.setFontSize(12);  
        doc.setTextColor(0, 0, 0);  
        doc.text(`Generated by Know Your Kundali`, 20, 30);  
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);  
        doc.text(`Name: ${userDetails.fullName}`, 20, 45);  
        doc.text(`Birth Date: ${userDetails.birthDate}`, 20, 52);  
        doc.text(`Time of Birth: ${userDetails.birthTime}`, 20, 59);  
        doc.text(`Location: ${userDetails.location.name}`, 20, 66);  
        doc.text(`Coordinates: ${userDetails.location.lat.toFixed(4)}°N, ${userDetails.location.lon.toFixed(4)}°E`, 20, 73);  

        // Add analysis sections similarly...  
        // (Omitting detailed layout for brevity, but similar to above code)  

        // Save PDF  
        const filename = `${userDetails.fullName.replace(/\s+/g, '_')}_Kundali_Report.pdf`;  
        doc.save(filename);  
        alert('PDF downloaded successfully!');  
    } catch (error) {  
        console.error('PDF generation error:', error);  
        alert('Failed to generate PDF. Please try again.');  
    }  
}  

// Share on WhatsApp  
function shareWhatsApp() {  
    const message = `Check out my Vedic Kundali birth chart! Generated at Know Your Kundali.`;  
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;  
    window.open(url, '_blank');  
}  

// Create new Kundali  
function createNewKundali() {  
    if (confirm('Create a new Kundali? This will clear the current results.')) {  
        // Reset all state  
        currentStep = 'form';  
        kundaliRequestId = '';  
        kundaliData = null;  
        userDetails = null;  
        selectedLocation = null;  

        // Reset form  
        document.getElementById('kundaliForm').reset();  
        clearSelectedLocation();  
        clearErrors();  

        // Show form section  
        showSection('formSection');  
    }  
}  

// Setup Tabs  
function setupTabs() {  
    const tabButtons = document.querySelectorAll('.tab-button');  
    const tabPanes = document.querySelectorAll('.tab-pane');  

    tabButtons.forEach(button => {  
        button.addEventListener('click', () => {  
            const targetTab = button.getAttribute('data-tab');  
            tabButtons.forEach(btn => btn.classList
