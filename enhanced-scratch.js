// Enhanced Scratch Card System with Mystical Integration
class EnhancedScratchCard {
    constructor() {
        this.mysticalEngine = new MysticalEngine();
        this.scratchArea = 0;
        this.canvas = null;
        this.ctx = null;
        this.cardData = null;
        this.formData = null;
        
        this.initializeScratchCard();
    }

    initializeScratchCard() {
        // Check if payment was successful
        if (!this.verifyPayment()) {
            window.location.href = 'cards.html';
            return;
        }

        // Load stored card and form data
        this.loadStoredData();
        
        // Generate mystical reading
        this.generateReading();
        
        // Setup scratch canvas
        this.setupCanvas();
        
        // Display card content
        this.displayCard();
    }

    verifyPayment() {
        const paymentStatus = localStorage.getItem('paymentStatus');
        const paymentId = localStorage.getItem('paymentId');
        return paymentStatus === 'completed' && paymentId;
    }

    loadStoredData() {
        const storedCardData = localStorage.getItem('cardFormData');
        if (storedCardData) {
            const parsedData = JSON.parse(storedCardData);
            this.cardData = parsedData.cardType;
            this.formData = parsedData.formData;
        }
    }

    generateReading() {
        if (!this.formData || !this.cardData) return;

        let reading = {};

        switch (this.cardData) {
            case 'pastlife':
                reading = this.mysticalEngine.generatePastLifeReading(this.formData);
                break;
            case 'mangalik':
                reading = this.mysticalEngine.checkMangalikDosha(this.formData);
                break;
            case 'marriage':
                reading = this.mysticalEngine.predictMarriage(this.formData);
                break;
            case 'luckyname':
                reading = this.mysticalEngine.generateLuckyName(this.formData);
                break;
            case 'planet':
                reading = this.mysticalEngine.identifyBlockingPlanet(this.formData);
                break;
            case 'child':
                reading = this.mysticalEngine.predictFutureChild(this.formData);
                break;
            case 'twinflame':
                reading = this.mysticalEngine.analyzeTwinFlame(this.formData);
                break;
            case 'relationship':
                reading = this.mysticalEngine.analyzeRelationshipKarma(this.formData);
                break;
            default:
                reading = { error: 'Unknown card type' };
        }

        this.reading = reading;
        localStorage.setItem('currentReading', JSON.stringify(reading));
    }

    setupCanvas() {
        this.canvas = document.getElementById('scratchCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        const revealedCard = document.querySelector('.revealed-card');

        const resizeCanvas = () => {
            if (revealedCard) {
                const rect = revealedCard.getBoundingClientRect();
                const pixelRatio = window.devicePixelRatio || 1;
                
                // Set actual size in memory (scaled to account for pixel density)
                this.canvas.width = rect.width * pixelRatio;
                this.canvas.height = rect.height * pixelRatio;
                
                // Scale the canvas back down using CSS
                this.canvas.style.width = rect.width + 'px';
                this.canvas.style.height = rect.height + 'px';
                
                // Scale the drawing context so everything draws at the correct size
                this.ctx.scale(pixelRatio, pixelRatio);
                
                this.drawScratchLayer();
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        this.addScratchEventListeners();
    }

    drawScratchLayer() {
        if (!this.canvas || !this.ctx) return;

        // Create metallic gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.2, '#FFA500');
        gradient.addColorStop(0.4, '#FF8C00');
        gradient.addColorStop(0.6, '#FFD700');
        gradient.addColorStop(0.8, '#FFA500');
        gradient.addColorStop(1, '#FF6347');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add mystical texture
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < this.canvas.width; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i + 30, this.canvas.height);
            this.ctx.stroke();
        }

        // Add card-specific text
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.font = 'bold 28px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('✨ SCRATCH TO REVEAL ✨', this.canvas.width / 2, this.canvas.height / 2 - 30);

        this.ctx.font = '18px Noto Sans KR';
        this.ctx.fillText('Your Cosmic Destiny Awaits', this.canvas.width / 2, this.canvas.height / 2 + 10);

        // Add mystical symbols
        this.ctx.font = '40px serif';
        this.ctx.fillText('🔮', this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
        this.ctx.fillText('⭐', this.canvas.width / 2 + 100, this.canvas.height / 2 + 50);
    }

    addScratchEventListeners() {
        if (!this.canvas) return;

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startScratch(e));
        this.canvas.addEventListener('mousemove', (e) => this.scratch(e));
        this.canvas.addEventListener('mouseup', () => this.stopScratch());
        this.canvas.addEventListener('mouseleave', () => this.stopScratch());

        // Enhanced touch events with better coordinate handling
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startScratchTouch(e);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.scratchTouch(e);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopScratch();
        });
        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.stopScratch();
        });

        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    startScratch(e) {
        window.globalScratchState.isScratching = true;
        this.scratch(e);
    }

    startScratchTouch(e) {
        window.globalScratchState.isScratching = true;
        this.scratchTouch(e);
    }

    scratch(e) {
        if (!window.globalScratchState.isScratching || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        this.performScratch(x, y);
    }

    scratchTouch(e) {
        if (!window.globalScratchState.isScratching || !this.ctx) return;

        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            this.performScratch(x, y);
        }
    }

    performScratch(x, y) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, 2 * Math.PI);
        this.ctx.fill();

        this.calculateScratchedArea();
    }

    stopScratch() {
        window.globalScratchState.isScratching = false;
    }

    calculateScratchedArea() {
        if (!this.ctx || !this.canvas) return;

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparent++;
            }
        }

        this.scratchArea = (transparent / (pixels.length / 4)) * 100;

        if (this.scratchArea > 25) {
            this.showActionButtons();
        }
    }

    showActionButtons() {
        const actionButtons = document.getElementById('actionButtons');
        const scratchInstructions = document.getElementById('scratchInstructions');

        if (actionButtons && scratchInstructions) {
            actionButtons.style.display = 'flex';
            scratchInstructions.style.display = 'none';
            this.setupActionButtons();
        }
    }

    setupActionButtons() {
        const downloadButton = document.getElementById('downloadButton');
        const shareButton = document.getElementById('shareButton');
        const newReadingButton = document.getElementById('newReadingButton');

        if (downloadButton) {
            downloadButton.addEventListener('click', () => this.downloadCard());
        }

        if (shareButton) {
            shareButton.addEventListener('click', () => this.shareReading());
        }

        if (newReadingButton) {
            newReadingButton.addEventListener('click', () => {
                window.location.href = 'cards.html';
            });
        }
    }

    displayCard() {
        if (!this.reading) return;

        const cardElement = document.querySelector('.revealed-card');
        if (!cardElement) return;

        const cardContent = this.generateCardContent();
        cardElement.innerHTML = cardContent;
    }

    generateCardContent() {
        if (!this.reading || !this.cardData) return '<p>Loading your reading...</p>';

        const cardTitles = {
            pastlife: 'Your Past Life Revealed',
            mangalik: 'Mangalik Analysis',
            marriage: 'Marriage Prediction',
            luckyname: 'Your Lucky Name',
            planet: 'Blocking Planet Identified',
            child: 'Future Child Prediction',
            twinflame: 'Your Twin Flame',
            relationship: 'Relationship Analysis'
        };

        const cardIcons = {
            pastlife: '🌌',
            mangalik: '🔥',
            marriage: '💍',
            luckyname: '✨',
            planet: '🚫',
            child: '🧒',
            twinflame: '🔥',
            relationship: '❤️'
        };

        let content = `
            <div class="card-header">
                <div class="card-icon">${cardIcons[this.cardData] || '🔮'}</div>
                <h2 class="card-title">${cardTitles[this.cardData] || 'Mystical Reading'}</h2>
            </div>
            <div class="card-content">
        `;

        // Generate content based on card type
        switch (this.cardData) {
            case 'pastlife':
                content += this.generatePastLifeContent();
                break;
            case 'mangalik':
                content += this.generateMangalikContent();
                break;
            case 'marriage':
                content += this.generateMarriageContent();
                break;
            case 'luckyname':
                content += this.generateLuckyNameContent();
                break;
            case 'planet':
                content += this.generatePlanetContent();
                break;
            case 'child':
                content += this.generateChildContent();
                break;
            case 'twinflame':
                content += this.generateTwinFlameContent();
                break;
            case 'relationship':
                content += this.generateRelationshipContent();
                break;
        }

        content += '</div>';
        return content;
    }

    generatePastLifeContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Your Past Life</h3>
                <p><strong>Era:</strong> ${r.pastLife.era}</p>
                <p><strong>Role:</strong> ${r.pastLife.role}</p>
                <p><strong>Karma Theme:</strong> ${r.pastLife.karma}</p>
            </div>
            <div class="reading-section">
                <h3>Current Life Lesson</h3>
                <p>${r.currentLesson}</p>
            </div>
            <div class="reading-section">
                <h3>Karma Score</h3>
                <p>${r.karmaScore}/100</p>
            </div>
            <div class="reading-section special-message">
                <h3>Personal Message</h3>
                <p>${r.specialMessage}</p>
            </div>
        `;
    }

    generateMangalikContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Mangalik Status</h3>
                <p><strong>${r.isMangalik ? 'Yes, you are Mangalik' : 'No, you are not Mangalik'}</strong></p>
                <p><strong>Intensity:</strong> ${r.intensity}</p>
            </div>
            <div class="reading-section">
                <h3>Marriage Timing</h3>
                <p>${r.marriageAge}</p>
            </div>
            <div class="reading-section">
                <h3>Remedies</h3>
                <ul>
                    ${r.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                </ul>
            </div>
            <div class="reading-section">
                <h3>Compatibility Advice</h3>
                <p>${r.compatibilityAdvice}</p>
            </div>
        `;
    }

    generateMarriageContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Marriage Timing</h3>
                <p><strong>Age:</strong> ${r.predictedAge} years</p>
                <p><strong>Year:</strong> ${r.predictedYear}</p>
                <p><strong>Month:</strong> ${r.predictedMonth}</p>
            </div>
            <div class="reading-section">
                <h3>Partner Profile</h3>
                <p>${r.partnerProfile}</p>
            </div>
            <div class="reading-section">
                <h3>Lucky Zodiac Signs</h3>
                <p>${r.luckySigns.join(', ')}</p>
            </div>
            <div class="reading-section special-message">
                <h3>Special Advice</h3>
                <p>${r.specialAdvice}</p>
            </div>
        `;
    }

    generateLuckyNameContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Name Analysis</h3>
                <p><strong>Current Name Number:</strong> ${r.currentNameNumber}</p>
                <p><strong>Ideal Name Number:</strong> ${r.idealNameNumber}</p>
            </div>
            <div class="reading-section">
                <h3>Lucky Variations</h3>
                <ul>
                    ${r.luckyVariations.map(name => `<li>${name}</li>`).join('')}
                </ul>
            </div>
            <div class="reading-section">
                <h3>Suggested Lucky Initial</h3>
                <p><strong>${r.suggestedInitial}</strong></p>
            </div>
            <div class="reading-section special-message">
                <h3>Numerology Advice</h3>
                <p>${r.numerologyAdvice}</p>
            </div>
        `;
    }

    generatePlanetContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Blocking Planet</h3>
                <p><strong>${r.blockingPlanet}</strong></p>
                <p><strong>Blocking Percentage:</strong> ${r.blockingPercentage}%</p>
            </div>
            <div class="reading-section">
                <h3>Current Effect</h3>
                <p>${r.currentEffect}</p>
            </div>
            <div class="reading-section">
                <h3>Suggested Remedies</h3>
                <ul>
                    ${r.suggestedRemedies.map(remedy => `<li>${remedy}</li>`).join('')}
                </ul>
            </div>
            <div class="reading-section">
                <h3>Timeline for Relief</h3>
                <p>${r.timelineForRelief}</p>
            </div>
        `;
    }

    generateChildContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Future Child</h3>
                <p><strong>Gender:</strong> ${r.predictedGender}</p>
                <p><strong>Birth Season:</strong> ${r.birthSeason}</p>
            </div>
            <div class="reading-section">
                <h3>Personality & Talents</h3>
                <p><strong>Main Trait:</strong> ${r.personalityTrait}</p>
                <p><strong>Special Talent:</strong> ${r.specialTalent}</p>
            </div>
            <div class="reading-section">
                <h3>Lucky Number</h3>
                <p><strong>${r.luckyNumber}</strong></p>
            </div>
            <div class="reading-section special-message">
                <h3>Special Bond</h3>
                <p>${r.specialBond}</p>
            </div>
        `;
    }

    generateTwinFlameContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Past Life Connection</h3>
                <p>${r.pastLifeConnection}</p>
            </div>
            <div class="reading-section">
                <h3>Recognition Sign</h3>
                <p>${r.recognitionSign}</p>
            </div>
            <div class="reading-section">
                <h3>Meeting Circumstance</h3>
                <p>${r.meetingCircumstance}</p>
            </div>
            <div class="reading-section">
                <h3>Union Timeline</h3>
                <p>${r.unionTimeline}</p>
            </div>
            <div class="reading-section special-message">
                <h3>Spiritual Message</h3>
                <p>${r.spiritualMessage}</p>
            </div>
        `;
    }

    generateRelationshipContent() {
        const r = this.reading;
        return `
            <div class="reading-section">
                <h3>Relationship Type</h3>
                <p><strong>${r.relationshipType}</strong></p>
                <p><strong>Compatibility Score:</strong> ${r.compatibilityScore}%</p>
            </div>
            <div class="reading-section">
                <h3>Past Life Connection</h3>
                <p>${r.pastLifeConnection}</p>
            </div>
            <div class="reading-section">
                <h3>Karmic Lesson</h3>
                <p>${r.karmicLesson}</p>
            </div>
            <div class="reading-section">
                <h3>Growth Potential</h3>
                <p>${r.growthPotential}</p>
            </div>
            <div class="reading-section special-message">
                <h3>Future Advice</h3>
                <p>${r.futureAdvice}</p>
            </div>
        `;
    }

    downloadCard() {
        const cardElement = document.querySelector('.revealed-card');
        if (!cardElement) return;

        // Create canvas for download
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');

        // Set high resolution
        downloadCanvas.width = 800;
        downloadCanvas.height = 1000;

        // Background
        const gradient = downloadCtx.createLinearGradient(0, 0, 800, 1000);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');

        downloadCtx.fillStyle = gradient;
        downloadCtx.fillRect(0, 0, 800, 1000);

        // Title
        downloadCtx.fillStyle = '#00cec9';
        downloadCtx.font = 'bold 36px Orbitron';
        downloadCtx.textAlign = 'center';
        downloadCtx.fillText('WitchCard Reading', 400, 80);

        // Subtitle
        const cardTitles = {
            pastlife: 'Past Life Regression',
            mangalik: 'Mangalik Analysis',
            marriage: 'Marriage Prediction',
            luckyname: 'Lucky Name Reading',
            planet: 'Blocking Planet Analysis',
            child: 'Future Child Prediction',
            twinflame: 'Twin Flame Reading',
            relationship: 'Relationship Analysis'
        };

        downloadCtx.fillStyle = '#6c5ce7';
        downloadCtx.font = '24px Orbitron';
        downloadCtx.fillText(cardTitles[this.cardData] || 'Mystical Reading', 400, 120);

        // Add reading content (simplified for image)
        downloadCtx.fillStyle = '#ffffff';
        downloadCtx.font = '16px Noto Sans KR';
        downloadCtx.textAlign = 'left';

        const lines = this.getReadingSummary();
        let yPos = 180;
        lines.forEach(line => {
            downloadCtx.fillText(line, 50, yPos);
            yPos += 30;
        });

        // Footer
        downloadCtx.fillStyle = '#00cec9';
        downloadCtx.font = '14px Noto Sans KR';
        downloadCtx.textAlign = 'center';
        downloadCtx.fillText('Generated by WitchCard.shop', 400, 950);
        downloadCtx.fillText(new Date().toLocaleDateString(), 400, 970);

        // Download
        const link = document.createElement('a');
        link.download = `WitchCard_${this.cardData}_${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL();
        link.click();
    }

    getReadingSummary() {
        // Return simplified reading summary for download
        const summaries = {
            pastlife: [
                `Past Life: ${this.reading.pastLife?.era || 'Unknown'}`,
                `Role: ${this.reading.pastLife?.role || 'Unknown'}`,
                `Current Lesson: ${this.reading.currentLesson || 'Unknown'}`,
                `Karma Score: ${this.reading.karmaScore || 0}/100`
            ],
            mangalik: [
                `Mangalik Status: ${this.reading.isMangalik ? 'Yes' : 'No'}`,
                `Intensity: ${this.reading.intensity || 'None'}`,
                `Marriage Age: ${this.reading.marriageAge || 'Unknown'}`,
                `Remedies: ${this.reading.remedies?.slice(0, 2).join(', ') || 'None'}`
            ],
            marriage: [
                `Marriage Age: ${this.reading.predictedAge || 'Unknown'} years`,
                `Marriage Year: ${this.reading.predictedYear || 'Unknown'}`,
                `Marriage Month: ${this.reading.predictedMonth || 'Unknown'}`,
                `Partner: ${this.reading.partnerProfile || 'Unknown'}`
            ]
        };

        return summaries[this.cardData] || ['Reading details available in full version'];
    }

    shareReading() {
        const cardTitles = {
            pastlife: 'Past Life Regression',
            mangalik: 'Mangalik Analysis',
            marriage: 'Marriage Prediction',
            luckyname: 'Lucky Name Reading',
            planet: 'Blocking Planet Analysis',
            child: 'Future Child Prediction',
            twinflame: 'Twin Flame Reading',
            relationship: 'Relationship Analysis'
        };

        const title = cardTitles[this.cardData] || 'Mystical Reading';
        const message = `🔮 I just got my ${title} from WitchCard! The cosmic insights are amazing! ✨ Get your mystical reading at witchcard.shop 🌟`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Initialize enhanced scratch card when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('scratch.html')) {
        new EnhancedScratchCard();
    }
});