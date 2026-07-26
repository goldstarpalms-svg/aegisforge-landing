// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Waitlist form handling
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

waitlistForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!isValidEmail(email)) {
        showMessage('❌ Please enter a valid email address.', 'error');
        return;
    }
    
    // Save email to localStorage (temporary solution)
    saveEmail(email);
    
    // Show success message
    showMessage('✅ You\'re on the list! We\'ll be in touch soon.', 'success');
    
    // Clear input
    emailInput.value = '';
    
    // Log to console (for now)
    console.log('New waitlist signup:', email);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveEmail(email) {
    let emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
    if (!emails.includes(email)) {
        emails.push({
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('waitlistEmails', JSON.stringify(emails));
    }
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.color = type === 'success' ? '#00ffc8' : '#ff4757';
    formMessage.style.fontWeight = '600';
    
    setTimeout(() => {
        formMessage.textContent = '🔒 We respect your privacy. No spam, ever.';
        formMessage.style.color = '#a0a0b0';
        formMessage.style.fontWeight = 'normal';
    }, 5000);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Console welcome message
console.log('%c⚡ AegisForge AI', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00ffc8, #00a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cBuilding the future of secure software.', 'font-size: 14px; color: #00ffc8;');
console.log('%cInterested in joining our team? Contact us!', 'font-size: 12px; color: #a0a0b0;');
