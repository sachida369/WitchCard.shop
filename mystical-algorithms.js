// Mystical Algorithms Engine - Advanced Astrological Calculations
class MysticalEngine {
    constructor() {
        this.zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        this.planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
        this.houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 
                          'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 
                          'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshta', 'Mula', 'Purva Ashadha', 
                          'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 
                          'Uttara Bhadrapada', 'Revati'];
    }

    // Core numerology calculation
    calculateLifePath(dateOfBirth) {
        const date = new Date(dateOfBirth);
        let total = date.getDate() + (date.getMonth() + 1) + date.getFullYear();
        
        while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
            total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        
        return total;
    }

    // Name numerology calculation
    calculateNameNumber(name) {
        const values = {
            a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
            j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
            s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
        };
        
        let total = name.toLowerCase().replace(/[^a-z]/g, '').split('')
                       .reduce((sum, char) => sum + (values[char] || 0), 0);
        
        while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
            total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        
        return total;
    }

    // Zodiac calculation from date
    getZodiacSign(dateOfBirth) {
        const date = new Date(dateOfBirth);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
        return 'Pisces';
    }

    // Past Life Regression Algorithm
    generatePastLifeReading(formData) {
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const nameNumber = this.calculateNameNumber(formData.fullName);
        const zodiac = this.getZodiacSign(formData.dateOfBirth);
        
        const pastLives = [
            { era: 'Ancient Egypt', role: 'Priest/Priestess', karma: 'Spiritual wisdom' },
            { era: 'Medieval Europe', role: 'Healer', karma: 'Compassion and service' },
            { era: 'Ancient Greece', role: 'Philosopher', karma: 'Knowledge and truth' },
            { era: 'Victorian England', role: 'Artist', karma: 'Creative expression' },
            { era: 'Ancient Rome', role: 'Warrior', karma: 'Courage and leadership' },
            { era: 'Renaissance Italy', role: 'Scholar', karma: 'Learning and teaching' },
            { era: 'Ancient India', role: 'Yogi', karma: 'Inner peace and meditation' },
            { era: 'Mayan Civilization', role: 'Astronomer', karma: 'Cosmic understanding' },
            { era: 'Celtic Britain', role: 'Druid', karma: 'Nature connection' }
        ];

        const selectedLife = pastLives[(lifePath + nameNumber) % pastLives.length];
        
        const lessons = [
            'Complete unfinished business with family',
            'Learn to trust your intuition',
            'Balance material and spiritual pursuits',
            'Develop patience and understanding',
            'Embrace your creative potential',
            'Heal old wounds and forgive',
            'Step into leadership roles',
            'Connect with your higher purpose'
        ];

        const currentLesson = lessons[nameNumber % lessons.length];

        return {
            pastLife: selectedLife,
            currentLesson: currentLesson,
            zodiacInfluence: zodiac,
            karmaScore: ((lifePath + nameNumber) % 100) + 1,
            specialMessage: this.generatePersonalizedMessage(formData.fullName, selectedLife.era)
        };
    }

    // Mangalik Dosha Checker
    checkMangalikDosha(formData) {
        const date = new Date(formData.dateOfBirth);
        const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const birthDate = date.getDate();
        const month = date.getMonth() + 1;
        
        // Simplified Mangalik calculation based on date patterns
        const isMangalik = (birthDate % 7 === 2) || (month % 3 === 0) || (day === 2) || (day === 4);
        
        const intensity = isMangalik ? ['Low', 'Medium', 'High'][birthDate % 3] : 'None';
        
        const remedies = [
            'Chant Hanuman Chalisa daily',
            'Donate red lentils on Tuesdays',
            'Visit Hanuman temple on Tuesdays',
            'Wear coral gemstone after consulting astrologer',
            'Fast on Tuesdays',
            'Perform Mars puja',
            'Plant red flowers in your garden'
        ];

        const marriageAge = isMangalik ? 
            `After age ${25 + (birthDate % 3)}` : 
            `Between age ${22 + (birthDate % 4)} - ${26 + (birthDate % 3)}`;

        return {
            isMangalik: isMangalik,
            intensity: intensity,
            marriageAge: marriageAge,
            remedies: remedies.slice(0, 3),
            compatibilityAdvice: isMangalik ? 
                'Best to marry another Mangalik or perform proper remedies' :
                'No Mangalik restrictions - compatible with all'
        };
    }

    // Marriage Prediction Algorithm
    predictMarriage(formData) {
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const nameNumber = this.calculateNameNumber(formData.fullName);
        const currentYear = new Date().getFullYear();
        const birthYear = new Date(formData.dateOfBirth).getFullYear();
        const currentAge = currentYear - birthYear;

        const marriageAge = 22 + ((lifePath + nameNumber) % 8);
        const marriageYear = birthYear + marriageAge;
        const marriageMonth = ['March', 'June', 'September', 'December', 'February', 'May', 'October', 'November'][nameNumber % 8];

        const partnerTraits = [
            'Artistic and creative soul',
            'Ambitious and driven professional',
            'Spiritual and intuitive person',
            'Kind-hearted and nurturing nature',
            'Intellectual and well-educated',
            'Adventurous and free-spirited',
            'Traditional and family-oriented',
            'Innovative and tech-savvy'
        ];

        const challenges = [
            'Distance or family approval',
            'Career priorities conflicting',
            'Different cultural backgrounds',
            'Age gap considerations',
            'Financial stability timing'
        ];

        return {
            predictedAge: marriageAge,
            predictedYear: marriageYear > currentYear ? marriageYear : currentYear + 1,
            predictedMonth: marriageMonth,
            partnerProfile: partnerTraits[lifePath % partnerTraits.length],
            potentialChallenge: challenges[nameNumber % challenges.length],
            luckySigns: this.zodiacSigns.slice(lifePath % 6, (lifePath % 6) + 3),
            isDelayed: currentAge > marriageAge,
            specialAdvice: marriageYear <= currentYear ? 
                'Your marriage window is active - stay open to connections' :
                'Prepare yourself for the cosmic timing ahead'
        };
    }

    // Lucky Name Generator
    generateLuckyName(formData) {
        const currentNameNumber = this.calculateNameNumber(formData.fullName);
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const zodiac = this.getZodiacSign(formData.dateOfBirth);

        // Calculate ideal name number
        const idealNumbers = [1, 3, 6, 9]; // Generally lucky numbers
        const idealNameNumber = idealNumbers[lifePath % idealNumbers.length];

        const nameVariations = this.generateNameVariations(formData.fullName, idealNameNumber);
        
        const luckyInitials = ['A', 'D', 'G', 'J', 'M', 'P', 'S', 'V', 'Y'];
        const suggestedInitial = luckyInitials[lifePath % luckyInitials.length];

        return {
            currentNameNumber: currentNameNumber,
            idealNameNumber: idealNameNumber,
            luckyVariations: nameVariations,
            suggestedInitial: suggestedInitial,
            numerologyAdvice: `Your name resonates with number ${currentNameNumber}. For maximum luck, use ${idealNameNumber}`,
            businessNameLuck: this.generateBusinessNameLuck(formData.fullName, lifePath),
            signatureAdvice: 'Sign your name with confidence and positive intention'
        };
    }

    // Blocking Planet Identifier
    identifyBlockingPlanet(formData) {
        const date = new Date(formData.dateOfBirth);
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const issueIndex = ['Career & Money', 'Love & Relationships', 'Health & Wellness', 
                           'Family & Home', 'Studies & Education', 'Travel & Foreign', 
                           'Spiritual Growth'].indexOf(formData.currentIssue);

        const planetInfluences = {
            'Saturn': { 
                issues: ['Career & Money', 'Studies & Education'],
                effects: 'Delays and obstacles in material progress',
                remedies: ['Donate black sesame on Saturdays', 'Chant Shani mantra', 'Wear blue sapphire']
            },
            'Mars': {
                issues: ['Love & Relationships', 'Family & Home'],
                effects: 'Conflicts and aggressive energy',
                remedies: ['Donate red lentils on Tuesdays', 'Chant Hanuman Chalisa', 'Wear coral']
            },
            'Mercury': {
                issues: ['Studies & Education', 'Career & Money'],
                effects: 'Communication and learning blocks',
                remedies: ['Donate green items on Wednesdays', 'Chant Vishnu sahasranama', 'Wear emerald']
            },
            'Venus': {
                issues: ['Love & Relationships', 'Spiritual Growth'],
                effects: 'Relationship and creative blocks',
                remedies: ['Donate white items on Fridays', 'Chant Lakshmi mantra', 'Wear diamond/zircon']
            },
            'Jupiter': {
                issues: ['Spiritual Growth', 'Health & Wellness'],
                effects: 'Wisdom and growth limitations',
                remedies: ['Donate yellow items on Thursdays', 'Chant Guru mantra', 'Wear yellow sapphire']
            },
            'Rahu': {
                issues: ['Travel & Foreign', 'Career & Money'],
                effects: 'Confusion and unconventional challenges',
                remedies: ['Donate black & blue items on Saturdays', 'Chant Rahu mantra', 'Wear hessonite']
            }
        };

        // Select blocking planet based on issue and birth details
        const potentialPlanets = Object.keys(planetInfluences).filter(planet => 
            planetInfluences[planet].issues.includes(formData.currentIssue)
        );
        
        const blockingPlanet = potentialPlanets[lifePath % potentialPlanets.length] || 'Saturn';
        const influence = planetInfluences[blockingPlanet];

        return {
            blockingPlanet: blockingPlanet,
            currentEffect: influence.effects,
            suggestedRemedies: influence.remedies,
            blockingPercentage: 60 + (lifePath % 30),
            timelineForRelief: `${3 + (lifePath % 6)} months with consistent remedies`,
            alternativeSolution: 'Consider changing your approach or seeking spiritual guidance'
        };
    }

    // Future Child Prediction
    predictFutureChild(formData) {
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const nameNumber = this.calculateNameNumber(formData.fullName);
        const zodiac = this.getZodiacSign(formData.dateOfBirth);

        const gender = (lifePath + nameNumber) % 2 === 0 ? 'Girl' : 'Boy';
        
        const personalityTraits = {
            'Girl': ['Creative and artistic', 'Intelligent and studious', 'Compassionate and caring', 'Strong-willed and independent', 'Social and charismatic'],
            'Boy': ['Adventurous and brave', 'Analytical and logical', 'Athletic and energetic', 'Kind and empathetic', 'Innovative and creative']
        };

        const talents = ['Music', 'Sports', 'Art', 'Science', 'Literature', 'Technology', 'Dancing', 'Acting'];
        const childTalent = talents[nameNumber % talents.length];

        const birthTiming = ['Spring (March-May)', 'Summer (June-August)', 'Monsoon (September-November)', 'Winter (December-February)'][lifePath % 4];

        return {
            predictedGender: gender,
            personalityTrait: personalityTraits[gender][lifePath % personalityTraits[gender].length],
            specialTalent: childTalent,
            birthSeason: birthTiming,
            luckyNumber: (lifePath + nameNumber) % 9 + 1,
            parentalChallenge: 'Teaching patience and discipline',
            specialBond: gender === 'Girl' ? 'Strong connection with mother' : 'Special bond with father',
            futureSuccess: 'High potential in creative or technical fields'
        };
    }

    // Twin Flame Analysis
    analyzeTwinFlame(formData) {
        const lifePath = this.calculateLifePath(formData.dateOfBirth);
        const nameNumber = this.calculateNameNumber(formData.fullName);
        const zodiac = this.getZodiacSign(formData.dateOfBirth);

        const pastLifeConnections = [
            'Egyptian temple priests who served together',
            'Medieval star-crossed lovers separated by war',
            'Renaissance artists who inspired each other',
            'Ancient Greek philosophers who debated wisdom',
            'Roman soldiers who saved each other in battle',
            'Mayan astronomers who mapped the stars together',
            'Celtic druids who shared mystical knowledge',
            'Indian sages who meditated in the same ashram'
        ];

        const twinFlameTraits = [
            'Eyes that feel familiar from the first meeting',
            'Opposite personality but complementary energy',
            'Shared dreams or synchronistic experiences',
            'Instant recognition on a soul level',
            'Similar life challenges and growth patterns',
            'Natural ability to communicate without words',
            'Shared spiritual or creative interests',
            'Feeling of coming home when together'
        ];

        const connectionType = pastLifeConnections[lifePath % pastLifeConnections.length];
        const recognitionSign = twinFlameTraits[nameNumber % twinFlameTraits.length];

        const meetingTime = ['During a major life transition', 'Through mutual spiritual interests', 
                           'In an unexpected place during travel', 'Through creative or artistic pursuits',
                           'During a moment of personal awakening', 'Through mutual friends or community'][lifePath % 6];

        return {
            pastLifeConnection: connectionType,
            recognitionSign: recognitionSign,
            meetingCircumstance: meetingTime,
            currentStatus: lifePath > 5 ? 'Your twin flame is spiritually awakening to find you' : 'You are preparing to meet your twin flame',
            unionTimeline: `Within ${2 + (nameNumber % 3)} years`,
            spiritualMessage: 'Twin flame unions happen when both souls are ready for divine love',
            preparationAdvice: 'Focus on self-love and spiritual growth to align with divine timing'
        };
    }

    // Relationship Karma Analysis
    analyzeRelationshipKarma(formData) {
        const yourLifePath = this.calculateLifePath(formData.yourDOB);
        const partnerLifePath = this.calculateLifePath(formData.partnerDOB);
        const yourNameNumber = this.calculateNameNumber(formData.yourName);
        const partnerNameNumber = this.calculateNameNumber(formData.partnerName);

        const compatibility = (yourLifePath + partnerLifePath + yourNameNumber + partnerNameNumber) % 100;
        
        const relationshipType = compatibility > 70 ? 'Forever Love' : 
                                compatibility > 40 ? 'Karmic Learning' : 'Soul Growth';

        const karmicLessons = [
            'Learning unconditional love and acceptance',
            'Balancing independence with togetherness',
            'Healing past life wounds through forgiveness',
            'Developing patience and understanding',
            'Learning to communicate from the heart',
            'Balancing material and spiritual values',
            'Supporting each other\'s individual growth',
            'Creating harmony despite differences'
        ];

        const pastLifeConnection = [
            'Siblings who supported each other through hardships',
            'Teacher and student in ancient mystery schools',
            'Star-crossed lovers reunited in this lifetime',
            'Business partners who built something meaningful',
            'Parent and child with unfinished emotional healing',
            'Spiritual companions on a sacred journey',
            'Warriors who fought together for a noble cause',
            'Healers who served their community together'
        ];

        const lesson = karmicLessons[compatibility % karmicLessons.length];
        const pastConnection = pastLifeConnection[yourLifePath % pastLifeConnection.length];

        return {
            relationshipType: relationshipType,
            compatibilityScore: compatibility,
            karmicLesson: lesson,
            pastLifeConnection: pastConnection,
            growthPotential: compatibility > 50 ? 'High - Both souls will evolve together' : 'Moderate - Focus on individual growth first',
            challengeArea: 'Communication and emotional expression',
            strengthArea: 'Spiritual connection and mutual support',
            futureAdvice: relationshipType === 'Forever Love' ? 
                'Nurture this divine connection with gratitude' :
                'Embrace the lessons this relationship brings'
        };
    }

    // Helper methods
    generateNameVariations(name, targetNumber) {
        const variations = [];
        const baseName = name.split(' ')[0];
        
        // Add common suffixes/prefixes to reach target number
        const modifiers = ['Sri', 'Shree', 'Om', 'Kumar', 'Kumari', 'Dev', 'Devi'];
        
        for (let modifier of modifiers) {
            const newName = modifier + ' ' + name;
            if (this.calculateNameNumber(newName) === targetNumber) {
                variations.push(newName);
            }
        }
        
        return variations.length > 0 ? variations.slice(0, 3) : [name];
    }

    generateBusinessNameLuck(name, lifePath) {
        const luckyBusiness = ['Technology', 'Healing/Healthcare', 'Education', 'Arts/Entertainment', 
                              'Finance', 'Travel', 'Food/Hospitality', 'Spiritual Services'][lifePath % 8];
        return `Best business field: ${luckyBusiness}`;
    }

    generatePersonalizedMessage(name, era) {
        const firstName = name.split(' ')[0];
        return `${firstName}, your soul carries the ancient wisdom of ${era}. Trust your intuitive gifts and embrace your spiritual journey.`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MysticalEngine;
}