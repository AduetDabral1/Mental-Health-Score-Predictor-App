// ========================================
// CONFIGURATION
// ========================================

const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINT = `${API_BASE_URL}/predict`;

// Score interpretation ranges
const SCORE_RANGES = {
    excellent: { min: 80, max: 100, label: 'Excellent', color: '#7fb3a0' },
    good: { min: 60, max: 79, label: 'Good', color: '#a8d5ba' },
    fair: { min: 40, max: 59, label: 'Fair', color: '#ff8787' },
    poor: { min: 0, max: 39, label: 'Needs Attention', color: '#ff6b6b' }
};

const WELLNESS_TIPS = {
    sleep: [
        'Try to maintain a consistent sleep schedule, going to bed and waking up at the same time daily.',
        'Create a relaxing bedtime routine to help your mind wind down.',
        'Aim for 7-9 hours of quality sleep each night for optimal health.'
    ],
    activity: [
        'Increase physical activity gradually - even 30 minutes of walking daily helps.',
        'Mix cardio with strength training for comprehensive fitness benefits.',
        'Find activities you enjoy to make exercise a sustainable habit.'
    ],
    stress: [
        'Practice mindfulness meditation for 10-15 minutes daily.',
        'Take regular breaks from your devices and social media.',
        'Connect with friends and family for emotional support.'
    ],
    study: [
        'Use the Pomodoro technique: 25 minutes focused work, 5 minutes break.',
        'Create a dedicated study space free from distractions.',
        'Balance academic work with leisure time.'
    ],
    usage: [
        'Set daily limits on social media and phone usage.',
        'Use apps that monitor and remind you of screen time.',
        'Replace some screen time with offline activities you enjoy.'
    ]
};

// ========================================
// DOM ELEMENTS
// ========================================

const form = document.getElementById('predictionForm');
const loadingModal = document.getElementById('loadingModal');
const resultModal = document.getElementById('resultModal');
const formError = document.getElementById('formError');
const canvas = document.getElementById('particleCanvas');

// ========================================
// PARTICLE ANIMATION
// ========================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.init();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                color: this.getRandomColor()
            });
        }
        this.animate();
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#ff8787', '#7fb3a0', '#a8d5ba', '#f5e6d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 5, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
const particleSystem = new ParticleSystem(canvas);

// ========================================
// SVG GRADIENTS
// ========================================

function addSVGGradients() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const face = document.querySelector('.humanoid-face');
    
    // Check if defs already exists
    if (face.querySelector('defs')) return;

    const defs = document.createElementNS(svgNS, 'defs');

    // Head gradient
    const headGradient = document.createElementNS(svgNS, 'radialGradient');
    headGradient.setAttribute('id', 'headGradient');
    headGradient.setAttribute('cx', '40%');
    headGradient.setAttribute('cy', '40%');
    
    let stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ff8787');
    stop1.setAttribute('stop-opacity', '0.8');
    
    let stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#7fb3a0');
    stop2.setAttribute('stop-opacity', '0.6');
    
    headGradient.appendChild(stop1);
    headGradient.appendChild(stop2);
    defs.appendChild(headGradient);

    // Aura gradient
    const auraGradient = document.createElementNS(svgNS, 'linearGradient');
    auraGradient.setAttribute('id', 'auraGradient');
    auraGradient.setAttribute('x1', '0%');
    auraGradient.setAttribute('y1', '0%');
    auraGradient.setAttribute('x2', '100%');
    auraGradient.setAttribute('y2', '100%');
    
    let auraStop1 = document.createElementNS(svgNS, 'stop');
    auraStop1.setAttribute('offset', '0%');
    auraStop1.setAttribute('stop-color', '#ff6b6b');
    
    let auraStop2 = document.createElementNS(svgNS, 'stop');
    auraStop2.setAttribute('offset', '50%');
    auraStop2.setAttribute('stop-color', '#7fb3a0');
    
    let auraStop3 = document.createElementNS(svgNS, 'stop');
    auraStop3.setAttribute('offset', '100%');
    auraStop3.setAttribute('stop-color', '#f5e6d3');
    
    auraGradient.appendChild(auraStop1);
    auraGradient.appendChild(auraStop2);
    auraGradient.appendChild(auraStop3);
    defs.appendChild(auraGradient);

    face.insertBefore(defs, face.firstChild);
}

// ========================================
// FORM HANDLING
// ========================================

function getFormData() {
    const formData = new FormData(form);
    const data = {
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        country: formData.get('country'),
        academic_level: formData.get('academic_level'),
        most_used_platform: formData.get('most_used_platform'),
        purpose_of_use: formData.get('purpose_of_use'),
        avg_daily_usage_hours: parseFloat(formData.get('avg_daily_usage_hours')),
        daily_unlocks: parseInt(formData.get('daily_unlocks')),
        study_hours: parseFloat(formData.get('study_hours')),
        physical_activity_hours: parseFloat(formData.get('physical_activity_hours')),
        sleep_hours_per_night: parseFloat(formData.get('sleep_hours_per_night')),
        stress_level: formData.get('stress_level')
    };
    return data;
}

function validateForm() {
    const errors = {};
    const formInputs = form.querySelectorAll('input, select');
    let isValid = true;

    formInputs.forEach(input => {
        const errorSpan = input.parentElement.querySelector('.error-text');
        
        if (!input.value) {
            errors[input.name] = 'This field is required';
            if (errorSpan) errorSpan.textContent = 'This field is required';
            isValid = false;
        } else {
            if (errorSpan) errorSpan.textContent = '';
        }
    });

    return isValid;
}

function showError(message) {
    formError.textContent = message;
    formError.classList.add('show');
    setTimeout(() => {
        formError.classList.remove('show');
    }, 5000);
}

// ========================================
// API COMMUNICATION
// ========================================

async function sendPredictionRequest(data) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        const result = await response.json();
        return result.predicted_mental_health_score;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========================================
// RESULT INTERPRETATION
// ========================================

function getScoreInterpretation(score) {
    let range;
    if (score >= SCORE_RANGES.excellent.min) {
        range = SCORE_RANGES.excellent;
    } else if (score >= SCORE_RANGES.good.min) {
        range = SCORE_RANGES.good;
    } else if (score >= SCORE_RANGES.fair.min) {
        range = SCORE_RANGES.fair;
    } else {
        range = SCORE_RANGES.poor;
    }

    const interpretations = {
        excellent: "Your mental health profile shows excellent well-being. You're managing your lifestyle factors exceptionally well. Keep up the great habits!",
        good: "Your mental health is in good shape. There's room for minor improvements in some areas, but overall you're doing well.",
        fair: "Your mental health shows some areas that could use attention. Consider making adjustments to your daily routines.",
        poor: "Your mental health requires attention. Focus on making gradual improvements to your sleep, stress management, and daily activities."
    };

    return {
        score: range,
        interpretation: interpretations[range.label.toLowerCase()]
    };
}

function generateWellnessTips(score, formData) {
    const tips = [];

    // Sleep recommendation
    if (formData.sleep_hours_per_night < 7) {
        tips.push(...WELLNESS_TIPS.sleep);
    }

    // Activity recommendation
    if (formData.physical_activity_hours < 1) {
        tips.push(...WELLNESS_TIPS.activity);
    }

    // Stress recommendation
    if (formData.stress_level === 'High' || formData.stress_level === 'Very High') {
        tips.push(...WELLNESS_TIPS.stress);
    }

    // Study recommendation
    if (formData.study_hours < 1) {
        tips.push(...WELLNESS_TIPS.study);
    }

    // Usage recommendation
    if (formData.avg_daily_usage_hours > 6) {
        tips.push(...WELLNESS_TIPS.usage);
    }

    // Return unique tips (max 5)
    return [...new Set(tips)].slice(0, 5);
}

// ========================================
// UI UPDATES
// ========================================

function showLoadingModal() {
    loadingModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function hideLoadingModal() {
    loadingModal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

function displayResult(score, formData) {
    const interpretation = getScoreInterpretation(score);
    const tips = generateWellnessTips(score, formData);
    
    // Update score display
    const scoreValue = document.getElementById('scoreValue');
    const scoreFill = document.getElementById('scoreFill');
    const scoreInterpretation = document.getElementById('scoreInterpretation');
    const tipsList = document.getElementById('tipslist');

    scoreValue.textContent = score.toFixed(2);
    
    // Normalize score to 100 for percentage
    const percentage = (score / 100) * 100;
    scoreFill.style.setProperty('--score-percentage', `${Math.min(percentage, 100)}%`);

    // Set interpretation
    scoreInterpretation.innerHTML = `
        <p><strong style="color: ${interpretation.score.color};">${interpretation.score.label}</strong></p>
        <p>${interpretation.interpretation}</p>
    `;

    // Set tips
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');

    // Show modal
    resultModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

// ========================================
// EVENT HANDLERS
// ========================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    formError.classList.remove('show');

    // Validate form
    if (!validateForm()) {
        showError('Please fill in all required fields.');
        return;
    }

    try {
        const formData = getFormData();
        
        // Show loading modal
        showLoadingModal();

        // Send request
        const score = await sendPredictionRequest(formData);

        // Hide loading modal
        hideLoadingModal();

        // Display result
        displayResult(score, formData);
    } catch (error) {
        hideLoadingModal();
        console.error('Error:', error);
        showError(`Error: ${error.message || 'Failed to analyze mental health profile. Please try again.'}`);
    }
});

// Close result modal
window.closeResult = function() {
    resultModal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
};

// Reset form
window.resetForm = function() {
    form.reset();
    closeResult();
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    addSVGGradients();
    
    // Add smooth input animations
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });
});

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

// Handle Escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!loadingModal.classList.contains('hidden')) {
            hideLoadingModal();
        }
        if (!resultModal.classList.contains('hidden')) {
            closeResult();
        }
    }
});

// Click outside modal to close
resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        closeResult();
    }
});
