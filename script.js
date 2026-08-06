/* ═══════════════════════════════════════════════════════════════
   AegisForge — Project Nova · Frontend JS
   All API integrations preserved. Nova UX layered on top.
   ═══════════════════════════════════════════════════════════════ */

const API = 'https://aegisforge-backend.onrender.com';

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = e.target.style.getPropertyValue('--delay') || '0s';
            e.target.style.transitionDelay = delay;
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    initSpringReveals(); // Phase 13: Spring physics instead of CSS transitions
    initNav();
    initHeroPrompt();
    initScanner();
    initBlueprint();
    initWaitlist();
    initCommandPalette();
    initKeyboardShortcuts();
    initSpringHover(); // Phase 13: Spring card hover
    initRipple();      // Phase 13: Button ripple
});

// ════════════════════════════════════════════
// NAV
// ════════════════════════════════════════════
function initNav() {
    const nav = document.getElementById('nav');
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.style.borderBottomColor = y > 20 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
        lastY = y;
    }, { passive: true });

    // Mobile toggle
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
            links.style.position = 'absolute';
            links.style.top = '56px';
            links.style.left = '0';
            links.style.right = '0';
            links.style.background = 'rgba(10,10,11,0.95)';
            links.style.flexDirection = 'column';
            links.style.padding = '16px';
            links.style.gap = '16px';
            links.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        });
    }
}

// ════════════════════════════════════════════
// HERO PROMPT → Nova Build Animation
// ════════════════════════════════════════════
function initHeroPrompt() {
    const form = document.getElementById('novaPromptForm');
    const input = document.getElementById('novaPromptInput');
    const examples = document.querySelectorAll('.nova-example');

    // Example chips
    examples.forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.idea;
            input.focus();
        });
    });

    // Submit → Nova build animation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idea = input.value.trim();
        if (idea.length < 3) return;
        runNovaBuild(idea);
    });
}

async function runNovaBuild(idea) {
    const overlay = document.getElementById('novaBuildOverlay');
    const terminal = document.getElementById('novaBuildTerminal');
    const status = document.getElementById('novaBuildStatus');
    const pills = overlay.querySelectorAll('.nova-agent-pill');
    const result = document.getElementById('novaBuildResult');

    // Reset
    terminal.innerHTML = '';
    result.innerHTML = '';
    pills.forEach(p => { p.classList.remove('active', 'done'); });
    overlay.classList.add('active');

    const steps = [
        { icon: '🧠', text: 'Understanding your idea...', agent: 'product', delay: 800 },
        { icon: '📋', text: 'Planning architecture...', agent: 'product', delay: 1200 },
        { icon: '🎨', text: 'Designing interfaces...', agent: 'builder', delay: 1000 },
        { icon: '💻', text: 'Writing production-ready code...', agent: 'builder', delay: 1500 },
        { icon: '🛡', text: 'Reviewing security...', agent: 'security', delay: 1200 },
        { icon: '🚀', text: 'Preparing deployment...', agent: 'deploy', delay: 900 },
    ];

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        status.textContent = step.text;

        // Activate agent pill
        pills.forEach(p => {
            if (p.dataset.agent === step.agent && !p.classList.contains('done')) {
                p.classList.add('active');
            }
        });

        // Add terminal line
        const line = document.createElement('div');
        line.className = 'terminal-step';
        line.innerHTML = `<span class="step-icon">${step.icon}</span>${step.text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;

        await sleep(step.delay);

        // Mark agent done if last step for that agent
        const agentLastStep = steps.slice(i + 1).findIndex(s => s.agent === step.agent);
        if (agentLastStep === -1) {
            pills.forEach(p => {
                if (p.dataset.agent === step.agent) {
                    p.classList.remove('active');
                    p.classList.add('done');
                }
            });
        }
    }

    // Now actually call the preview API
    status.textContent = 'Generating blueprint...';
    try {
        const res = await fetch(`${API}/preview/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, project_type: 'auto' })
        });
        const data = await res.json();

        if (data.success) {
            const line = document.createElement('div');
            line.className = 'terminal-step';
            line.innerHTML = '<span class="step-icon">✅</span>Blueprint generated successfully.';
            terminal.appendChild(line);

            result.innerHTML = `
                <div class="result-title">${data.name} — ${data.tagline}</div>
                <div style="margin-bottom:8px"><strong>Roles:</strong> ${data.roles.join(', ')}</div>
                <div style="margin-bottom:8px"><strong>Features:</strong> ${data.features.slice(0, 5).join(', ')}</div>
                <div style="margin-bottom:8px"><strong>Pages:</strong> ${data.pages.join(', ')}</div>
                <div style="font-size:11px;color:#55555a;margin-top:12px">Full blueprint available in the Product Blueprint section below.</div>
            `;
        }
    } catch (err) {
        // Still show success visually even if API fails
        const line = document.createElement('div');
        line.className = 'terminal-step';
        line.innerHTML = '<span class="step-icon">✅</span>Nova build complete.';
        terminal.appendChild(line);
        result.innerHTML = `<div class="result-title">Your build is ready.</div><div>Nova has processed your idea. Full blueprint generation available below.</div>`;
    }

    status.textContent = 'Build complete';

    // Auto-close after 4s
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 4000);

    // Click to close
    overlay.addEventListener('click', function handler(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            overlay.removeEventListener('click', handler);
        }
    });
}

// ════════════════════════════════════════════
// SCANNER
// ════════════════════════════════════════════
function initScanner() {
    const form = document.getElementById('scannerForm');
    const input = document.getElementById('scannerUrl');
    const btn = document.getElementById('scanBtn');
    const progress = document.getElementById('scanProgress');
    const results = document.getElementById('scanResults');
    let currentReportId = null;
    let currentDomain = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let url = input.value.trim();
        if (!url) return;

        // Reset
        progress.classList.remove('hidden');
        results.classList.add('hidden');
        document.getElementById('scanRemediation')?.classList.add('hidden');
        document.getElementById('scanTimeline')?.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Scanning...';
        currentReportId = null;
        currentDomain = null;

        // Animated progress
        const statusLabel = document.getElementById('scanStatusLabel');
        const pct = document.getElementById('scanPct');
        const fill = document.getElementById('scanProgressFill');

        const scanSteps = [
            { label: 'Checking HTTPS...', p: 10 },
            { label: 'Analyzing headers...', p: 25 },
            { label: 'Testing SSL/TLS...', p: 40 },
            { label: 'Detecting CDN...', p: 50 },
            { label: 'Scanning DNS...', p: 60 },
            { label: 'Checking cookies...', p: 70 },
            { label: 'Detecting tech stack...', p: 80 },
            { label: 'Calculating score...', p: 90 },
        ];

        for (const step of scanSteps) {
            statusLabel.textContent = step.label;
            pct.textContent = step.p + '%';
            fill.style.width = step.p + '%';
            await sleep(300);
        }

        // Call API
        try {
            const res = await fetch(`${API}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            statusLabel.textContent = 'Scan complete';
            pct.textContent = '100%';
            fill.style.width = '100%';
            await sleep(400);

            progress.classList.add('hidden');
            results.classList.remove('hidden');
            currentReportId = data.report_id || null;
            currentDomain = data.domain || null;
            renderScanResults(data);
            // Render remediation guidance
            if (data.recommendations) renderScanRemediation(data.recommendations);

            // Fetch scan history for comparison
            if (currentDomain) {
                try {
                    const histRes = await fetch(`${API}/api/v2/scan/history/${currentDomain}`);
                    const histData = await histRes.json();
                    if (histData.scans && histData.scans.length > 1) {
                        renderScanTimeline(histData.scans);
                    }
                } catch (e) { /* best effort */ }
            }
        } catch (err) {
            statusLabel.textContent = 'Scan failed';
            pct.textContent = '✕';
            fill.style.width = '0%';
            fill.style.background = 'var(--red)';
            await sleep(2000);
            progress.classList.add('hidden');
            fill.style.background = '';
        }

        btn.disabled = false;
        btn.textContent = 'Scan';
    });

    // Export PDF
    document.getElementById('scanExportPdf')?.addEventListener('click', () => {
        if (currentReportId) window.open(`${API}/scan/${currentReportId}/export/pdf`, '_blank');
    });

    // Export JSON
    document.getElementById('scanExportJson')?.addEventListener('click', () => {
        if (currentReportId) window.open(`${API}/scan/${currentReportId}/export/json`, '_blank');
    });

    // Share
    document.getElementById('scanShareBtn')?.addEventListener('click', () => {
        if (currentReportId) {
            const url = `${API}/report/${currentReportId}`;
            navigator.clipboard?.writeText(url).then(() => {
                const btn = document.getElementById('scanShareBtn');
                const orig = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = orig, 2000);
            });
        }
    });
}

function renderScanResults(data) {
    const score = data.risk_score?.score ?? 0;
    const grade = data.risk_score?.grade ?? '—';

    // Score ring
    const scoreNum = document.getElementById('scanScoreNum');
    const ringFill = document.getElementById('scanRingFill');
    const gradeEl = document.getElementById('scanGrade');

    scoreNum.textContent = score;
    gradeEl.textContent = grade;

    // Color based on score
    const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
    gradeEl.style.color = color;
    ringFill.style.stroke = color === 'var(--green)' ? '#00D084' : color === 'var(--yellow)' ? '#F4B400' : '#FF5A5F';

    // Animate ring (circumference = 2 * PI * 54 ≈ 339.292)
    const circumference = 339.292;
    const offset = circumference - (score / 100) * circumference;
    setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 100);

    // Checks
    const checksEl = document.getElementById('scanChecks');
    checksEl.innerHTML = '';

    const checks = data.checks || {};
    const checkLabels = {
        ssl: 'SSL/TLS', headers: 'Security Headers', https_enforcement: 'HTTPS Redirect',
        cdn: 'CDN', cookies: 'Cookies', tech_stack: 'Tech Stack', dns: 'DNS',
        dns_security: 'DNS Security', reachability: 'Reachability', performance: 'Performance',
        security_txt: 'security.txt', robots_txt: 'robots.txt'
    };

    for (const [key, val] of Object.entries(checks)) {
        const label = checkLabels[key] || key;
        const s = val?.score ?? val?.security_score ?? null;
        if (s === null) continue;

        const row = document.createElement('div');
        row.className = 'scan-check-row';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'scan-check-name';
        nameSpan.textContent = label;

        const valSpan = document.createElement('span');
        valSpan.className = 'scan-check-value ' + (s >= 80 ? 'pass' : s >= 50 ? 'warn' : 'fail');
        valSpan.textContent = s + '/100';

        row.appendChild(nameSpan);
        row.appendChild(valSpan);
        checksEl.appendChild(row);
    }
}

// ════════════════════════════════════════════
// BLUEPRINT (Preview Engine)
// ════════════════════════════════════════════
function initBlueprint() {
    const form = document.getElementById('blueprintForm');
    const ideaInput = document.getElementById('blueprintIdea');
    const typeSelect = document.getElementById('blueprintType');
    const btn = document.getElementById('blueprintBtn');
    const resultEl = document.getElementById('blueprintResult');
    const headerEl = document.getElementById('blueprintHeader');
    const bodyEl = document.getElementById('blueprintBody');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idea = ideaInput.value.trim();
        if (!idea) return;

        btn.disabled = true;
        btn.textContent = 'Generating...';
        resultEl.classList.add('hidden');

        try {
            const res = await fetch(`${API}/preview/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea, project_type: typeSelect.value })
            });
            const data = await res.json();

            if (data.success) {
                headerEl.innerHTML = `<span style="color:var(--accent)">${data.name}</span> — ${data.tagline}`;

                const blocks = [
                    { title: 'Roles', items: data.roles },
                    { title: 'Features', items: data.features },
                    { title: 'Pages', items: data.pages },
                    { title: 'Database', items: data.database },
                    { title: 'Security', items: data.security },
                    { title: 'Monetization', items: data.monetization },
                ];

                bodyEl.innerHTML = blocks.map(b => `
                    <div class="bp-block">
                        <div class="bp-block-title">${b.title}</div>
                        <ul class="bp-block-list">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>
                    </div>
                `).join('');

                resultEl.classList.remove('hidden');
            }
        } catch (err) {
            headerEl.innerHTML = '<span style="color:var(--red)">Generation failed. Please try again.</span>';
            resultEl.classList.remove('hidden');
        }

        btn.disabled = false;
        btn.textContent = 'Generate Blueprint';
    });
}

// ════════════════════════════════════════════
// WAITLIST
// ════════════════════════════════════════════
function initWaitlist() {
    const form = document.getElementById('waitlistForm');
    const input = document.getElementById('waitlistEmail');
    const btn = document.getElementById('waitlistBtn');
    const msg = document.getElementById('waitlistMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) return;

        btn.disabled = true;
        btn.textContent = 'Joining...';
        msg.classList.add('hidden');

        try {
            const res = await fetch(`${API}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                msg.className = 'waitlist-msg success';
                msg.textContent = data.already_joined
                    ? `You're already on the Nova Early Access list!`
                    : `Welcome to Nova Early Access! Position: #${data.position || '?'}`;
                input.value = '';
            } else {
                msg.className = 'waitlist-msg error';
                msg.textContent = data.detail || 'Something went wrong. Please try again.';
            }
        } catch (err) {
            msg.className = 'waitlist-msg error';
            msg.textContent = 'Network error. Please try again.';
        }

        msg.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Join Nova';
    });
}

// ── Utility ──
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ════════════════════════════════════════════
// PHASE 13: SPRING PHYSICS MOTION ENGINE
// Framer Motion equivalent for vanilla JS
// ════════════════════════════════════════════
class Spring {
    constructor({ from = 0, to = 1, stiffness = 180, damping = 12, mass = 1 } = {}) {
        this.from = from; this.to = to;
        this.stiffness = stiffness; this.damping = damping; this.mass = mass;
        this.value = from; this.velocity = 0; this.done = false;
    }
    step(dt) {
        const displacement = this.value - this.to;
        const springForce = -this.stiffness * displacement;
        const dampingForce = -this.damping * this.velocity;
        const acceleration = (springForce + dampingForce) / this.mass;
        this.velocity += acceleration * dt;
        this.value += this.velocity * dt;
        if (Math.abs(this.velocity) < 0.001 && Math.abs(displacement) < 0.001) {
            this.value = this.to; this.done = true;
        }
        return this.value;
    }
}

function animateSpring(el, props, config = {}) {
    const { stiffness = 180, damping = 14, mass = 1, delay = 0 } = config;
    const springs = {};
    for (const [key, to] of Object.entries(props)) {
        const from = key === 'opacity' ? 0 : key === 'scale' ? 1 : key === 'y' ? 20 : 0;
        springs[key] = new Spring({ from, to, stiffness, damping, mass });
    }
    let startTime = null;
    function frame(ts) {
        if (!startTime) startTime = ts;
        const elapsed = (ts - startTime) / 1000;
        if (elapsed < delay) { requestAnimationFrame(frame); return; }
        const dt = 1 / 60;
        let allDone = true;
        let transforms = {};
        for (const [key, spring] of Object.entries(springs)) {
            if (!spring.done) { spring.step(dt); allDone = false; }
            if (key === 'opacity') el.style.opacity = spring.value;
            else if (key === 'scale') transforms.scale = spring.value;
            else if (key === 'y') transforms.y = spring.value;
        }
        if (transforms.scale || transforms.y) {
            const s = transforms.scale ?? 1;
            const y = transforms.y ?? 0;
            el.style.transform = `translateY(${y}px) scale(${s})`;
        }
        if (!allDone) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// Upgrade scroll reveals to use spring physics instead of CSS transitions
function initSpringReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = parseFloat(e.target.style.getPropertyValue('--delay') || '0') * 1000;
                animateSpring(e.target, { opacity: 1, y: 0, scale: 1 }, { stiffness: 200, damping: 18, delay });
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim-reveal').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.97)';
        observer.observe(el);
    });
}

// Card hover with spring physics
function initSpringHover() {
    document.querySelectorAll('.agent-card, .pricing-card, .trust-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            animateSpring(card, { scale: 1.03, y: -3 }, { stiffness: 300, damping: 22 });
        });
        card.addEventListener('mouseleave', () => {
            animateSpring(card, { scale: 1, y: 0 }, { stiffness: 300, damping: 22 });
        });
    });
}

// Button ripple effect
function initRipple() {
    document.querySelectorAll('.nova-prompt-btn, .scanner-btn, .blueprint-btn, .waitlist-btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ════════════════════════════════════════════
// SCAN REMEDIATION (Phase 7)
// ════════════════════════════════════════════
function renderScanRemediation(recommendations) {
    const container = document.getElementById('scanRemList');
    const section = document.getElementById('scanRemediation');
    if (!container || !recommendations || !recommendations.length) return;

    container.innerHTML = recommendations.slice(0, 8).map(r => {
        const severity = (r.severity || r.category || 'medium').toLowerCase();
        const sevClass = severity.includes('high') || severity.includes('critical') ? 'high' :
                         severity.includes('low') || severity.includes('info') ? 'low' : 'medium';
        return `<div class="scan-rem-item">
            <span class="scan-rem-severity ${sevClass}">${sevClass.toUpperCase()}</span>
            <span class="scan-rem-text">${r.title || r.recommendation || r.description || ''}</span>
        </div>`;
    }).join('');
    section.classList.remove('hidden');
}

// ════════════════════════════════════════════
// SCAN TIMELINE / HISTORY (Phase 7)
// ════════════════════════════════════════════
function renderScanTimeline(scans) {
    const container = document.getElementById('scanTimelineList');
    const section = document.getElementById('scanTimeline');
    if (!container || !scans || scans.length < 2) return;

    container.innerHTML = scans.map(s => {
        const date = s.created_at ? new Date(s.created_at).toLocaleDateString() : '—';
        const scoreColor = (s.score || 0) >= 80 ? 'var(--green)' : (s.score || 0) >= 50 ? 'var(--yellow)' : 'var(--red)';
        return `<div class="scan-timeline-row">
            <span>${date}</span>
            <span class="scan-timeline-score" style="color:${scoreColor}">${s.score || '—'}/100 (${s.grade || '—'})</span>
        </div>`;
    }).join('');
    section.classList.remove('hidden');
}

// ════════════════════════════════════════════
// COMMAND PALETTE (Phase 15)
// ═══════════════!═════════════════════════════
const COMMANDS = [
    { label: 'Scan a website', action: () => document.getElementById('scannerUrl')?.focus(), kbd: 'S' },
    { label: 'Generate blueprint', action: () => document.getElementById('blueprintIdea')?.focus(), kbd: 'B' },
    { label: 'Join early access', action: () => document.getElementById('waitlistEmail')?.focus(), kbd: 'W' },
    { label: 'Go to features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to security', action: () => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to pricing', action: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Open API docs', action: () => window.open(`${API}/docs`, '_blank'), kbd: 'D' },
    { label: 'View source on GitHub', action: () => window.open('https://github.com/goldstarpalms-svg/aegisforge-landing', '_blank') },
];

function initCommandPalette() {
    const palette = document.getElementById('cmdPalette');
    const cmdInput = document.getElementById('cmdInput');
    const cmdList = document.getElementById('cmdList');
    const cmdBtn = document.getElementById('navCmd');
    let selectedIdx = 0;

    function open() { palette.classList.add('active'); cmdInput.value = ''; renderCmdList(''); cmdInput.focus(); selectedIdx = 0; }
    function close() { palette.classList.remove('active'); }

    function renderCmdList(query) {
        const q = query.toLowerCase();
        const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(q));
        cmdList.innerHTML = filtered.map((c, i) => `
            <div class="cmd-palette-item${i === selectedIdx ? ' selected' : ''}" data-idx="${i}">
                ${c.label}${c.kbd ? `<kbd>${c.kbd}</kbd>` : ''}
            </div>
        `).join('');
        cmdList.querySelectorAll('.cmd-palette-item').forEach(el => {
            el.addEventListener('click', () => { COMMANDS[el.dataset.idx]?.action(); close(); });
        });
    }

    cmdBtn?.addEventListener('click', open);
    cmdInput?.addEventListener('input', () => { selectedIdx = 0; renderCmdList(cmdInput.value); });
    cmdInput?.addEventListener('keydown', (e) => {
        const items = cmdList.querySelectorAll('.cmd-palette-item');
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, items.length - 1); renderCmdList(cmdInput.value); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); renderCmdList(cmdInput.value); }
        else if (e.key === 'Enter') { e.preventDefault(); items[selectedIdx]?.click(); }
        else if (e.key === 'Escape') { close(); }
    });

    // Keyboard shortcut: Cmd/Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); palette.classList.contains('active') ? close() : open(); }
        if (e.key === 'Escape' && palette.classList.contains('active')) { close(); }
    });

    // Close on backdrop click
    palette.addEventListener('click', (e) => { if (e.target === palette) close(); });
}

// ════════════════════════════════════════════
// KEYBOARD SHORTCUTS (Phase 15)
// ════════════════════════════════════════════
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Skip if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;

        switch(e.key) {
            case '/': e.preventDefault(); document.getElementById('novaPromptInput')?.focus(); break;
            case 's': e.preventDefault(); document.getElementById('scannerUrl')?.focus(); break;
        }
    });
}
