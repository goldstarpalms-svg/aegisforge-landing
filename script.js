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
        { key: 'performance', icon: '⚡', name: 'Speed' },
        { key: 'dns', icon: '🧭', name: 'DNS' },
        { key: 'security_txt', icon: '📨', name: 'Policy' },
        { key: 'robots_txt', icon: '🤖', name: 'Robots' }
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
    const dns = checks.dns || {};
    const securityTxt = checks.security_txt || {};
    const robotsTxt = checks.robots_txt || {};
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
        },
        {
            title: 'DNS Resolution',
            score: dns.score,
            icon: '🧭',
            rows: [
                ['Resolves', dns.resolves],
                ['IPv4 Count', dns.ipv4_count],
                ['IPv6 Count', dns.ipv6_count],
                ['IPv4 Addresses', dns.ipv4_addresses],
                ['IPv6 Addresses', dns.ipv6_addresses]
            ],
            beginner: 'DNS is the internet phonebook. Reliable DNS resolution is required before users can reach your site.'
        },
        {
            title: 'Security.txt Policy',
            score: securityTxt.score,
            icon: '📨',
            rows: [
                ['Found', securityTxt.found],
                ['URL', securityTxt.url],
                ['Has Contact', securityTxt.has_contact],
                ['Has Expires', securityTxt.has_expires],
                ['Has Policy', securityTxt.has_policy]
            ],
            beginner: 'security.txt gives ethical researchers a clear way to report vulnerabilities responsibly.'
        },
        {
            title: 'Robots.txt',
            score: robotsTxt.score,
            icon: '🤖',
            rows: [
                ['Found', robotsTxt.found],
                ['URL', robotsTxt.url],
                ['Has Sitemap', robotsTxt.has_sitemap],
                ['Has Disallow Rules', robotsTxt.has_disallow]
            ],
            beginner: 'robots.txt helps search engines understand which parts of your website they can crawl.'
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

// ============================================
// UPCOMING AI MODULE PREVIEWS
// ============================================
const modulePreviews = {
    'app-builder': {
        badge: 'COMING SOON • AI APP BUILDER',
        title: 'AI App Builder Preview',
        subtitle: 'A no-cost visual demo of how AegisForge will turn an idea into a secure app blueprint.',
        image: 'assets/preview-app-builder.webp',
        mockup: `
            <div class="preview-full-module preview-app-full">
                <div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI App Builder Workspace</strong></div>
                <div class="preview-app-layout">
                    <aside class="preview-app-nav">
                        <div class="preview-logo-dot"></div>
                        <strong>FoodFlow SaaS</strong>
                        <span>Overview</span><span>Users</span><span>Orders</span><span>Payments</span><span>Security</span>
                    </aside>
                    <main class="preview-app-canvas">
                        <div class="preview-prompt-box"><small>PROMPT</small><p>Build a food delivery app with customers, vendors, riders, payments, and admin dashboard.</p></div>
                        <div class="preview-app-screen-grid">
                            <section><b>Generated Screens</b><span>Landing</span><span>Customer App</span><span>Vendor Portal</span><span>Rider Tracking</span></section>
                            <section><b>Database Plan</b><span>users</span><span>vendors</span><span>orders</span><span>payments</span></section>
                            <section><b>Security Plan</b><span>RBAC</span><span>Webhook verify</span><span>Rate limits</span><span>Audit logs</span></section>
                        </div>
                        <div class="preview-generated-app">
                            <div class="preview-generated-header">Live App Mockup</div>
                            <div class="preview-generated-content"><div></div><div></div><div></div></div>
                        </div>
                    </main>
                </div>
                <div class="preview-play-strip"><span></span><p>Preview flow: prompt → blueprint → screens → secure app plan</p></div>
            </div>
        `,
        blueprint: [
            'Prompt-to-app blueprint with user roles and core flows',
            'Suggested screens, database tables, and API routes',
            'Security checklist for auth, payments, validation, and secrets',
            'Future upgrade path to real AI code generation'
        ],
        cta: 'Want your app idea previewed first? Join the waitlist.'
    },
    'website-generator': {
        badge: 'COMING SOON • AI WEBSITE GENERATOR',
        title: 'AI Website Generator Preview',
        subtitle: 'A template-powered preview of a landing page generated from a business idea.',
        image: 'assets/preview-website-generator.webp',
        mockup: `
            <div class="preview-full-site-wrap">
                <div class="preview-browser-bar">
                    <span></span><span></span><span></span>
                    <strong>Generated Website Preview</strong>
                </div>
                <div class="preview-full-site">
                    <div class="preview-site-nav">
                        <strong>NovaStudio</strong>
                        <div><span>Services</span><span>Work</span><span>Pricing</span></div>
                        <button>Start Project</button>
                    </div>
                    <section class="preview-site-hero">
                        <div>
                            <small>AI GENERATED LANDING PAGE</small>
                            <h4>Launch a premium website for your business in minutes.</h4>
                            <p>Clean copy, modern sections, strong CTA flow, and SEO-ready structure generated from your idea.</p>
                            <button>Book a Free Call</button>
                        </div>
                        <div class="preview-site-card-stack"><span></span><span></span><span></span></div>
                    </section>
                    <section class="preview-site-services">
                        <h5>Services</h5>
                        <div><article>Brand Strategy</article><article>Website Design</article><article>Growth Systems</article></div>
                    </section>
                    <section class="preview-site-proof">
                        <div><strong>98%</strong><span>Client satisfaction</span></div>
                        <div><strong>24h</strong><span>Preview turnaround</span></div>
                        <div><strong>SEO</strong><span>Structure included</span></div>
                    </section>
                    <section class="preview-site-pricing">
                        <h5>Simple Packages</h5>
                        <div><article>Starter</article><article class="featured">Pro</article><article>Business</article></div>
                    </section>
                    <section class="preview-site-footer">Generated with AegisForge AI Preview</section>
                </div>
                <div class="preview-play-strip"><span></span><p>Visual preview demo — full AI module coming soon</p></div>
            </div>
        `,
        blueprint: [
            'Hero, features, testimonials, pricing, FAQ, and CTA section plan',
            'SEO title, meta description, and keyword suggestions',
            'Mobile-first layout and brand direction',
            'Future upgrade path to downloadable website code'
        ],
        cta: 'Perfect for founders who need a professional web presence quickly.'
    },
    'devops': {
        badge: 'COMING SOON • AI DEVOPS PLATFORM',
        title: 'AI DevOps Platform Preview',
        subtitle: 'A deployment command center preview for turning projects into shipped products.',
        image: 'assets/preview-devops.webp',
        mockup: `
            <div class="preview-full-module preview-devops-full">
                <div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI DevOps Launch Console</strong></div>
                <div class="preview-devops-grid">
                    <div class="preview-devops-left">
                        <div class="preview-pipeline-step done">✓ Source connected</div>
                        <div class="preview-pipeline-step done">✓ Build succeeded</div>
                        <div class="preview-pipeline-step done">✓ Security gate passed</div>
                        <div class="preview-pipeline-step active">↗ Deploying to production</div>
                        <div class="preview-pipeline-step">○ Monitoring setup</div>
                    </div>
                    <div class="preview-devops-right">
                        <div class="preview-env-box"><b>Environment Variables</b><span>DATABASE_URL • configured</span><span>RESEND_API_KEY • configured</span><span>WEBHOOK_SECRET • missing</span></div>
                        <div class="preview-monitor-card"><b>Health Monitor</b><div class="mini-chart"><i></i><i></i><i></i><i></i><i></i></div><p>99.9% target uptime • response budget 500ms</p></div>
                        <div class="preview-checklist-card"><b>Production Checklist</b><span>✓ HTTPS</span><span>✓ Env secrets</span><span>✓ Rate limits</span></div>
                    </div>
                </div>
                <div class="preview-play-strip"><span></span><p>Preview flow: repo → build → scan → deploy → monitor</p></div>
            </div>
        `,
        blueprint: [
            'Deployment checklist and environment variable guidance',
            'CI/CD steps for build, scan, deploy, and monitor',
            'Production readiness checklist',
            'Future upgrade path to one-click deployment automation'
        ],
        cta: 'Built for founders who want to ship without hiring a DevOps team.'
    },
    'code-assistant': {
        badge: 'COMING SOON • AI CODE ASSISTANT',
        title: 'AI Code Assistant Preview',
        subtitle: 'A preview of code review, bug explanation, and beginner-friendly mentorship workflows.',
        image: 'assets/preview-code-assistant.webp',
        mockup: `
            <div class="preview-full-module preview-code-full">
                <div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI Code Assistant Review</strong></div>
                <div class="preview-code-layout">
                    <div class="preview-code-editor">
                        <div class="editor-tab">auth.js</div>
                        <pre>async function login(email, password) {\n  const user = await db.find(email)\n  if (user.password === password) {\n    return createSession(user.id)\n  }\n}</pre>
                    </div>
                    <div class="preview-review-stack">
                        <div class="preview-review-card high"><strong>Critical</strong><p>Password comparison must use hashing, not plain text.</p></div>
                        <div class="preview-review-card medium"><strong>Medium</strong><p>Add rate limiting and account lockout after repeated failures.</p></div>
                        <div class="preview-review-card low"><strong>Mentor Mode</strong><p>This function handles login. Secure auth requires hashing, validation, sessions, and audit logs.</p></div>
                    </div>
                </div>
                <div class="preview-code-fix"><b>Suggested safer pattern</b><span>validate input → lookup user → compare hash → create secure session → audit login</span></div>
                <div class="preview-play-strip"><span></span><p>Preview flow: paste code → review → explain → safer fix</p></div>
            </div>
        `,
        blueprint: [
            'Code explanation in beginner-friendly language',
            'Bug and security smell detection',
            'Refactoring suggestions and safer patterns',
            'Future upgrade path to repo-aware AI reviews'
        ],
        cta: 'Designed to help beginners learn and pros move faster.'
    },
    'threat-prediction': {
        badge: 'COMING SOON • THREAT PREDICTION AI',
        title: 'Threat Prediction AI Preview',
        subtitle: 'A premium risk forecasting concept for identifying weak signals before incidents happen.',
        image: 'assets/preview-threat-prediction.webp',
        mockup: `
            <div class="preview-full-module preview-threat-full">
                <div class="preview-browser-bar"><span></span><span></span><span></span><strong>Threat Prediction AI Radar</strong></div>
                <div class="preview-threat-dashboard">
                    <div class="preview-threat-radar large">
                        <div class="radar-sweep"></div><div class="radar-circle"></div><div class="radar-circle two"></div>
                        <div class="radar-dot one"></div><div class="radar-dot two"></div><div class="radar-dot three"></div>
                    </div>
                    <div class="preview-threat-panel">
                        <h4>Predicted Attack Paths</h4>
                        <div class="threat-path critical"><b>High</b><span>Payment webhook spoofing risk</span></div>
                        <div class="threat-path medium"><b>Medium</b><span>Admin route exposure pattern</span></div>
                        <div class="threat-path low"><b>Low</b><span>Missing security disclosure policy</span></div>
                        <div class="threat-action"><strong>AI Hardening Plan</strong><p>Verify webhook signatures, protect admin routes, add audit logs, and publish security.txt.</p></div>
                    </div>
                </div>
                <div class="preview-play-strip"><span></span><p>Preview flow: observe signals → predict risk → suggest hardening</p></div>
            </div>
        `,
        blueprint: [
            'Attack path prediction for common app patterns',
            'Risk forecasting based on configuration and behavior signals',
            'Proactive hardening recommendations',
            'Future upgrade path to continuous monitoring and alerts'
        ],
        cta: 'Security that thinks ahead — planned for advanced tiers.'
    }
};

function openModulePreview(key) {
    const modal = document.getElementById('modulePreviewModal');
    const content = document.getElementById('modulePreviewContent');
    const preview = modulePreviews[key];
    if (!modal || !content || !preview) return;

    content.innerHTML = `
        <div class="module-preview-badge">${preview.badge}</div>
        <h2 id="modulePreviewTitle">${preview.title}</h2>
        <p class="module-preview-subtitle">${preview.subtitle}</p>
        <div class="module-preview-notice">This is a mature product concept preview to show the planned module experience. The complete AI module is still coming soon.</div>
        ${preview.image ? `<div class="module-preview-ai-shot"><img src="${preview.image}" alt="${preview.title} visual preview" loading="lazy"></div>` : ''}
        <div class="module-preview-mockup">${preview.mockup}</div>
        <div class="module-preview-blueprint">
            <h3>What the preview demonstrates</h3>
            <ul>${preview.blueprint.map(item => `<li>✓ ${item}</li>`).join('')}</ul>
        </div>
        <div class="module-preview-footer">
            <p>${preview.cta}</p>
            <a href="#waitlist" onclick="closeModulePreview()" class="module-preview-cta">Join Waitlist</a>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModulePreview() {
    const modal = document.getElementById('modulePreviewModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeModulePreview();
});
