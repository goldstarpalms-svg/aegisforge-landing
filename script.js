// EMERGENCY LOADER FIX
setTimeout(function() {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) { loaderEl.style.display = 'none'; }
}, 2000);

// Backend API URL
const BACKEND_API_URL = 'https://aegisforge-backend.onrender.com';
let lastScanData = null;

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char];
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
// P10: SCROLL REVEAL + NAV SCROLL + CARD ANIM
// ============================================
(function initScrollAnimations() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // Intersection Observer for .anim-reveal and .anim-card
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim-reveal, .anim-card').forEach(el => {
        revealObserver.observe(el);
    });
})();

// ============================================
// P1: HERO INTERACTIVE ANIMATION
// ============================================
(function initHeroAnimation() {
    const typedEl = document.getElementById('heroTypedPrompt');
    const cursorEl = document.getElementById('heroCursor');
    const stepsEl = document.getElementById('heroAnimSteps');
    const resultEl = document.getElementById('heroAnimResult');
    const agentPills = document.querySelectorAll('.agent-pill');

    if (!typedEl || !stepsEl) return;

    const prompt = 'Build me Airbnb for Lagos';
    const steps = [
        { icon: '🧠', text: 'Planning product blueprint...', agent: 'product', duration: 1200 },
        { icon: '🎨', text: 'Designing 7 screens...', agent: 'product', duration: 900 },
        { icon: '💾', text: 'Generating database schema...', agent: 'builder', duration: 800 },
        { icon: '💻', text: 'Writing production code...', agent: 'builder', duration: 1100 },
        { icon: '🛡️', text: 'Running security scan...', agent: 'security', duration: 700 },
        { icon: '🔧', text: 'Fixing 3 vulnerabilities...', agent: 'security', duration: 600 },
        { icon: '🚀', text: 'Deploying to production...', agent: 'deploy', duration: 900 },
    ];

    let hasRun = false;

    async function runAnimation() {
        if (hasRun) return;
        hasRun = true;

        // Type the prompt
        for (let i = 0; i < prompt.length; i++) {
            typedEl.textContent += prompt[i];
            await sleep(45 + Math.random() * 25);
        }
        if (cursorEl) cursorEl.classList.add('hidden');
        await sleep(500);

        // Run each step
        for (const step of steps) {
            // Activate agent pill
            agentPills.forEach(pill => {
                pill.classList.remove('active');
                if (pill.dataset.agent === step.agent && !pill.classList.contains('complete')) {
                    pill.classList.add('active');
                }
            });

            // Add step with spinner
            const stepEl = document.createElement('div');
            stepEl.className = 'hero-anim-step';
            stepEl.innerHTML = `<span class="step-icon">${step.icon}</span><span class="step-spinner"></span><span>${step.text}</span>`;
            stepsEl.appendChild(stepEl);
            requestAnimationFrame(() => stepEl.classList.add('visible'));

            await sleep(step.duration);

            // Mark complete
            stepEl.classList.add('complete');
            const spinner = stepEl.querySelector('.step-spinner');
            if (spinner) spinner.outerHTML = '<span class="step-icon">✓</span>';

            // Mark agent pill complete
            agentPills.forEach(pill => {
                if (pill.dataset.agent === step.agent) {
                    pill.classList.remove('active');
                    pill.classList.add('complete');
                }
            });
        }

        await sleep(400);

        // Show result
        if (resultEl) {
            resultEl.innerHTML = '<div class="hero-anim-result-inner">✓ Live at staylagos.app — All agents complete</div>';
            resultEl.classList.add('visible');
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // Start on scroll into view
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                setTimeout(runAnimation, 800);
            }
        }, { threshold: 0.3 });
        observer.observe(heroSection);
    }
})();

// ============================================
// P5: HERO PROMPT FORM + IDEA CHIPS
// ============================================
(function initHeroPrompt() {
    const form = document.getElementById('heroPromptForm');
    const input = document.getElementById('heroPromptInput');
    const chips = document.querySelectorAll('.idea-chip');

    if (!form || !input) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.idea;
            input.focus();
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idea = input.value.trim();
        if (!idea) return;

        // If preview engine exists, populate and scroll to it
        const previewIdea = document.getElementById('previewIdea');
        const previewForm = document.getElementById('previewEngineForm');
        if (previewIdea && previewForm) {
            previewIdea.value = idea;
            previewForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback: scroll to scanner
            document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
})();

// ============================================
// P7: INTERACTIVE WALKTHROUGH
// ============================================
(function initWalkthrough() {
    const stages = document.querySelectorAll('.wt-stage');
    const connectors = document.querySelectorAll('.wt-connector');
    const screenshots = document.querySelectorAll('.wt-screenshot');
    const caption = document.getElementById('walkthroughCaption');
    const prevBtn = document.getElementById('wtPrev');
    const nextBtn = document.getElementById('wtNext');
    const autoBtn = document.getElementById('wtAutoplay');

    if (!stages.length || !screenshots.length) return;

    const captions = [
        'Type your idea and AegisForge starts working immediately.',
        'Product Agent creates your blueprint: roles, screens, database, security plan.',
        'Builder Agent designs the UI — dashboards, forms, and navigation.',
        'Builder Agent writes production-ready code with proper architecture.',
        'Security Agent scans for vulnerabilities and auto-fixes issues.',
        'Deploy Agent ships to production and Growth Agent monitors 24/7.'
    ];

    let current = 0;
    let autoplayInterval = null;
    const total = stages.length;

    function goTo(index) {
        if (index < 0 || index >= total) return;
        current = index;

        stages.forEach((s, i) => {
            s.classList.remove('active', 'complete');
            if (i < current) s.classList.add('complete');
            if (i === current) s.classList.add('active');
        });

        connectors.forEach((c, i) => {
            c.classList.toggle('active', i < current);
        });

        screenshots.forEach((s, i) => {
            s.classList.toggle('active', i === current);
        });

        if (caption) {
            caption.style.opacity = '0';
            setTimeout(() => {
                caption.textContent = captions[current] || '';
                caption.style.opacity = '1';
            }, 200);
        }

        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current === total - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    stages.forEach((s, i) => {
        s.addEventListener('click', () => goTo(i));
    });

    if (autoBtn) {
        autoBtn.addEventListener('click', () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
                autoBtn.textContent = '▶ Autoplay';
                return;
            }
            goTo(0);
            autoBtn.textContent = '⏸ Pause';
            autoplayInterval = setInterval(() => {
                if (current >= total - 1) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                    autoBtn.textContent = '▶ Autoplay';
                    return;
                }
                goTo(current + 1);
            }, 2500);
        });
    }

    // Auto-advance first slide when visible
    const section = document.querySelector('.walkthrough-section');
    if (section) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                // Start autoplay after a short delay
                setTimeout(() => {
                    if (autoBtn) autoBtn.click();
                }, 1200);
            }
        }, { threshold: 0.3 });
        observer.observe(section);
    }
})();

// ============================================
// WAITLIST FORM
// ============================================
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim().toLowerCase();
        if (!email) return;
        try {
            if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Joining...'; }
            setWaitlistMessage('loading', '<span class="message-icon">⏳</span><span>Adding you to the waitlist...</span>');
            const response = await fetch(`${BACKEND_API_URL}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                const positionText = data.position ? `#${data.position}` : 'confirmed';
                const title = data.already_joined ? 'You are already in!' : 'You are in!';
                const detail = data.position ? `Your founder waitlist position is <strong>${positionText}</strong>.` : 'Your early access spot is confirmed.';
                setWaitlistMessage('success', `<span class="message-icon">🎉</span><span><strong>${title}</strong><br>${detail}<br><small>Check your inbox for the confirmation email.</small></span>`);
                emailInput.value = '';
            } else {
                const errorData = await response.json().catch(() => ({}));
                setWaitlistMessage('error', `<span class="message-icon">❌</span><span>${escapeHTML(errorData.detail || 'Something went wrong. Try again.')}</span>`);
            }
        } catch (error) {
            setWaitlistMessage('error', '<span class="message-icon">❌</span><span>Connection error. Try again.</span>');
        } finally {
            if (submitButton) { submitButton.disabled = false; submitButton.textContent = 'Start Building Free →'; }
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
        e.preventDefault(); e.stopPropagation();
        await performScan(); return false;
    });
}

async function performScan() {
    const url = scannerUrl.value.trim();
    if (!url) { showScanError('Please enter a valid URL'); return; }
    scanResults.classList.remove('active'); scanResults.innerHTML = '';
    scanProgress.classList.add('active'); scanButton.classList.add('loading');
    scanButton.disabled = true; scannerUrl.disabled = true;
    scanProgressFill.style.width = '10%'; scanPercentage.textContent = '10%';
    scanStatus.textContent = 'Starting scanner...';
    let progress = 10;
    const progressInterval = setInterval(() => {
        if (progress < 90) { progress += 2; scanProgressFill.style.width = progress + '%'; scanPercentage.textContent = progress + '%';
            if (progress < 30) scanStatus.textContent = 'Checking SSL...';
            else if (progress < 50) scanStatus.textContent = 'Analyzing headers...';
            else if (progress < 70) scanStatus.textContent = 'Detecting tech stack...';
            else scanStatus.textContent = 'Analyzing performance...';
        }
    }, 500);
    try {
        const response = await fetch(`${BACKEND_API_URL}/scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url }) });
        clearInterval(progressInterval);
        if (!response.ok) { const errorData = await response.json().catch(() => ({})); throw new Error(errorData.detail || `Server error: ${response.status}`); }
        const data = await response.json();
        scanProgressFill.style.width = '100%'; scanPercentage.textContent = '100%'; scanStatus.textContent = 'Scan complete!';
        setTimeout(() => { displayScanResults(data); scanProgress.classList.remove('active'); scanButton.classList.remove('loading'); scanButton.disabled = false; scannerUrl.disabled = false; }, 800);
    } catch (error) {
        clearInterval(progressInterval);
        scanProgress.classList.remove('active'); scanButton.classList.remove('loading'); scanButton.disabled = false; scannerUrl.disabled = false;
        showScanError(error.message || 'Scanner starting up. Please wait and try again.');
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
    const grade = safeClass(riskScore.grade, ['a','b','c','d','f'], 'f');
    const score = safeScore(riskScore.score);
    const status = escapeHTML(riskScore.status || 'Unknown');
    const summary = escapeHTML(riskScore.summary || 'Analysis complete');
    const scannedUrl = escapeHTML(data.url || 'Unknown URL');
    let html = `<div class="results-score-container"><div class="score-circle-wrapper"><div class="score-circle grade-${grade}"><div><div class="score-number">${score}</div><div class="score-max">/100</div></div></div></div><div class="grade-badge grade-${grade}">${grade.toUpperCase()}</div><div class="score-status">${status}</div><p class="score-summary">${summary}</p><div class="scanned-url">${scannedUrl}</div></div><div class="results-categories">${generateCategoryCards(checks)}</div>${generateDetailedResults(checks, data)}`;
    if (recommendations.length > 0) {
        html += `<div class="recommendations-section"><div class="recommendations-header"><div class="recommendations-title">🎯 AI Recommendations</div><div class="recommendations-count">${recommendations.length} issue${recommendations.length !== 1 ? 's' : ''}</div></div>${recommendations.map(rec => generateRecommendationCard(rec)).join('')}</div>`;
    }
    html += `<div class="results-actions"><div class="results-cta-text"><strong>💚 Love this scanner?</strong> Join our waitlist!</div><a href="#waitlist" class="results-btn primary">🚀 Start Building Free</a><button onclick="downloadScanReport()" class="results-btn secondary">⬇️ Download Report</button><button onclick="resetScanner()" class="results-btn secondary">🔄 Scan Another</button></div>`;
    scanResults.innerHTML = html; scanResults.classList.add('active');
    setTimeout(() => { scanResults.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
}

function generateCategoryCards(checks) {
    const categories = [
        { key:'ssl', icon:'🔒', name:'SSL/TLS' }, { key:'headers', icon:'📋', name:'Headers' },
        { key:'reachability', icon:'📡', name:'Uptime' }, { key:'tech_stack', icon:'🔍', name:'Tech' },
        { key:'cookies', icon:'🍪', name:'Cookies' }, { key:'cdn', icon:'🌍', name:'CDN' },
        { key:'https_enforcement', icon:'🛡️', name:'HTTPS' }, { key:'performance', icon:'⚡', name:'Speed' },
        { key:'dns', icon:'🧭', name:'DNS' }, { key:'security_txt', icon:'📨', name:'Policy' },
        { key:'robots_txt', icon:'🤖', name:'Robots' }
    ];
    return categories.map(cat => {
        const check = checks[cat.key] || {};
        let score = check.score;
        if (cat.key === 'cookies') score = check.security_score ?? check.score;
        score = safeScore(score);
        let scoreClass = 'low', status = 'Poor';
        if (score >= 80) { scoreClass = 'high'; status = 'Great'; }
        else if (score >= 60) { scoreClass = 'medium'; status = 'Fair'; }
        return `<div class="category-card"><div class="category-icon">${cat.icon}</div><div class="category-name">${escapeHTML(cat.name)}</div><div class="category-score ${scoreClass}">${score}</div><div class="category-status">${status}</div></div>`;
    }).join('');
}

function generateDetailedResults(checks, data) {
    const ssl = checks.ssl || {}; const headers = checks.headers || {}; const reachability = checks.reachability || {};
    const tech = checks.tech_stack || {}; const cookies = checks.cookies || {}; const cdn = checks.cdn || {};
    const https = checks.https_enforcement || {}; const performance = checks.performance || {};
    const dns = checks.dns || {}; const securityTxt = checks.security_txt || {}; const robotsTxt = checks.robots_txt || {};
    const missingHeaders = Array.isArray(headers.missing_headers) ? headers.missing_headers : [];
    const detectedTech = tech.detected || {};
    const detailCards = [
        { title:'SSL/TLS Certificate', score:ssl.score, icon:'🔒', rows:[['Status',ssl.status],['Protocol',ssl.protocol],['Issuer',ssl.issuer],['Expires',ssl.expires],['Days Until Expiry',ssl.days_until_expiry],['Expiry Warning',ssl.expiry_warning]], beginner:ssl.status==='secure'?'Your site is using HTTPS encryption.':'Your site may not be properly protected by HTTPS.' },
        { title:'Security Headers', score:headers.score, icon:'📋', rows:[['Headers Present',`${headers.headers_present??0}/${headers.headers_total??0}`],['Grade',headers.grade],['Server',headers.server],['Missing Headers',missingHeaders.length?missingHeaders.join(', '):'None']], beginner:missingHeaders.length?'Security headers help browsers block attacks.':'Key security headers look good.' },
        { title:'Reachability & Uptime', score:reachability.score, icon:'📡', rows:[['Reachable',reachability.reachable],['Status Code',reachability.status_code],['Response Time',reachability.response_time_ms!==undefined?`${reachability.response_time_ms}ms`:undefined],['Final URL',reachability.final_url],['Content Type',reachability.content_type]], beginner:'Reachability confirms whether the website responds reliably.' },
        { title:'Technology Stack', score:tech.score??null, icon:'🔍', rows:[['Server',detectedTech.server],['Powered By',detectedTech.powered_by],['CMS',detectedTech.cms],['Frameworks',detectedTech.frameworks],['Libraries',detectedTech.libraries],['Analytics',detectedTech.analytics]], beginner:'Technology detection helps reveal what may need updates.' },
        { title:'Cookies', score:cookies.security_score, icon:'🍪', rows:[['Total Cookies',cookies.total_cookies],['Secure Cookies',cookies.secure_cookies],['Tracking Cookies',cookies.tracking_cookies]], beginner:'Secure cookies reduce session theft and improve privacy.' },
        { title:'CDN & HTTPS Enforcement', score:cdn.using_cdn?100:https.score, icon:'🌍', rows:[['Using CDN',cdn.using_cdn],['CDNs Detected',cdn.cdns_detected],['Enforces HTTPS',https.enforces_https],['HTTP Status',https.http_status_code],['Redirect Location',https.redirect_location]], beginner:'A CDN improves speed. HTTPS enforcement pushes visitors to the secure version.' },
        { title:'Performance', score:performance.score, icon:'⚡', rows:[['First Load',performance.first_load_ms!==undefined?`${performance.first_load_ms}ms`:undefined],['Cached Load',performance.cached_load_ms!==undefined?`${performance.cached_load_ms}ms`:undefined],['Content Size',performance.content_size_kb!==undefined?`${performance.content_size_kb}KB`:undefined],['Grade',performance.grade]], beginner:'Faster pages improve trust, SEO, and conversion.' },
        { title:'DNS Resolution', score:dns.score, icon:'🧭', rows:[['Resolves',dns.resolves],['IPv4 Count',dns.ipv4_count],['IPv6 Count',dns.ipv6_count],['IPv4 Addresses',dns.ipv4_addresses],['IPv6 Addresses',dns.ipv6_addresses]], beginner:'Reliable DNS resolution is required for users to reach your site.' },
        { title:'Security.txt Policy', score:securityTxt.score, icon:'📨', rows:[['Found',securityTxt.found],['URL',securityTxt.url],['Has Contact',securityTxt.has_contact],['Has Expires',securityTxt.has_expires],['Has Policy',securityTxt.has_policy]], beginner:'security.txt gives researchers a way to report vulnerabilities responsibly.' },
        { title:'Robots.txt', score:robotsTxt.score, icon:'🤖', rows:[['Found',robotsTxt.found],['URL',robotsTxt.url],['Has Sitemap',robotsTxt.has_sitemap],['Has Disallow Rules',robotsTxt.has_disallow]], beginner:'robots.txt helps search engines understand which pages to crawl.' }
    ];
    return `<div class="detailed-results active"><button class="detailed-toggle" onclick="toggleDetailedResults(this)"><span>📊 Detailed Security Report</span><span class="detailed-toggle-icon">⌄</span></button><div class="detailed-content active"><div class="detail-summary-strip"><div><strong>Scanned URL</strong><span>${escapeHTML(data.url||'Unknown')}</span></div><div><strong>Domain</strong><span>${escapeHTML(data.domain||'Unknown')}</span></div><div><strong>Duration</strong><span>${escapeHTML(data.scan_duration_seconds||'N/A')}s</span></div></div><div class="detail-card-grid">${detailCards.map(card=>generateDetailCard(card)).join('')}</div></div></div>`;
}

function generateDetailCard(card) {
    const score = card.score===null||card.score===undefined?null:safeScore(card.score);
    const scoreClass = score===null?'neutral':score>=80?'high':score>=60?'medium':'low';
    return `<div class="detail-report-card"><div class="detail-report-header"><div><span class="detail-report-icon">${card.icon}</span><strong>${escapeHTML(card.title)}</strong></div><span class="detail-score ${scoreClass}">${score===null?'Info':`${score}/100`}</span></div><div class="detail-report-status ${scoreClass}">${score===null?'Informational':scoreLabel(score)}</div><div class="detail-report-rows">${card.rows.map(([key,value])=>`<div class="detail-report-row"><span>${escapeHTML(key)}</span><strong>${escapeHTML(formatValue(value))}</strong></div>`).join('')}</div><p class="detail-beginner-note">${escapeHTML(card.beginner)}</p></div>`;
}

function toggleDetailedResults(button) {
    const content = button.parentElement.querySelector('.detailed-content');
    if (!content) return;
    const isActive = content.classList.toggle('active');
    button.classList.toggle('active', isActive);
}

function generateRecommendationCard(rec) {
    const priority = safeClass(rec.priority, ['critical','high','medium','low'], 'low');
    return `<div class="recommendation-item ${priority}"><div class="recommendation-header"><div><div class="recommendation-category">${escapeHTML(rec.category||'General')}</div></div><div class="recommendation-priority ${priority}">${priority}</div></div><div class="recommendation-issue">${escapeHTML(rec.issue||'Issue detected')}</div><div class="recommendation-fix">${escapeHTML(rec.fix||'Review this issue')}</div></div>`;
}

function formatCheckSummary(checks) {
    return Object.entries(checks||{}).map(([name,value])=>{
        const score = value&&typeof value==='object'&&value.score!==undefined?`Score: ${value.score}/100`:value&&typeof value==='object'&&value.security_score!==undefined?`Score: ${value.security_score}/100`:'Score: N/A';
        return `- ${name.replace(/_/g,' ')}: ${score}`;
    }).join('\n');
}

function downloadScanReport() {
    if (!lastScanData) { showScanError('No scan report available. Run a scan first.'); return; }
    const riskScore = lastScanData.risk_score || {};
    const recommendations = Array.isArray(lastScanData.recommendations)?lastScanData.recommendations:[];
    const report = `AegisForge AI Security Scan Report\n====================================\n\nURL: ${lastScanData.url||'Unknown'}\nDomain: ${lastScanData.domain||'Unknown'}\nScanned At: ${lastScanData.scanned_at||new Date().toISOString()}\nScan Duration: ${lastScanData.scan_duration_seconds||'N/A'} seconds\n\nOverall Score: ${riskScore.score??0}/100\nGrade: ${(riskScore.grade||'F').toUpperCase()}\nStatus: ${riskScore.status||'Unknown'}\n\nSecurity Checks\n---------------\n${formatCheckSummary(lastScanData.checks)}\n\nRecommendations\n---------------\n${recommendations.length?recommendations.map((rec,i)=>`${i+1}. [${rec.priority||'low'}] ${rec.category||'General'} - ${rec.issue||'Issue detected'}\n   Fix: ${rec.fix||'Review this issue'}`).join('\n'):'No recommendations returned.'}\n\nGenerated by AegisForge AI\n`;
    const blob = new Blob([report],{type:'text/plain;charset=utf-8'});
    const reportUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeDomain = String(lastScanData.domain||'website').replace(/[^a-z0-9.-]/gi,'-');
    link.href=reportUrl; link.download=`aegisforge-scan-${safeDomain}.txt`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(reportUrl);
}

function resetScanner() {
    if (scannerUrl) scannerUrl.value = '';
    if (scanResults) { scanResults.classList.remove('active'); scanResults.innerHTML = ''; }
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

// Back to Top
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => { backToTopBtn.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// Cookie Banner
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) { setTimeout(() => cookieBanner.classList.add('show'), 2500); }
if (acceptCookiesBtn) { acceptCookiesBtn.addEventListener('click', () => { localStorage.setItem('cookiesAccepted','true'); cookieBanner.classList.remove('show'); setTimeout(()=>cookieBanner.classList.add('hidden'),500); }); }

// ============================================
// MODULE PREVIEW MODAL
// ============================================
const modulePreviews = {
    'app-builder': {
        badge: 'PRODUCT AGENT + BUILDER AGENT • COMING SOON',
        title: 'Product Agent & Builder Agent',
        subtitle: 'A preview of how AegisForge AI agents turn an idea into a secure app blueprint.',
        image: 'assets/screenshot-blueprint.jpg',
        mockup: `<div class="preview-full-module"><div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI App Builder Workspace</strong></div><div class="preview-app-layout"><aside class="preview-app-nav"><div class="preview-logo-dot"></div><strong>FoodFlow SaaS</strong><span>Overview</span><span>Users</span><span>Orders</span><span>Payments</span><span>Security</span></aside><main class="preview-app-canvas"><div class="preview-prompt-box"><small>PROMPT</small><p>Build a food delivery app with customers, vendors, riders, payments, and admin dashboard.</p></div><div class="preview-app-screen-grid"><section><b>Generated Screens</b><span>Landing</span><span>Customer App</span><span>Vendor Portal</span></section><section><b>Database Plan</b><span>users</span><span>vendors</span><span>orders</span></section><section><b>Security Plan</b><span>RBAC</span><span>Webhook verify</span><span>Rate limits</span></section></div></main></div><div class="preview-play-strip"><span></span><p>Prompt → blueprint → screens → secure app plan</p></div></div>`,
        blueprint: ['Prompt-to-app blueprint with user roles and core flows','Suggested screens, database tables, and API routes','Security checklist for auth, payments, and validation','Future upgrade path to real AI code generation'],
        cta: 'Start building your app idea today.'
    },
    'website-generator': {
        badge: 'PRODUCT AGENT • COMING SOON',
        title: 'Product Agent for Websites',
        subtitle: 'A template-powered preview of a landing page generated from a business idea.',
        image: 'assets/screenshot-dashboard.jpg',
        mockup: `<div class="preview-full-site-wrap"><div class="preview-browser-bar"><span></span><span></span><span></span><strong>Generated Website Preview</strong></div><div class="preview-full-site"><div class="preview-site-nav"><strong>NovaStudio</strong><div><span>Services</span><span>Work</span><span>Pricing</span></div><button>Start Project</button></div><section class="preview-site-hero"><div><small>AI GENERATED LANDING PAGE</small><h4>Launch a premium website for your business in minutes.</h4><p>Clean copy, modern sections, strong CTA flow, and SEO-ready structure.</p><button>Book a Free Call</button></div><div class="preview-site-card-stack"><span></span><span></span><span></span></div></section></div><div class="preview-play-strip"><span></span><p>Visual preview — full AI agent coming soon</p></div></div>`,
        blueprint: ['Hero, features, testimonials, pricing, FAQ section plan','SEO title, meta description, and keyword suggestions','Mobile-first layout and brand direction','Future upgrade path to downloadable website code'],
        cta: 'Perfect for founders who need a professional web presence quickly.'
    },
    'devops': {
        badge: 'DEPLOY AGENT • COMING SOON',
        title: 'Deploy Agent',
        subtitle: 'A deployment command center preview for turning projects into shipped products.',
        image: 'assets/screenshot-deploy.jpg',
        mockup: `<div class="preview-full-module"><div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI DevOps Console</strong></div><div class="preview-devops-grid"><div class="preview-devops-left"><div class="preview-pipeline-step done">✓ Source connected</div><div class="preview-pipeline-step done">✓ Build succeeded</div><div class="preview-pipeline-step done">✓ Security gate passed</div><div class="preview-pipeline-step active">↗ Deploying to production</div><div class="preview-pipeline-step">○ Monitoring setup</div></div><div class="preview-devops-right"><div class="preview-env-box"><b>Environment Variables</b><span>DATABASE_URL • configured</span><span>API_KEY • configured</span></div><div class="preview-monitor-card"><b>Health Monitor</b><p>99.9% target uptime • response budget 500ms</p></div></div></div><div class="preview-play-strip"><span></span><p>Repo → build → scan → deploy → monitor</p></div></div>`,
        blueprint: ['Deployment checklist and environment variable guidance','CI/CD steps for build, scan, deploy, and monitor','Production readiness checklist','Future upgrade path to one-click deployment'],
        cta: 'Built for founders who want to ship without hiring a DevOps team.'
    },
    'code-assistant': {
        badge: 'BUILDER AGENT • COMING SOON',
        title: 'Builder Agent',
        subtitle: 'A preview of code review, bug explanation, and mentorship workflows.',
        image: 'assets/screenshot-code.jpg',
        mockup: `<div class="preview-full-module"><div class="preview-browser-bar"><span></span><span></span><span></span><strong>AI Code Review</strong></div><div class="preview-code-layout"><div class="preview-code-editor"><div class="editor-tab">auth.js</div><pre>async function login(email, password) {\n  const user = await db.find(email)\n  if (user.password === password) {\n    return createSession(user.id)\n  }\n}</pre></div><div class="preview-review-stack"><div class="preview-review-card high"><strong>Critical</strong><p>Password comparison must use hashing.</p></div><div class="preview-review-card medium"><strong>Medium</strong><p>Add rate limiting after failures.</p></div></div></div><div class="preview-play-strip"><span></span><p>Paste code → review → explain → safer fix</p></div></div>`,
        blueprint: ['Code explanation in beginner-friendly language','Bug and security smell detection','Refactoring suggestions and safer patterns','Future upgrade path to repo-aware AI reviews'],
        cta: 'Designed to help beginners learn and pros move faster.'
    },
    'threat-prediction': {
        badge: 'GROWTH AGENT • COMING SOON',
        title: 'Growth Agent',
        subtitle: 'A risk forecasting concept for identifying weak signals before incidents happen.',
        image: 'assets/screenshot-security.jpg',
        mockup: `<div class="preview-full-module"><div class="preview-browser-bar"><span></span><span></span><span></span><strong>Threat Prediction AI</strong></div><div class="preview-threat-dashboard"><div class="preview-threat-radar large"><div class="radar-sweep"></div><div class="radar-circle"></div><div class="radar-circle two"></div><div class="radar-dot one"></div><div class="radar-dot two"></div><div class="radar-dot three"></div></div><div class="preview-threat-panel"><h4>Predicted Attack Paths</h4><div class="threat-path critical"><b>High</b><span>Payment webhook spoofing</span></div><div class="threat-path medium"><b>Medium</b><span>Admin route exposure</span></div><div class="threat-path low"><b>Low</b><span>Missing security.txt</span></div></div></div><div class="preview-play-strip"><span></span><p>Observe signals → predict risk → suggest hardening</p></div></div>`,
        blueprint: ['Attack path prediction for common app patterns','Risk forecasting based on configuration signals','Proactive hardening recommendations','Future upgrade path to continuous monitoring'],
        cta: 'Security that thinks ahead — planned for advanced tiers.'
    }
};

function openModulePreview(key) {
    const modal = document.getElementById('modulePreviewModal');
    const content = document.getElementById('modulePreviewContent');
    const preview = modulePreviews[key];
    if (!modal || !content || !preview) return;
    content.innerHTML = `<div class="module-preview-badge">${preview.badge}</div><h2 id="modulePreviewTitle">${preview.title}</h2><p class="module-preview-subtitle">${preview.subtitle}</p><div class="module-preview-notice">Product concept preview. The complete AI agent is still coming soon.</div>${preview.image?`<div class="module-preview-ai-shot"><img src="${preview.image}" alt="${preview.title} visual preview" loading="lazy" width="800" height="450"></div>`:''}<div class="module-preview-mockup">${preview.mockup}</div><div class="module-preview-blueprint"><h3>What the preview demonstrates</h3><ul>${preview.blueprint.map(item=>`<li>✓ ${item}</li>`).join('')}</ul></div><div class="module-preview-footer"><p>${preview.cta}</p><a href="#hero-prompt" onclick="closeModulePreview()" class="module-preview-cta">Start Building Free</a></div>`;
    modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}

function closeModulePreview() {
    const modal = document.getElementById('modulePreviewModal');
    if (!modal) return;
    modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
}

document.addEventListener('keydown', function(event) { if (event.key==='Escape') closeModulePreview(); });

// ============================================
// PREVIEW ENGINE (kept for hero prompt fallback)
// ============================================
const previewEngineForm = document.getElementById('previewEngineForm');
const previewEngineOutput = document.getElementById('previewEngineOutput');
const previewGenerateBtn = document.getElementById('previewGenerateBtn');

if (previewEngineForm) {
    previewEngineForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const idea = document.getElementById('previewIdea').value.trim();
        const projectType = document.getElementById('previewType').value;
        if (!idea) return;
        try {
            if (previewGenerateBtn) { previewGenerateBtn.disabled = true; previewGenerateBtn.textContent = 'Generating...'; }
            previewEngineOutput.innerHTML = `<div class="preview-loading-state"><div class="loader-icon">⚡</div><h3>Generating your concept preview...</h3><p>Creating layout, features, database plan, and security checklist.</p></div>`;
            const response = await fetch(`${BACKEND_API_URL}/preview/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: idea, project_type: projectType }) });
            if (!response.ok) throw new Error('Preview generation failed');
            const data = await response.json();
            window.lastPreviewBlueprint = data;
            displayPreviewResult(data);
        } catch (error) {
            previewEngineOutput.innerHTML = `<div class="preview-error-state"><h3>Preview temporarily unavailable</h3><p>Please try again in a moment.</p></div>`;
        } finally {
            if (previewGenerateBtn) { previewGenerateBtn.disabled = false; previewGenerateBtn.textContent = '⚡ Generate Preview'; }
        }
    });
}

function displayPreviewResult(data) {
    if (!previewEngineOutput) return;
    previewEngineOutput.innerHTML = `<div class="smart-preview-result"><div class="smart-preview-top"><div><div class="smart-preview-category">${escapeHTML(data.category||'concept')}</div><h3>${escapeHTML(data.name||'Your App')}</h3><p>${escapeHTML(data.summary||'')}</p></div><button onclick="downloadPreviewBlueprint()" class="smart-preview-download">⬇️ Download</button></div><div class="smart-blueprint-grid"><div class="smart-blueprint-card"><h4>👥 Roles</h4><ul>${(data.roles||[]).map(r=>`<li>${escapeHTML(r)}</li>`).join('')}</ul></div><div class="smart-blueprint-card"><h4>✨ Features</h4><ul>${(data.features||[]).map(f=>`<li>${escapeHTML(f)}</li>`).join('')}</ul></div><div class="smart-blueprint-card"><h4>🖥️ Screens</h4><ul>${(data.pages||[]).map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ul></div><div class="smart-blueprint-card"><h4>💾 Database</h4><ul>${(data.database||[]).map(d=>`<li>${escapeHTML(d)}</li>`).join('')}</ul></div><div class="smart-blueprint-card"><h4>🔒 Security</h4><ul>${(data.security||[]).map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul></div><div class="smart-blueprint-card"><h4>💰 Monetization</h4><ul>${(data.monetization||[]).map(m=>`<li>${escapeHTML(m)}</li>`).join('')}</ul></div></div><div class="smart-preview-cta"><p><strong>Ready to build this for real?</strong> Join the waitlist for full AI access.</p><a href="#waitlist" class="btn-primary">Start Building Free →</a></div></div>`;
}

function downloadPreviewBlueprint() {
    const data = window.lastPreviewBlueprint; if (!data) return;
    const report = `AegisForge Preview Blueprint\n============================\n\nName: ${data.name}\nCategory: ${data.category}\nTagline: ${data.tagline}\n\nSummary:\n${data.summary}\n\nRoles:\n- ${(data.roles||[]).join('\n- ')}\n\nFeatures:\n- ${(data.features||[]).join('\n- ')}\n\nPages:\n- ${(data.pages||[]).join('\n- ')}\n\nDatabase:\n- ${(data.database||[]).join('\n- ')}\n\nSecurity:\n- ${(data.security||[]).join('\n- ')}\n\nMonetization:\n- ${(data.monetization||[]).join('\n- ')}\n\nLaunch Plan:\n- ${(data.launch_plan||[]).join('\n- ')}\n`;
    const blob = new Blob([report],{type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url; link.download=`aegisforge-preview-${String(data.name||'concept').replace(/[^a-z0-9]/gi,'-').toLowerCase()}.txt`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

console.log('AegisForge AI - Ready!');
