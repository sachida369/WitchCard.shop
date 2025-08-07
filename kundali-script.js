
// kundali-script.js

const API_URL = 'https://witchcard-shop.vercel.app/api/kundli';

class KundaliGenerator {
    constructor() {
        this.kundaliData = null;
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('generateKundali').addEventListener('click', () => {
            this.processPayment();
        });
    }

    getFormData() {
        const name = document.getElementById('fullName').value.trim();
        const dob = document.getElementById('dateOfBirth').value;
        const timeUnknown = document.getElementById('timeUnknown').checked;
        const time = timeUnknown ? '12:00' : document.getElementById('timeOfBirth').value;
        const place = document.getElementById('placeOfBirth').value.trim();
        const lat = document.getElementById('coordinates').dataset.lat;
        const lng = document.getElementById('coordinates').dataset.lng;

        return { name, dob, time, place, lat, lng, timeUnknown };
    }

    async processPayment() {
        const formData = this.getFormData();

        const options = {
            key: 'rzp_live_Hd6RirzluzFacK',
            amount: 5000,
            currency: 'INR',
            name: 'WitchCard Kundali',
            description: 'Generate Vedic Birth Chart',
            handler: async (response) => {
                console.log('Payment Success:', response);
                await this.generateKundali(formData);
            },
            prefill: {
                name: formData.name
            },
            theme: {
                color: '#6c5ce7'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    async generateKundali(formData) {
        try {
            const loading = document.getElementById('loadingSpinner');
            loading.style.display = 'block';

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.name,
                    dateOfBirth: formData.dob,
                    timeOfBirth: formData.time,
                    placeOfBirth: formData.place,
                    lat: formData.lat,
                    lng: formData.lng,
                    isTimeUnknown: formData.timeUnknown
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            this.kundaliData = data;
            this.showResults();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    showResults() {
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('kundaliResult').innerText = JSON.stringify(this.kundaliData, null, 2);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new KundaliGenerator();
});
