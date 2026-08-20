// --- 1. Background Particle System (Glowing dots) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Using theme colors randomly
        const colors = ['#FED24F', '#FFF449', '#B2D959', '#7EC151'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    const particleCount = (window.innerWidth < 768) ? 40 : 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw connecting lines
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(178, 217, 89, ${0.15 - distance/800})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

// --- 2. Scroll Interaction ---
const scrollBtn = document.querySelector('.scroll-indicator');
scrollBtn.addEventListener('click', () => {
    document.getElementById('prediction-section').scrollIntoView({ behavior: 'smooth' });
});


// --- 3. API Integration & Form Handling ---
const form = document.getElementById('prediction-form');
const loader = document.getElementById('loader');
const gaugeFill = document.getElementById('gauge-fill');
const scoreValue = document.getElementById('score-value');
const meterStatus = document.getElementById('meter-status');
const errorMsg = document.getElementById('error-message');

const API_BASE_URL = 'https://mental-health-score-predictor-app-s92j.onrender.com';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset UI
    errorMsg.textContent = "";
    gaugeFill.style.strokeDashoffset = 251.2;
    scoreValue.textContent = "--";
    meterStatus.textContent = "Processing Data...";
    loader.classList.add('active');

    // Collect and typecast data according to Pydantic requirements
    const payload = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value,
        academic_level: document.getElementById('academic_level').value,
        most_used_platform: document.getElementById('most_used_platform').value,
        purpose_of_use: document.getElementById('purpose_of_use').value,
        avg_daily_usage_hours: parseFloat(document.getElementById('avg_daily_usage_hours').value),
        daily_unlocks: parseInt(document.getElementById('daily_unlocks').value),
        study_hours: parseFloat(document.getElementById('study_hours').value),
        physical_activity_hours: parseFloat(document.getElementById('physical_activity_hours').value),
        sleep_hours_per_night: parseFloat(document.getElementById('sleep_hours_per_night').value),
        stress_level: document.getElementById('stress_level').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.detail) {
                console.error("Validation Error:", data.detail);
                throw new Error("Validation Error: Please check your inputs.");
            }
            throw new Error(data.message || "Server Error Occurred");
        }

        updateMeter(data.predicted_mental_health_score);

    } catch (error) {
        console.error('API Error:', error);
        errorMsg.textContent = error.message === "Failed to fetch" 
            ? "Cannot connect to server. Ensure FastAPI is running on http://127.0.0.1:8000" 
            : error.message;
        meterStatus.textContent = "Analysis Failed.";
    } finally {
        loader.classList.remove('active');
    }
});


// --- 4. Meter Animation ---
function updateMeter(score) {
    const circumference = 251.2; 
    const maxScore = 100;
    
    const safeScore = Math.min(Math.max(score, 0), maxScore);
    const fraction = safeScore / maxScore;
    const offset = circumference - (fraction * circumference);
    
    gaugeFill.style.strokeDashoffset = offset;
    
    animateValue(scoreValue, 0, safeScore, 1500);
    
    if (safeScore < 40) {
        meterStatus.textContent = "Optimal Neural State";
        meterStatus.style.color = "var(--col-green)";
    } else if (safeScore < 75) {
        meterStatus.textContent = "Elevated Cognitive Load";
        meterStatus.style.color = "var(--col-yellow)";
    } else {
        meterStatus.textContent = "Critical Stress Detected";
        meterStatus.style.color = "var(--col-gold)";
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (progress * (end - start) + start).toFixed(2);
        
        obj.innerHTML = currentVal;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toFixed(2);
        }
    };
    window.requestAnimationFrame(step);
}