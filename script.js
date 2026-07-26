theconst SUPABASE_URL = 'https://rxwtjoibzaskkmxintzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3Rqb2liemFza2tteGludHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMTkyNTcsImV4cCI6MjEwMDU5NTI1N30.el-h7Hg9oqfIvTadVJCa_X-myTDNVqgV9YfMceB4edo';

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');
const submitButton = waitlistForm.querySelector('button[type="submit"]');

waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    try {
        const response = await fetch(SUPABASE_URL + '/rest/v1/waitlist', {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ email: email, source: 'landing_page' })
        });
        if (response.ok) {
            showMessage('You are on the list! Welcome to the future.', 'success');
            emailInput.value = '';
        } else if (response.status === 409) {
            showMessage('This email is already on the waitlist!', 'error');
        } else {
            showMessage('Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        showMessage('Network error. Check your connection.', 'error');
    }
    submitButton.disabled = false;
    submitButton.textContent = 'Get Early Access';
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.color = type === 'success' ? '#00ffc8' : '#ff4757';
    formMessage.style.fontWeight = '600';
    setTimeout(() => {
        formMessage.textContent = 'We respect your privacy. No spam, ever.';
        formMessage.style.color = '#a0a0b0';
        formMessage.style.fontWeight = 'normal';
    }, 5000);
}

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
});

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('AegisForge AI - Building the future.');

// FAQ Toggle Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Small delay for smooth experience
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }
});

// ============================================
// COUNTDOWN TIMER
// ============================================

// Set your launch date here (Year, Month-1, Day, Hour, Minute, Second)
// Currently set to: April 1, 2025 at 12:00:00 (adjust as needed)
const launchDate = new Date('2025-04-01T12:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    // Get elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // If launch date passed
    if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        
        // Update countdown label
        const countdownLabel = document.querySelector('.countdown-label');
        if (countdownLabel) {
            countdownLabel.textContent = '🎉 WE ARE LIVE!';
        }
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM with padded zeros
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
if (document.getElementById('days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// COOKIE CONSENT BANNER
// ============================================
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');

if (cookieBanner && acceptCookiesBtn) {
    // Check if user already accepted cookies
    const cookiesAccepted = localStorage.getItem('aegisforge_cookies_accepted');
    
    if (!cookiesAccepted) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    } else {
        // Hide banner if already accepted
        cookieBanner.classList.add('hidden');
    }
    
    // Handle accept button click
    acceptCookiesBtn.addEventListener('click', function() {
        // Save preference to localStorage
        localStorage.setItem('aegisforge_cookies_accepted', 'true');
        localStorage.setItem('aegisforge_cookies_accepted_date', new Date().toISOString());
        
        // Hide banner with animation
        cookieBanner.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            cookieBanner.classList.add('hidden');
        }, 500);
        
        console.log('✅ Cookies accepted');
    });
}

// ============================================
// KEYBOARD SHORTCUTS (BONUS)
// ============================================
document.addEventListener('keydown', function(e) {
    // Press "T" to go to top
    if (e.key === 't' || e.key === 'T') {
        // Only if not typing in an input
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Press "W" to jump to waitlist
    if (e.key === 'w' || e.key === 'W') {
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            const waitlist = document.getElementById('waitlist');
            if (waitlist) {
                waitlist.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// ============================================
// PERFORMANCE MONITORING (BONUS)
// ============================================
window.addEventListener('load', function() {
    // Log page load time
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ AegisForge AI loaded in ${pageLoadTime}ms`);
    }
});

// ============================================
// SMART ANIMATIONS ON SCROLL
// ============================================
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animateOnScroll.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply to various sections
document.querySelectorAll('.step-card, .module-card, .value-item, .contact-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// ============================================
// EASTER EGG - Console Message
// ============================================
console.log('%c⚡ AEGISFORGE AI', 'font-size: 40px; font-weight: bold; background: linear-gradient(135deg, #00ffc8, #00a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 20px;');
console.log('%c🔥 Building the future of secure software', 'font-size: 16px; color: #00ffc8; font-weight: 600;');
console.log('%c💚 Made with passion for founders everywhere', 'font-size: 14px; color: #a855f7; font-style: italic;');
console.log('%c🚀 Interested in joining our team? Reach out: goldstarpalms@gmail.com', 'font-size: 12px; color: #a0a0b0;');
console.log('%c⌨️ Keyboard shortcuts: T = Top | W = Waitlist', 'font-size: 12px; color: #808090;');

// ============================================
// FORM ENHANCEMENT
// ============================================
const emailInputField = document.getElementById('emailInput');
if (emailInputField) {
    // Add real-time email validation feedback
    emailInputField.addEventListener('input', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length > 0) {
            if (emailRegex.test(email)) {
                this.style.borderColor = 'rgba(0, 255, 200, 0.6)';
                this.style.boxShadow = '0 0 20px rgba(0, 255, 200, 0.1)';
            } else {
                this.style.borderColor = 'rgba(255, 71, 87, 0.4)';
                this.style.boxShadow = 'none';
            }
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            this.style.boxShadow = 'none';
        }
    });
}

// ============================================
// ANNOUNCE TO SCREEN READERS
// ============================================
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ============================================
// INITIALIZATION LOG
// ============================================
console.log('✅ AegisForge AI landing page fully initialized');
console.log('📊 All features loaded successfully');

// ============================================
// SCANNER API INTEGRATION
// ============================================

// Backend API URL
const BACKEND_API_URL = 'https://aegisforge-backend.onrender.com';

// Get scanner elements
const scannerForm = document.getElementById('scannerForm');
const scannerUrl = document.getElementById('scannerUrl');
const scanButton = document.getElementById('scanButton');
const scanProgress = document.getElementById('scanProgress');
const scanStatus = document.getElementById('scanStatus');
const scanPercentage = document.getElementById('scanPercentage');
const scanProgressFill = document.getElementById('scanProgressFill');
const scanResults = document.getElementById('scanResults');
const scanSteps = document.querySelectorAll('.scan-step');

// Scan steps for progress display
const scanStepsList = [
    { id: 'ssl', name: 'Checking SSL Certificate', percent: 15 },
    { id: 'headers', name: 'Analyzing Security Headers', percent: 30 },
    { id: 'tech', name: 'Detecting Technology Stack', percent: 50 },
    { id: 'cookies', name: 'Analyzing Cookies', percent: 65 },
    { id: 'cdn', name: 'Checking CDN & Infrastructure', percent: 80 },
    { id: 'performance', name: 'Measuring Performance', percent: 95 }
];

// Handle scanner form submission
if (scannerForm) {
    scannerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await performScan();
    });
}

async function performScan() {
    const url = scannerUrl.value.trim();
    
    if (!url) {
        showScanError('Please enter a valid URL');
        return;
    }
    
    // Reset UI
    scanResults.classList.remove('active');
    scanResults.innerHTML = '';
    scanProgress.classList.add('active');
    scanButton.classList.add('loading');
    scanButton.disabled = true;
    scannerUrl.disabled = true;
    
    // Reset progress
    scanProgressFill.style.width = '0%';
    scanPercentage.textContent = '0%';
    scanStatus.textContent = 'Initializing scan...';
    
    // Reset all steps
    scanSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Animate progress steps
    let currentStep = 0;
    const stepInterval = setInterval(() => {
        if (currentStep < scanStepsList.length) {
            const step = scanStepsList[currentStep];
            
            // Mark previous as completed
            if (currentStep > 0) {
                const prevStepEl = document.querySelector(`.scan-step[data-step="${scanStepsList[currentStep - 1].id}"]`);
                if (prevStepEl) {
                    prevStepEl.classList.remove('active');
                    prevStepEl.classList.add('completed');
                }
            }
            
            // Mark current as active
            const currentStepEl = document.querySelector(`.scan-step[data-step="${step.id}"]`);
            if (currentStepEl) {
                currentStepEl.classList.add('active');
            }
            
            scanStatus.textContent = step.name;
            scanPercentage.textContent = step.percent + '%';
            scanProgressFill.style.width = step.percent + '%';
            
            currentStep++;
        }
    }, 800);
    
    try {
        // Call the backend API
        const response = await fetch(`${BACKEND_API_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        // Clear step interval
        clearInterval(stepInterval);
        
        // Complete all steps
        scanSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Complete progress
        scanStatus.textContent = 'Scan complete!';
        scanPercentage.textContent = '100%';
        scanProgressFill.style.width = '100%';
        
        // Wait a moment then display results
        setTimeout(() => {
            displayScanResults(data);
            scanProgress.classList.remove('active');
            scanButton.classList.remove('loading');
            scanButton.disabled = false;
            scannerUrl.disabled = false;
        }, 1000);
        
    } catch (error) {
        clearInterval(stepInterval);
        console.error('Scan error:', error);
        
        scanProgress.classList.remove('active');
        scanButton.classList.remove('loading');
        scanButton.disabled = false;
        scannerUrl.disabled = false;
        
        showScanError(
            'Scan failed. This can happen if the website is unreachable or blocking scans. Please try another URL or wait a moment and try again.'
        );
    }
}

function showScanError(message) {
    scanResults.innerHTML = `
        <div class="scan-error">
            <strong>⚠️ Scan Error</strong>
            ${message}
        </div>
    `;
    scanResults.classList.add('active');
}

function displayScanResults(data) {
    const riskScore = data.risk_score || {};
    const checks = data.checks || {};
    const recommendations = data.recommendations || [];
    
    const grade = (riskScore.grade || 'F').toLowerCase();
    const score = riskScore.score || 0;
    
    let html = `
        <!-- Overall Score -->
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
            <div class="scanned-url">🌐 ${data.url}</div>
        </div>
        
        <!-- Category Results -->
        <div class="results-categories">
            ${generateCategoryCards(checks)}
        </div>
    `;
    
    // Add recommendations if any
    if (recommendations && recommendations.length > 0) {
        html += `
            <div class="recommendations-section">
                <div class="recommendations-header">
                    <div class="recommendations-title">
                        🎯 AI Recommendations
                    </div>
                    <div class="recommendations-count">${recommendations.length} issue${recommendations.length !== 1 ? 's' : ''}</div>
                </div>
                ${recommendations.map(rec => generateRecommendationCard(rec)).join('')}
            </div>
        `;
    }
    
    // Add detailed results (collapsible)
    html += `
        <div class="detailed-results">
            <button class="detailed-toggle" onclick="toggleDetailedResults(this)">
                <span>📊 View Detailed Technical Results</span>
                <span class="detailed-toggle-icon">▼</span>
            </button>
            <div class="detailed-content">
                ${generateDetailedResults(checks)}
            </div>
        </div>
        
        <!-- Call to Action -->
        <div class="results-actions">
            <div class="results-cta-text">
                <strong>💚 Love this scanner?</strong> Join our waitlist to save reports, get monthly re-scans, and access advanced features!
            </div>
            <a href="#waitlist" class="results-btn primary">
                🚀 Join Waitlist
            </a>
            <button onclick="resetScanner()" class="results-btn secondary">
                🔄 Scan Another Site
            </button>
        </div>
    `;
    
    scanResults.innerHTML = html;
    scanResults.classList.add('active');
    
    // Smooth scroll to results
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
        
        if (cat.key === 'cookies') {
            score = check.security_score || 0;
        }
        
        if (score === undefined) score = 0;
        
        let scoreClass = 'low';
        let status = 'Poor';
        
        if (score >= 80) {
            scoreClass = 'high';
            status = 'Great';
        } else if (score >= 60) {
            scoreClass = 'medium';
            status = 'Fair';
        }
        
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
                <div>
                    <div class="recommendation-category">${rec.category || 'General'}</div>
                </div>
                <div class="recommendation-priority ${priority}">${rec.priority || 'low'}</div>
            </div>
            <div class="recommendation-issue">${rec.issue || 'Issue detected'}</div>
            <div class="recommendation-fix">${rec.fix || 'Review and address this issue'}</div>
        </div>
    `;
}

function generateDetailedResults(checks) {
    let html = '';
    
    for (const [key, check] of Object.entries(checks)) {
        if (!check || typeof check !== 'object') continue;
        
        const displayName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        html += `
            <div class="detail-check">
                <div class="detail-check-header">
                    <div class="detail-check-title">${displayName}</div>
                    <div class="detail-check-score">Score: ${check.score || 'N/A'}/100</div>
                </div>
                <div class="detail-data">
                    ${generateDetailItems(check)}
                </div>
            </div>
        `;
    }
    
    return html;
}

function generateDetailItems(data) {
    let html = '';
    
    for (const [key, value] of Object.entries(data)) {
        if (key === 'score' || key === 'error') continue;
        
        let displayValue = value;
        let valueClass = '';
        
        if (typeof value === 'boolean') {
            displayValue = value ? '✓ Yes' : '✗ No';
            valueClass = value ? 'success' : 'danger';
        } else if (Array.isArray(value)) {
            if (value.length === 0) {
                displayValue = 'None';
            } else if (typeof value[0] === 'string') {
                displayValue = value.slice(0, 5).join(', ');
                if (value.length > 5) displayValue += ` (+${value.length - 5} more)`;
            } else {
                displayValue = `${value.length} items`;
            }
        } else if (typeof value === 'object' && value !== null) {
            const entries = Object.entries(value);
            if (entries.length === 0) {
                displayValue = 'None';
            } else {
                displayValue = entries.slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ');
            }
        } else if (typeof value === 'number') {
            displayValue = value;
            if (key.includes('score')) {
                valueClass = value >= 80 ? 'success' : value >= 60 ? 'warning' : 'danger';
            }
        } else if (typeof value === 'string') {
            if (value.length > 60) {
                displayValue = value.substring(0, 60) + '...';
            }
        }
        
        const displayKey = key.replace(/_/g, ' ');
        
        html += `
            <div class="detail-item">
                <span class="detail-key">${displayKey}</span>
                <span class="detail-value ${valueClass}">${displayValue}</span>
            </div>
        `;
    }
    
    return html;
}

function toggleDetailedResults(button) {
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    content.classList.toggle('active');
}

function resetScanner() {
    scannerUrl.value = '';
    scanResults.classList.remove('active');
    scanResults.innerHTML = '';
    scannerUrl.focus();
    
    // Scroll back to scanner
    document.getElementById('scanner').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add example URL suggestion on focus
if (scannerUrl) {
    scannerUrl.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'e.g., github.com, wikipedia.org, your-website.com';
        }
    });
}

console.log('%c⚡ AegisForge AI Scanner Ready!', 'font-size: 20px; font-weight: bold; color: #00ffc8;');
console.log('%c🛡️ Enter any URL to see enterprise-grade security analysis', 'font-size: 14px; color: #a0a0b0;');
