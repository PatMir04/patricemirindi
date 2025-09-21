// assets/js/main.js
// ==========================================================================
// ENHANCED MAIN JAVASCRIPT FOR PATRICE MIRINDI PORTFOLIO
// ==========================================================================

// Global Variables
let isScrolling = false;
let scrollTimeout;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeInteractiveElements();
    initializeFormEnhancements();
    initializeChatWidget();
    initializeScrollEffects();
    initializeMagneticEffects();
    initializeAccessibility();
});

// ==========================================================================
// NAVIGATION ENHANCEMENTS
// ==========================================================================
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effects
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Add scrolled class
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let current = '';
            const navHeight = navbar.offsetHeight;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 50;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}` || 
                    (current === '' && item.getAttribute('href') === '#')) {
                    item.classList.add('active');
                }
            });
        }, 100);
    });
}

// ==========================================================================
// SCROLL ANIMATIONS
// ==========================================================================
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, parseFloat(delay) * 1000);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animateElements = document.querySelectorAll(
        '.animate-on-scroll, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Initialize typewriter effect
    initializeTypewriter();
    
    // Initialize counter animations
    initializeCounters();
}

function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let index = 0;
        const typeSpeed = 100;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, typeSpeed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRightColor = 
                        element.style.borderRightColor === 'transparent' ? 
                        'var(--primary-color)' : 'transparent';
                }, 500);
            }
        }
        
        // Start typing after element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(type, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-count'));
                animateNumber(entry.target, target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        countObserver.observe(counter);
    });
}

function animateNumber(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString();
        } else if (target % 1 !== 0) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ==========================================================================
// INTERACTIVE ELEMENTS
// ==========================================================================
function initializeInteractiveElements() {
    // Enhanced button effects
    initializeButtonEffects();
    
    // Card hover effects
    initializeCardEffects();
    
    // Filter functionality
    initializeFilters();
    
    // Modal functionality
    initializeModals();
    
    // Tooltip functionality
    initializeTooltips();
}

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeCardEffects() {
    const cards = document.querySelectorAll('.card, .expertise-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            filterItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = category === 'all' || 
                    (itemCategory && itemCategory.includes(category));
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, 100);
                } else {
                    item.classList.remove('animate');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on backdrop click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        let tooltip;
        
        element.addEventListener('mouseenter', () => {
            const text = element.getAttribute('data-tooltip');
            const position = element.getAttribute('data-tooltip-position') || 'top';
            
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: var(--white);
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let top, left;
            
            switch (position) {
                case 'top':
                    top = rect.top - tooltipRect.height - 10;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + 10;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - 10;
                    break;
                case 'right':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + 10;
                    break;
                default:
                    top = rect.top - tooltipRect.height - 10;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
            }
            
            tooltip.style.top = top + window.scrollY + 'px';
            tooltip.style.left = left + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 300);
            }
        });
    });
}

// ==========================================================================
// FORM ENHANCEMENTS
// ==========================================================================
function initializeFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', () => {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    label.classList.add('focused');
                }
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label && !input.value) {
                    label.classList.remove('focused');
                }
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', () => {
                validateField(input);
            });
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(form);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    let isValid = true;
    let message = '';
    
    if (required && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
    }
    
    updateFieldValidation(field, isValid, message);
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
}

function updateFieldValidation(field, isValid, message) {
    const container = field.parentElement;
    const existingError = container.querySelector('.field-error');
    
    if (!isValid) {
        field.classList.add('error');
        container.classList.add('error');
        
        if (!existingError) {
            const error = document.createElement('span');
            error.className = 'field-error';
            error.textContent = message;
            container.appendChild(error);
        } else {
            existingError.textContent = message;
        }
    } else {
        field.classList.remove('error');
        container.classList.remove('error');
        
        if (existingError) {
            existingError.remove();
        }
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    
    // Validate all fields
    const fields = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors before submitting', 'error');
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        form.reset();
        showNotification('Thank you! Your message has been sent successfully.', 'success');
    }, 2000);
}

// ==========================================================================
// CHAT WIDGET
// ==========================================================================
function initializeChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatToggle || !chatPanel) return;
    
    // Toggle chat panel
    chatToggle.addEventListener('click', () => {
        chatPanel.classList.toggle('active');
    });
    
    // Close chat panel
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatPanel.classList.remove('active');
        });
    }
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function addMessage(text, sender) {
        if (!chatMessages) return;
        
        const message = document.createElement('div');
        message.className = `message ${sender}-message`;
        message.innerHTML = `<p>${text}</p>`;
        
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function generateBotResponse(userMessage) {
        const responses = {
            'hello': 'Hello! How can I help you today?',
            'services': 'I offer data analytics, economic consulting, and project management services.',
            'experience': 'I have 8+ years of experience in data analytics and economic development.',
            'contact': 'You can reach me at patricemirindi@gmail.com or through the contact form.',
            'projects': 'I\'ve worked on financial resilience frameworks, agricultural development, and trade facilitation projects.',
            'skills': 'My core skills include R programming, Python, Stata, Power BI, and economic modeling.',
            'default': 'Thank you for your message. I\'ll get back to you soon!'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        
        for (const keyword in responses) {
            if (keyword !== 'default' && lowerMessage.includes(keyword)) {
                return responses[keyword];
            }
        }
        
        return responses.default;
    }
}

// ==========================================================================
// SCROLL EFFECTS
// ==========================================================================
function initializeScrollEffects() {
    // Reading progress bar
    const progressBar = document.getElementById('reading-progress') || 
                       document.querySelector('.reading-progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.pageYOffset / 
                (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        });
    }
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================================================
// MAGNETIC EFFECTS (DESKTOP ONLY)
// ==========================================================================
function initializeMagneticEffects() {
    if (window.innerWidth <= 768) return;
    
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = element.getAttribute('data-strength') || 0.1;
            
            element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// ==========================================================================
// ACCESSIBILITY
// ==========================================================================
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Skip to main content
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('main') || document.querySelector('#main');
            if (main) {
                main.focus();
                main.scrollIntoView();
            }
        });
    }
    
    // ARIA live announcements
    if (!document.querySelector('#aria-live-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'aria-live-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);
    }
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 
                    type === 'error' ? 'var(--danger)' : 
                    type === 'warning' ? 'var(--warning)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close
    setTimeout(() => {
        closeNotification(notification);
    }, duration);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

// ==========================================================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================================================
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// ERROR HANDLING
// ==========================================================================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Optionally send error reports to analytics
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Optionally send error reports to analytics
});

// Export functions for use in other files
window.PortfolioUtils = {
    showNotification,
    announceToScreenReader,
    debounce,
    throttle,
    animateNumber
};
