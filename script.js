const SUPABASE_URL = 'https://rxwtjoibzaskkmxintzw.supabase.co';
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
