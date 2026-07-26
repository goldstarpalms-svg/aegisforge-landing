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
