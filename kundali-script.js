
// kundali-script.js - Updated to securely call Prokerala via backend after Razorpay payment

const API_URL = 'https://witchcard-shop.vercel.app/api/kundli';

class KundaliGenerator {
    constructor() {
        this.kundaliData = null;
        this.bindEvents();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateKundali');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.processPayment();
            });
        }
    }

    getFormData() {
        const name = document.getElementById('fullName')?.value.trim();
        const dob = document.getElementById('dateOfBirth')?.value;
        const timeUnknown = document.getElementById('timeUnknown')?.checked;
        const time = timeUnknown ? '12:00' : document.getElementById('timeOfBirth')?.value;
        const place = document.getElementById('placeOfBirth')?.value.trim();
        const lat = document.getElementById('coordinates')?.dataset.lat;
        const lng = document.getElementById('coordinates')?.dataset.lng;

        return { name, dob, time, place, lat, lng, timeUnknown };
    }

    async processPayment() {
        const formData = this.getFormData();
        try {
            const orderRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ createOrderOnly: true })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

            const options = {
                key: 'rzp_live_Hd6RirzluzFacK',
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'WitchCard Kundali',
                description: 'Generate Vedic Birth Chart',
                order_id: orderData.order.id,
                handler: async (response) => {
                    console.log('Payment Success:', response);
                    await this.generateKundali(formData);
                },
                prefill: {
                    name: formData.name
                },
                theme: { color: '#6c5ce7' }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Payment initiation failed: ' + err.message);
        }
    }

    async generateKundali(formData) {
        try {
            const loading = document.getElementById('loadingSpinner');
            if (loading) loading.style.display = 'block';

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            if (!res.ok) throw new Error(data.error || 'Kundali generation failed');

            this.kundaliData = this.mapProkeralaResponse(data);
            this.showResults();
        } catch (err) {
            alert('Error generating Kundali: ' + err.message);
        } finally {
            const loading = document.getElementById('loadingSpinner');
            if (loading) loading.style.display = 'none';
        }
    }

    mapProkeralaResponse(data) {
        return {
            ascendant: data.ascendant,
            planets: data.planets,
            chart: data.chart,
            houses: data.houses
        };
    }

    showResults() {
        const resultSection = document.getElementById('resultSection');
        const kundaliResult = document.getElementById('kundaliResult');
        if (resultSection && kundaliResult) {
            resultSection.style.display = 'block';
            kundaliResult.innerText = JSON.stringify(this.kundaliData, null, 2);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new KundaliGenerator();
});
