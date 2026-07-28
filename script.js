// EMERGENCY LOADER FIX
setTimeout(function() {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) {
        loaderEl.style.display = 'none';
    }
}, 2000);

// Backend API URL
const BACKEND_API_URL = 'https://aegisforge-backend.onrender.com';
let lastScanData = null;

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char];
    });
}

function safeScore(value, fallback = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(100, Math.round(number)));
}

function safeClass(value, allowed, fallback) {
    const normalized = String(value || '').toLowerCase();
    return allowed.includes(normalized) ? normalized : fallback;
}

function formatValue(value) {
    if (value === null || value === undefined || value === '') return 'Not detected';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.length ? value.join(', ') : 'None';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
}

function scoreLabel(score) {
    const safe = safeScore(score);
    if (safe >= 80) return 'Strong';
    if (safe >= 60) return 'Needs work';
    return 'High risk';
}

function setWaitlistMessage(type, html) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    formMessage.className = `waitlist-note waitlist-message ${type || ''}`.trim();
    formMessage.innerHTML = html;
}

// ============================================
// WAITLIST FORM - Backend Resend + Supabase Version
// ============================================
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('emailInput');
        const formMessage = document.getElementById('formMessage');
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim().toLowerCase();
        
        if (!email) return;
        
        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Joining...';
            }
            setWaitlistMessage('loading', '<span class="message-icon">⏳</span><span>Adding you to the waitlist...</span>');

            const response = await fetch(`${BACKEND_API_URL}/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            
            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                const positionText = data.position ? `#${data.position}` : 'confirmed';
                const title = data.already_joined ? 'You are already in!' : 'You are in!';
                const detail = data.position
                    ? `Your founder waitlist position is <strong>${positionText}</strong>.`
                    : 'Your early access spot is confirmed.';

                setWaitlistMessage('success', `
                    <span class="message-icon">🎉</span>
                    <span><strong>${title}</strong><br>${detail}<br><small>Check your inbox for the confirmation email.</small></span>
                `);
                emailInput.value = '';
            } else {
                const errorData = await response.json().catch(() => ({}));
                setWaitlistMessage('error', `<span class="message-icon">❌</span><span>${escapeHTML(errorData.detail || 'Something went wrong. Try again.')}</span>`);
            }
        } catch (error) {
            console.error('Waitlist error:', error);
            setWaitlistMessage('error', '<span class="message-icon">❌</span><span>Connection error. Try again.</span>');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Get Early Access';
            }
        }
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
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
        
        showScanError(error.message || 'Scanner starting up. Please wait 30 seconds and try again.');
    }
}

function showScanError(message) {
    scanResults.innerHTML = `<div class="scan-error"><strong>Notice</strong>${escapeHTML(message)}</div>`;
    scanResults.classList.add('active');
}

function displayScanResults(data) {
    lastScanData = data;
    const riskScore = data.risk_score || {};
    const checks = data.checks || {};
    const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    
    const grade = safeClass(riskScore.grade, ['a', 'b', 'c', 'd', 'f'], 'f');
    const score = safeScore(riskScore.score);
    const status = escapeHTML(riskScore.status || 'Unknown');
    const summary = escapeHTML(riskScore.summary || 'Analysis complete');
    const scannedUrl = escapeHTML(data.url || 'Unknown URL');
    
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
            <div class="grade-badge grade-${grade}">${grade.toUpperCase()}</div>
            <div class="score-status">${status}</div>
            <p class="score-summary">${summary}</p>
            <div class="scanned-url">${scannedUrl}</div>
        </div>
        <div class="results-categories">
            ${generateCategoryCards(checks)}
        </div>
        ${generateDetailedResults(checks, data)}
    `;
    
    if (recommendations.length > 0) {
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
            <button onclick="downloadScanReport()" class="results-btn secondary">⬇️ Download Report</button>
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
        if (cat.key === 'cookies') score = check.security_score ?? check.score;
        score = safeScore(score);
        
        let scoreClass = 'low';
        let status = 'Poor';
        
        if (score >= 80) { scoreClass = 'high'; status = 'Great'; }
        else if (score >= 60) { scoreClass = 'medium'; status = 'Fair'; }
        
        return `
            <div class="category-card">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${escapeHTML(cat.name)}</div>
                <div class="category-score ${scoreClass}">${score}</div>
                <div class="category-status">${status}</div>
            </div>
        `;
    }).join('');
}

function generateDetailedResults(checks, data) {
    const ssl = checks.ssl || {};
    const headers = checks.headers || {};
    const reachability = checks.reachability || {};
    const tech = checks.tech_stack || {};
    const cookies = checks.cookies || {};
    const cdn = checks.cdn || {};
    const https = checks.https_enforcement || {};
    const performance = checks.performance || {};
    const missingHeaders = Array.isArray(headers.missing_headers) ? headers.missing_headers : [];
    const detectedTech = tech.detected || {};

    const detailCards = [
        {
            title: 'SSL/TLS Certificate',
            score: ssl.score,
            icon: '🔒',
            rows: [
                ['Status', ssl.status],
                ['Protocol', ssl.protocol],
                ['Issuer', ssl.issuer],
                ['Expires', ssl.expires],
                ['Days Until Expiry', ssl.days_until_expiry],
                ['Expiry Warning', ssl.expiry_warning]
            ],
            beginner: ssl.status === 'secure'
                ? 'Your site is using HTTPS encryption. That protects visitors in transit.'
                : 'Your site may not be properly protected by HTTPS. This is a critical trust and security issue.'
        },
        {
            title: 'Security Headers',
            score: headers.score,
            icon: '📋',
            rows: [
                ['Headers Present', `${headers.headers_present ?? 0}/${headers.headers_total ?? 0}`],
                ['Grade', headers.grade],
                ['Server', headers.server],
                ['Missing Headers', missingHeaders.length ? missingHeaders.join(', ') : 'None']
            ],
            beginner: missingHeaders.length
                ? 'Security headers help browsers block attacks like clickjacking, MIME sniffing, and unsafe script execution.'
                : 'Your key security headers look good from this scan.'
        },
        {
            title: 'Reachability & Uptime',
            score: reachability.score,
            icon: '📡',
            rows: [
                ['Reachable', reachability.reachable],
                ['Status Code', reachability.status_code],
                ['Response Time', reachability.response_time_ms !== undefined ? `${reachability.response_time_ms}ms` : undefined],
                ['Final URL', reachability.final_url],
                ['Content Type', reachability.content_type]
            ],
            beginner: 'Reachability confirms whether the website responds reliably and how quickly it answers.'
        },
        {
            title: 'Technology Stack',
            score: tech.score ?? null,
            icon: '🔍',
            rows: [
                ['Server', detectedTech.server],
                ['Powered By', detectedTech.powered_by],
                ['CMS', detectedTech.cms],
                ['Frameworks', detectedTech.frameworks],
                ['Libraries', detectedTech.libraries],
                ['Analytics', detectedTech.analytics]
            ],
            beginner: 'Technology detection helps reveal what your website is built with and what may need updates or hardening.'
        },
        {
            title: 'Cookies',
            score: cookies.security_score,
            icon: '🍪',
            rows: [
                ['Total Cookies', cookies.total_cookies],
                ['Secure Cookies', cookies.secure_cookies],
                ['Tracking Cookies', cookies.tracking_cookies]
            ],
            beginner: 'Secure cookies reduce the chance of session theft and improve user privacy.'
        },
        {
            title: 'CDN & HTTPS Enforcement',
            score: cdn.using_cdn ? 100 : https.score,
            icon: '🌍',
            rows: [
                ['Using CDN', cdn.using_cdn],
                ['CDNs Detected', cdn.cdns_detected],
                ['Enforces HTTPS', https.enforces_https],
                ['HTTP Status', https.http_status_code],
                ['Redirect Location', https.redirect_location]
            ],
            beginner: 'A CDN can improve speed and resilience. HTTPS enforcement ensures visitors are pushed to the secure version.'
        },
        {
            title: 'Performance',
            score: performance.score,
            icon: '⚡',
            rows: [
                ['First Load', performance.first_load_ms !== undefined ? `${performance.first_load_ms}ms` : undefined],
                ['Cached Load', performance.cached_load_ms !== undefined ? `${performance.cached_load_ms}ms` : undefined],
                ['Content Size', performance.content_size_kb !== undefined ? `${performance.content_size_kb}KB` : undefined],
                ['Grade', performance.grade]
            ],
            beginner: 'Faster pages improve trust, SEO, conversion, and user experience.'
        }
    ];

    return `
        <div class="detailed-results active">
            <button class="detailed-toggle" onclick="toggleDetailedResults(this)">
                <span>📊 Detailed Security Report</span>
                <span class="detailed-toggle-icon">⌄</span>
            </button>
            <div class="detailed-content active">
                <div class="detail-summary-strip">
                    <div><strong>Scanned URL</strong><span>${escapeHTML(data.url || 'Unknown')}</span></div>
                    <div><strong>Domain</strong><span>${escapeHTML(data.domain || 'Unknown')}</span></div>
                    <div><strong>Duration</strong><span>${escapeHTML(data.scan_duration_seconds || 'N/A')}s</span></div>
                </div>
                <div class="detail-card-grid">
                    ${detailCards.map(card => generateDetailCard(card)).join('')}
                </div>
            </div>
        </div>
    `;
}

function generateDetailCard(card) {
    const score = card.score === null || card.score === undefined ? null : safeScore(card.score);
    const scoreClass = score === null ? 'neutral' : score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return `
        <div class="detail-report-card">
            <div class="detail-report-header">
                <div><span class="detail-report-icon">${card.icon}</span><strong>${escapeHTML(card.title)}</strong></div>
                <span class="detail-score ${scoreClass}">${score === null ? 'Info' : `${score}/100`}</span>
            </div>
            <div class="detail-report-status ${scoreClass}">${score === null ? 'Informational' : scoreLabel(score)}</div>
            <div class="detail-report-rows">
                ${card.rows.map(([key, value]) => `
                    <div class="detail-report-row">
                        <span>${escapeHTML(key)}</span>
                        <strong>${escapeHTML(formatValue(value))}</strong>
                    </div>
                `).join('')}
            </div>
            <p class="detail-beginner-note">${escapeHTML(card.beginner)}</p>
        </div>
    `;
}

function toggleDetailedResults(button) {
    const content = button.parentElement.querySelector('.detailed-content');
    if (!content) return;
    const isActive = content.classList.toggle('active');
    button.classList.toggle('active', isActive);
}

function generateRecommendationCard(rec) {
    const priority = safeClass(rec.priority, ['critical', 'high', 'medium', 'low'], 'low');
    return `
        <div class="recommendation-item ${priority}">
            <div class="recommendation-header">
                <div><div class="recommendation-category">${escapeHTML(rec.category || 'General')}</div></div>
                <div class="recommendation-priority ${priority}">${priority}</div>
            </div>
            <div class="recommendation-issue">${escapeHTML(rec.issue || 'Issue detected')}</div>
            <div class="recommendation-fix">${escapeHTML(rec.fix || 'Review this issue')}</div>
        </div>
    `;
}

function formatCheckSummary(checks) {
    return Object.entries(checks || {}).map(([name, value]) => {
        const score = value && typeof value === 'object' && value.score !== undefined
            ? `Score: ${value.score}/100`
            : value && typeof value === 'object' && value.security_score !== undefined
                ? `Score: ${value.security_score}/100`
                : 'Score: N/A';
        return `- ${name.replace(/_/g, ' ')}: ${score}`;
    }).join('\n');
}

function downloadScanReport() {
    if (!lastScanData) {
        showScanError('No scan report is available yet. Run a scan first.');
        return;
    }

    const riskScore = lastScanData.risk_score || {};
    const recommendations = Array.isArray(lastScanData.recommendations) ? lastScanData.recommendations : [];
    const report = `AegisForge AI Security Scan Report
====================================

URL: ${lastScanData.url || 'Unknown'}
Domain: ${lastScanData.domain || 'Unknown'}
Scanned At: ${lastScanData.scanned_at || new Date().toISOString()}
Scan Duration: ${lastScanData.scan_duration_seconds || 'N/A'} seconds

Overall Score: ${riskScore.score ?? 0}/100
Grade: ${(riskScore.grade || 'F').toUpperCase()}
Status: ${riskScore.status || 'Unknown'}

Security Checks
---------------
${formatCheckSummary(lastScanData.checks)}

Recommendations
---------------
${recommendations.length ? recommendations.map((rec, index) => `${index + 1}. [${rec.priority || 'low'}] ${rec.category || 'General'} - ${rec.issue || 'Issue detected'}\n   Fix: ${rec.fix || 'Review this issue'}`).join('\n') : 'No recommendations returned.'}

Generated by AegisForge AI
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const reportUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeDomain = String(lastScanData.domain || 'website').replace(/[^a-z0-9.-]/gi, '-');
    link.href = reportUrl;
    link.download = `aegisforge-scan-${safeDomain}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(reportUrl);
}

function resetScanner() {
    if (scannerUrl) scannerUrl.value = '';
    if (scanResults) {
        scanResults.classList.remove('active');
        scanResults.innerHTML = '';
    }
    const scannerSection = document.getElementById('scanner');
    if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const launchDate = new Date('2026-12-01T00:00:00').getTime();
    const now = Date.now();
    const distance = Math.max(0, launchDate - now);
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const labelEl = document.querySelector('.countdown-label');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    if (labelEl && launchDate <= now) labelEl.textContent = '🚀 FULL PLATFORM LAUNCHING SOON';
}
if (document.querySelector('.countdown-container')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

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
