// EMERGENCY LOADER FIX
setTimeout(function() {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) {
        loaderEl.style.display = 'none';
    }
}, 2000);

// Supabase Configuration
const SUPABASE_URL = 'https://rxwtjoibzaskkmxintzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3Rqb2liemFza2tteGludHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMTkyNTcsImV4cCI6MjEwMDU5NTI1N30.el-h7Hg9oqfIvTadVJCa_X-myTDNVqgV9YfMceB4edo';

// Backend API URL
const BACKEND_API_URL = 'https://aegisforge-backend.onrender.com';

// ============================================
// WAITLIST FORM - Rebuilt from Scratch
// ============================================
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('emailInput');
        const formMessage = document.getElementById('formMessage');
        const email = emailInput.value.trim();
        
        if (!email) return;

        formMessage.textContent = 'Sending...';
        formMessage.style.color = '#888';

        fetch('https://aegisforge-backend.onrender.com/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(function(response) {
            if (response.ok) {
                formMessage.innerHTML = '🎉 Success! Check your email for the welcome message.';
                formMessage.style.color = '#00ffc8';
                emailInput.value = '';
            } else {
                formMessage.textContent = 'Failed to send. Please try again.';
                formMessage.style.color = '#ef4444';
            }
        })
        .catch(function() {
            formMessage.textContent = 'Connection error. Please try again.';
            formMessage.style.color = '#ef4444';
        });
    });
}

// ============================================
// SCANNER
// ============================================
const scannerForm = document.getElementById('scannerForm');
const scannerUrl = document.getElementById('scannerUrl');
const scanButton = document.getElementById('scanButton');
const scanProgress = document.getElementById('scanProgress');
const scanStatus = document.getElementById('scanStatus');
const scanPercentage = document.getElementById('scanPercentage');
const scanProgressFill = document.getElementById('scanProgressFill');
const scanResults = document.getElementById('scanResults');

if (scannerForm) {
    scannerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        await performScan();
        return false;
    });
}

async function performScan() {
    const url = scannerUrl.value.trim();
    
    if (!url) {
        showScanError('Please enter a valid URL');
        return;
    }
    
    scanResults.classList.remove('active');
    scanResults.innerHTML = '';
    scanProgress.classList.add('active');
    scanButton.classList.add('loading');
    scanButton.disabled = true;
    scannerUrl.disabled = true;
    
    scanProgressFill.style.width = '10%';
    scanPercentage.textContent = '10%';
    scanStatus.textContent = 'Starting scanner (may take 30-60s first time)...';
    
    let progress = 10;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 2;
            scanProgressFill.style.width = progress + '%';
            scanPercentage.textContent = progress + '%';
            
            if (progress < 30) {
                scanStatus.textContent = 'Checking SSL certificate...';
            } else if (progress < 50) {
                scanStatus.textContent = 'Analyzing security headers...';
            } else if (progress < 70) {
                scanStatus.textContent = 'Detecting technology stack...';
            } else if (progress < 90) {
                scanStatus.textContent = 'Analyzing performance...';
            }
        }
    }, 500);
    
    try {
        const response = await fetch(`${BACKEND_API_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        scanProgressFill.style.width = '100%';
        scanPercentage.textContent = '100%';
        scanStatus.textContent = 'Scan complete!';
        
        setTimeout(() => {
            displayScanResults(data);
            scanProgress.classList.remove('active');
            scanButton.classList.remove('loading');
            scanButton.disabled = false;
            scannerUrl.disabled = false;
        }, 800);
        
    } catch (error) {
        clearInterval(progressInterval);
        console.error('Scan error:', error);
        
        scanProgress.classList.remove('active');
        scanButton.classList.remove('loading');
        scanButton.disabled = false;
        scannerUrl.disabled = false;
        
        showScanError('Scanner starting up. Please wait 30 seconds and try again.');
    }
}

function showScanError(message) {
    scanResults.innerHTML = `<div style="padding:20px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;color:#fca5a5;text-align:center;"><strong style="color:#ef4444;display:block;margin-bottom:5px;">Notice</strong>${message}</div>`;
    scanResults.classList.add('active');
}

function displayScanResults(data) {
    const riskScore = data.risk_score || {};
    const checks = data.checks || {};
    const recommendations = data.recommendations || [];
    
    const grade = (riskScore.grade || 'F').toLowerCase();
    const score = riskScore.score || 0;
    
    let html = `
        <div class="results-score-container">
            <div class="score-circle-wrapper">
                <div class="score-circle grade-${grade}">
                    <div>
                        <div class="score-number">${score}</div>
                        <div class="score-max">/100</div>
                    </div>
                </div>
            </div>
            <div class="grade-badge grade-${grade}">${(riskScore.grade || 'F').toUpperCase()}</div>
            <div class="score-status">${riskScore.status || 'Unknown'}</div>
            <p class="score-summary">${riskScore.summary || 'Analysis complete'}</p>
            <div class="scanned-url">${data.url}</div>
        </div>
        <div class="results-categories">
            ${generateCategoryCards(checks)}
        </div>
    `;
    
    if (recommendations && recommendations.length > 0) {
        html += `
            <div class="recommendations-section">
                <div class="recommendations-header">
                    <div class="recommendations-title">🎯 AI Recommendations</div>
                    <div class="recommendations-count">${recommendations.length} issue${recommendations.length !== 1 ? 's' : ''}</div>
                </div>
                ${recommendations.map(rec => generateRecommendationCard(rec)).join('')}
            </div>
        `;
    }
    
    html += `
        <div class="results-actions">
            <div class="results-cta-text"><strong>💚 Love this scanner?</strong> Join our waitlist!</div>
            <a href="#waitlist" class="results-btn primary">🚀 Join Waitlist</a>
            <button onclick="resetScanner()" class="results-btn secondary">🔄 Scan Another</button>
        </div>
    `;
    
    scanResults.innerHTML = html;
    scanResults.classList.add('active');
    
    setTimeout(() => {
        scanResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function generateCategoryCards(checks) {
    const categories = [
        { key: 'ssl', icon: '🔒', name: 'SSL/TLS' },
        { key: 'headers', icon: '📋', name: 'Headers' },
        { key: 'reachability', icon: '📡', name: 'Uptime' },
        { key: 'tech_stack', icon: '🔍', name: 'Tech' },
        { key: 'cookies', icon: '🍪', name: 'Cookies' },
        { key: 'cdn', icon: '🌍', name: 'CDN' },
        { key: 'https_enforcement', icon: '🛡️', name: 'HTTPS' },
        { key: 'performance', icon: '⚡', name: 'Speed' }
    ];
    
    return categories.map(cat => {
        const check = checks[cat.key] || {};
        let score = check.score;
        if (cat.key === 'cookies') score = check.security_score || 0;
        if (score === undefined) score = 0;
        
        let scoreClass = 'low';
        let status = 'Poor';
        
        if (score >= 80) { scoreClass = 'high'; status = 'Great'; }
        else if (score >= 60) { scoreClass = 'medium'; status = 'Fair'; }
        
        return `
            <div class="category-card">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-score ${scoreClass}">${score}</div>
                <div class="category-status">${status}</div>
            </div>
        `;
    }).join('');
}

function generateRecommendationCard(rec) {
    const priority = (rec.priority || 'low').toLowerCase();
    return `
        <div class="recommendation-item ${priority}">
            <div class="recommendation-header">
                <div><div class="recommendation-category">${rec.category || 'General'}</div></div>
                <div class="recommendation-priority ${priority}">${rec.priority || 'low'}</div>
            </div>
            <div class="recommendation-issue">${rec.issue || 'Issue detected'}</div>
            <div class="recommendation-fix">${rec.fix || 'Review this issue'}</div>
        </div>
    `;
}

function resetScanner() {
    scannerUrl.value = '';
    scanResults.classList.remove('active');
    scanResults.innerHTML = '';
    document.getElementById('scanner').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
        if (!isActive) faqItem.classList.add('active');
    });
});

// Countdown Timer
function updateCountdown() {
    const launchDate = new Date('2025-06-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Back to Top
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Cookie Banner
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');

if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('show'), 2000);
}

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        setTimeout(() => cookieBanner.classList.add('hidden'), 500);
    });
}

console.log('AegisForge AI - Ready!');
