/* ═══════════════════════════════════════════════════════════════
   Nova Dashboard — Phase 9 + Phase 13 (Motion)
   Spring physics, stagger orchestration, exit animations
   ═══════════════════════════════════════════════════════════════ */

const API = 'https://aegisforge-backend.onrender.com';

// ── Phase 13: Motion Engine ──────────────────
// Lightweight spring-physics animation (Framer Motion equivalent for vanilla JS)

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
        const from = key === 'opacity' ? parseFloat(getComputedStyle(el).opacity) :
                     key === 'scale' ? 1 :
                     key === 'y' ? parseFloat(getComputedStyle(el).transform?.match(/translateY\(([^)]+)\)/)?.[1] || 0) : 0;
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
            else if (key === 'x') transforms.x = spring.value;
        }
        if (transforms.scale || transforms.y || transforms.x) {
            const s = transforms.scale ?? 1;
            const y = transforms.y ?? 0;
            const x = transforms.x ?? 0;
            el.style.transform = `translateX(${x}px) translateY(${y}px) scale(${s})`;
        }
        if (!allDone) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// Staggered entrance — like Framer Motion's staggerChildren
function staggerIn(elements, config = {}) {
    const { stagger = 0.08, spring = {} } = config;
    elements.forEach((el, i) => {
        animateSpring(el, { opacity: 1, y: 0, scale: 1 }, { ...spring, delay: i * stagger });
    });
}

// Exit animation — fade + slide down
function animateOut(el, config = {}) {
    return new Promise(resolve => {
        const { duration = 200 } = config;
        el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px) scale(0.98)';
        setTimeout(() => { el.style.display = 'none'; resolve(); }, duration);
    });
}

// Card hover with spring
function initCardHover() {
    document.querySelectorAll('.dash-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            animateSpring(card, { scale: 1.02, y: -2 }, { stiffness: 300, damping: 20 });
        });
        card.addEventListener('mouseleave', () => {
            animateSpring(card, { scale: 1, y: 0 }, { stiffness: 300, damping: 20 });
        });
    });
}

// Button ripple effect
function initRipple() {
    document.querySelectorAll('.dash-prompt-btn, .dash-scan-btn').forEach(btn => {
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

// ── Dashboard Init ──────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDashboardPrompt();
    initDashScanner();
    initDashboardAnimations();
    initCardHover();
    initRipple();
    initDashCommandPalette();
    loadRecentScans();
});

// ════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════
function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    toggle?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
    // Active link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ════════════════════════════════════════════
// DASHBOARD ANIMATIONS (Phase 13)
// ════════════════════════════════════════════
function initDashboardAnimations() {
    // Staggered entrance for all .anim-dash elements
    const elements = document.querySelectorAll('.anim-dash');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.97)';
    });
    // Trigger after brief delay for page paint
    setTimeout(() => {
        staggerIn(Array.from(elements), { stagger: 0.1, spring: { stiffness: 200, damping: 18 } });
    }, 100);
}

// ════════════════════════════════════════════
// NOVA PROMPT (Dashboard)
// ════════════════════════════════════════════
function initDashboardPrompt() {
    const form = document.getElementById('dashPromptForm');
    const input = document.getElementById('dashPromptInput');

    // Hint chips
    document.querySelectorAll('.dash-hint').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.idea;
            input.focus();
            // Animate prompt expansion
            const inner = document.querySelector('.dash-prompt-inner');
            animateSpring(inner, { scale: 1.01 }, { stiffness: 400, damping: 25 });
            setTimeout(() => animateSpring(inner, { scale: 1 }, { stiffness: 400, damping: 25 }), 200);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idea = input.value.trim();
        if (idea.length < 3) return;
        await runNovaBuild(idea);
        // Add to recent projects
        addToRecentProjects(idea);
    });
}

function addToRecentProjects(idea) {
    const container = document.getElementById('recentProjects');
    const empty = container.querySelector('.dash-empty');
    if (empty) empty.remove();

    const item = document.createElement('div');
    item.className = 'dash-item';
    item.innerHTML = `
        <div class="dash-item-icon">◆</div>
        <div class="dash-item-content">
            <div class="dash-item-name">${idea.slice(0, 50)}${idea.length > 50 ? '...' : ''}</div>
            <div class="dash-item-meta">Blueprint · Just now</div>
        </div>
    `;
    container.prepend(item);
    // Animate in with spring
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px) scale(0.95)';
    setTimeout(() => {
        animateSpring(item, { opacity: 1, x: 0, scale: 1 }, { stiffness: 250, damping: 20 });
    }, 50);
}

// ════════════════════════════════════════════
// NOVA BUILD (shared logic)
// ════════════════════════════════════════════
async function runNovaBuild(idea) {
    const overlay = document.getElementById('novaBuildOverlay');
    const terminal = document.getElementById('novaBuildTerminal');
    const status = document.getElementById('novaBuildStatus');
    const pills = overlay.querySelectorAll('.nova-agent-pill');
    const result = document.getElementById('novaBuildResult');

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

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        status.textContent = step.text;
        pills.forEach(p => { if (p.dataset.agent === step.agent && !p.classList.contains('done')) p.classList.add('active'); });

        const line = document.createElement('div');
        line.className = 'terminal-step';
        line.innerHTML = `<span class="step-icon">${step.icon}</span>${step.text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        await sleep(step.delay);

        const agentLastStep = steps.slice(i + 1).findIndex(s => s.agent === step.agent);
        if (agentLastStep === -1) {
            pills.forEach(p => { if (p.dataset.agent === step.agent) { p.classList.remove('active'); p.classList.add('done'); } });
        }
    }

    // Call preview API
    status.textContent = 'Generating blueprint...';
    try {
        const res = await fetch(`${API}/preview/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, project_type: 'auto' })
        });
        const data = await res.json();
        if (data.success) {
            const line = document.createElement('div');
            line.className = 'terminal-step';
            line.innerHTML = '<span class="step-icon">✅</span>Blueprint generated.';
            terminal.appendChild(line);
            result.innerHTML = `
                <div class="result-title">${data.name} — ${data.tagline}</div>
                <div><strong>Roles:</strong> ${data.roles.join(', ')}</div>
                <div><strong>Features:</strong> ${data.features.slice(0, 5).join(', ')}</div>
            `;
            // Also add to blueprints
            const bpContainer = document.getElementById('recentBlueprints');
            const bpEmpty = bpContainer.querySelector('.dash-empty');
            if (bpEmpty) bpEmpty.remove();
            const bpItem = document.createElement('div');
            bpItem.className = 'dash-item';
            bpItem.innerHTML = `
                <div class="dash-item-icon">📋</div>
                <div class="dash-item-content">
                    <div class="dash-item-name">${data.name}</div>
                    <div class="dash-item-meta">${data.category} · Just now</div>
                </div>
            `;
            bpContainer.prepend(bpItem);
        }
    } catch (err) {
        const line = document.createElement('div');
        line.className = 'terminal-step';
        line.innerHTML = '<span class="step-icon">✅</span>Nova build complete.';
        terminal.appendChild(line);
    }

    status.textContent = 'Build complete';
    setTimeout(() => overlay.classList.remove('active'), 4000);
    overlay.addEventListener('click', function h(e) { if (e.target === overlay) { overlay.classList.remove('active'); overlay.removeEventListener('click', h); } });
}

// ════════════════════════════════════════════
// QUICK SCANNER (Dashboard)
// ════════════════════════════════════════════
function initDashScanner() {
    const form = document.getElementById('dashScanForm');
    const input = document.getElementById('dashScanInput');
    const result = document.getElementById('dashScanResult');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = input.value.trim();
        if (!url) return;
        result.classList.add('hidden');
        result.innerHTML = '<div class="skeleton skeleton-block"></div>';
        result.classList.remove('hidden');

        try {
            const res = await fetch(`${API}/quick-scan`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            const score = data.risk_score?.score ?? 0;
            const grade = data.risk_score?.grade ?? '—';
            const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';

            result.innerHTML = `
                <div class="dash-scan-score">
                    <span class="dash-scan-number" style="color:${color}">${score}</span>
                    <span class="dash-scan-grade" style="color:${color}">${grade}</span>
                    <span class="dash-scan-label">Security Score</span>
                </div>
            `;
            result.classList.remove('hidden');
            // Add to recent scans
            addToRecentScans(url, score, grade);
        } catch (err) {
            result.innerHTML = '<div style="color:var(--red);font-size:13px">Scan failed. Try again.</div>';
            result.classList.remove('hidden');
        }
    });
}

function addToRecentScans(url, score, grade) {
    const container = document.getElementById('recentScans');
    const skel = container.querySelector('.skeleton');
    if (skel) skel.remove();
    const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
    const item = document.createElement('div');
    item.className = 'dash-item';
    item.innerHTML = `
        <div class="dash-item-icon">🛡</div>
        <div class="dash-item-content">
            <div class="dash-item-name">${url.replace(/https?:\/\//, '').slice(0, 30)}</div>
            <div class="dash-item-meta"><span style="color:${color};font-weight:600">${score}/100 (${grade})</span> · Just now</div>
        </div>
    `;
    container.prepend(item);
}

async function loadRecentScans() {
    // Best-effort: try loading scan history
    const container = document.getElementById('recentScans');
    try {
        const res = await fetch(`${API}/waitlist/stats`);
        // If API reachable, show skeleton then replace
    } catch (e) {
        // API unreachable (free tier sleeping) — show empty state
        const skel = container.querySelector('.skeleton');
        if (skel) skel.replaceWith(Object.assign(document.createElement('div'), { className: 'dash-empty', textContent: 'Run a quick scan to see results here.' }));
    }
}

// ════════════════════════════════════════════
// COMMAND PALETTE (Dashboard)
// ════════════════════════════════════════════
function initDashCommandPalette() {
    const palette = document.getElementById('cmdPalette');
    const cmdInput = document.getElementById('cmdInput');
    const cmdList = document.getElementById('cmdList');
    const cmdBtn = document.getElementById('dashCmd');
    let selectedIdx = 0;

    const COMMANDS = [
        { label: 'New Nova prompt', action: () => document.getElementById('dashPromptInput')?.focus(), kbd: 'N' },
        { label: 'Quick scan', action: () => document.getElementById('dashScanInput')?.focus(), kbd: 'S' },
        { label: 'Go to Home', action: () => { document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active')); document.querySelector('[data-page="home"]')?.classList.add('active'); } },
        { label: 'Go to Security', action: () => { document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active')); document.querySelector('[data-page="security"]')?.classList.add('active'); } },
        { label: 'Open API docs', action: () => window.open(`${API}/docs`, '_blank'), kbd: 'D' },
        { label: 'Back to landing page', action: () => window.location.href = 'index.html' },
    ];

    function open() { palette.classList.add('active'); cmdInput.value = ''; renderList(''); cmdInput.focus(); selectedIdx = 0; }
    function close() { palette.classList.remove('active'); }

    function renderList(q) {
        const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
        cmdList.innerHTML = filtered.map((c, i) => `
            <div class="cmd-palette-item${i === selectedIdx ? ' selected' : ''}" data-idx="${i}">${c.label}${c.kbd ? `<kbd>${c.kbd}</kbd>` : ''}</div>
        `).join('');
        cmdList.querySelectorAll('.cmd-palette-item').forEach(el => {
            el.addEventListener('click', () => { COMMANDS[el.dataset.idx]?.action(); close(); });
        });
    }

    cmdBtn?.addEventListener('click', open);
    cmdInput?.addEventListener('input', () => { selectedIdx = 0; renderList(cmdInput.value); });
    cmdInput?.addEventListener('keydown', (e) => {
        const items = cmdList.querySelectorAll('.cmd-palette-item');
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, items.length - 1); renderList(cmdInput.value); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); renderList(cmdInput.value); }
        else if (e.key === 'Enter') { e.preventDefault(); items[selectedIdx]?.click(); }
        else if (e.key === 'Escape') { close(); }
    });
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); palette.classList.contains('active') ? close() : open(); }
        if (e.key === 'Escape' && palette.classList.contains('active')) close();
    });
    palette.addEventListener('click', (e) => { if (e.target === palette) close(); });
}

// ── Utility ──
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
