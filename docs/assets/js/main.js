/* ==========================================================================
   PATRICE MIRINDI PORTFOLIO - MAIN JAVASCRIPT
   ==========================================================================
   Professional Portfolio Interactive Features
   ========================================================================== */

(function() {
    'use strict';

    // ==========================================================================
    // GLOBAL VARIABLES
    // ==========================================================================
    let isScrolling = false;
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        initializeAllFeatures();
    });

    function initializeAllFeatures() {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initCounters();
        initProgressBars();
        initTooltips();
        initMobileMenu();
        initSmoothScrolling();
        initContactForm();
        initFAQToggles();
        initProjectFilters();
        initReadingProgress();
        initSkillBars();
        initTestimonialCarousel();
        initPerformanceOptimizations();
        
        console.log('Portfolio initialized successfully');
    }

    // ==========================================================================
    // NAVIGATION
    // ==========================================================================
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        // Navbar scroll effect
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 16));

        // Active navigation highlighting
        window.addEventListener('scroll', throttle(updateActiveNavigation, 16));

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close mobile menu when clicking nav link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    function updateActiveNavigation() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current !== currentSection) {
            currentSection = current;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || 
                    (current === '' && link.getAttribute('href') === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ==========================================================================
    // READING PROGRESS BAR
    // ==========================================================================
    function initReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', throttle(function() {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
        }, 16));
    }

    // ==========================================================================
    // SCROLL ANIMATIONS
    // ==========================================================================
    function initScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Special handling for counters
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                    
                    // Special handling for progress bars
                    if (entry.target.classList.contains('skill-progress')) {
                        animateProgressBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.animate-fade-in, .animate-slide-left, .animate-slide-right, ' +
            '.card, .expertise-card, .project-card, .timeline-item, ' +
            '.stat-number, .skill-progress'
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    function initAnimations() {
        // Add animation classes to elements
        const cards = document.querySelectorAll('.card, .expertise-card, .project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.transitionDelay = `${index * 0.2}s`;
        });
    }

    // ==========================================================================
    // COUNTERS & PROGRESS BARS
    // ==========================================================================
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
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
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill, .skill-progress');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transform = 'scaleX(1)';
                        entry.target.style.transformOrigin = 'left';
                    }, 200);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => {
            bar.style.transform = 'scaleX(0)';
            bar.style.transition = 'transform 1.5s ease-in-out';
            progressObserver.observe(bar);
        });
    }

    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    function animateProgressBar(element) {
        const width = element.style.width || element.getAttribute('data-width');
        element.style.width = '0%';
        setTimeout(() => {
            element.style.width = width;
        }, 200);
    }

    // ==========================================================================
    // MOBILE MENU
    // ==========================================================================
    function initMobileMenu() {
        const mobileMenuButton = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.nav-menu');

        if (!mobileMenuButton || !mobileMenu) return;

        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update ARIA attributes
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });

        // Close menu when clicking on menu items
        const menuItems = mobileMenu.querySelectorAll('.nav-link');
        menuItems.forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        function closeMobileMenu() {
            mobileMenuButton.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }

    // ==========================================================================
    // SMOOTH SCROLLING
    // ==========================================================================
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // TOOLTIPS
    // ==========================================================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });

        function showTooltip(e) {
            const text = e.target.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

            e.target._tooltip = tooltip;
        }

        function hideTooltip(e) {
            if (e.target._tooltip) {
                e.target._tooltip.remove();
                e.target._tooltip = null;
            }
        }
    }

    // ==========================================================================
    // CONTACT FORM
    // ==========================================================================
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', handleContactFormSubmit);

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    function handleContactFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset button state
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: data['project-type'] || 'unknown'
                });
            }
        }, 2000);
    }

    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let errorMessage = '';
        
        // Clear previous errors
        clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (fieldType === 'email' && value && !isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
        }
        // Phone validation
        else if (fieldType === 'tel' && value && !isValidPhone(value)) {
            errorMessage = 'Please enter a valid phone number';
        }
        
        if (errorMessage) {
            showFieldError(field, errorMessage);
            return false;
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // ==========================================================================
    // FAQ TOGGLES
    // ==========================================================================
    function initFAQToggles() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle i');
            
            if (question && answer && toggle) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    
                    // Close all other FAQs
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherToggle = otherItem.querySelector('.faq-toggle i');
                            if (otherToggle) {
                                otherToggle.classList.remove('fa-minus');
                                otherToggle.classList.add('fa-plus');
                            }
                        }
                    });
                    
                    // Toggle current FAQ
                    if (isOpen) {
                        item.classList.remove('active');
                        toggle.classList.remove('fa-minus');
                        toggle.classList.add('fa-plus');
                    } else {
                        item.classList.add('active');
                        toggle.classList.remove('fa-plus');
                        toggle.classList.add('fa-minus');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // PROJECT FILTERS
    // ==========================================================================
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                const category = button.getAttribute('data-category');
                
                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-category');
                    
                    if (category === 'all' || cardCategories.includes(category)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // TESTIMONIAL CAROUSEL
    // ==========================================================================
    function initTestimonialCarousel() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;

        const testimonials = carousel.querySelectorAll('.testimonial-item');
        let currentIndex = 0;

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }

        // Auto-rotate testimonials
        setInterval(nextTestimonial, 5000);

        // Initialize first testimonial
        if (testimonials.length > 0) {
            showTestimonial(0);
        }
    }

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================
    function initPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        preloadCriticalResources();
    }

    function preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/style.css',
            '/assets/js/tawk-enhanced.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: getNotificationColor(type),
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        const content = notification.querySelector('.notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        });

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginLeft: 'auto'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Close button handler
        closeBtn.addEventListener('click', () => closeNotification(notification));

        // Auto close
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, duration);
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    // ==========================================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================================================
    function initAccessibilityFeatures() {
        // Focus management
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
    }

    // ==========================================================================
    // ANALYTICS & TRACKING
    // ==========================================================================
    function initAnalytics() {
        // Track page interactions
        document.addEventListener('click', function(e) {
            const target = e.target;
            
            // Track button clicks
            if (target.classList.contains('btn')) {
                trackEvent('button_click', {
                    button_text: target.textContent.trim(),
                    page_url: window.location.href
                });
            }
            
            // Track external links
            if (target.tagName === 'A' && target.hostname !== window.location.hostname) {
                trackEvent('external_link_click', {
                    url: target.href,
                    text: target.textContent.trim()
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', throttle(function() {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    trackEvent('scroll_depth', {
                        percent: maxScroll
                    });
                }
            }
        }, 1000));
    }

    function trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Console log for debugging
        console.log('Event tracked:', eventName, parameters);
    }

    // ==========================================================================
    // ERROR HANDLING
    // ==========================================================================
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // Track error if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error.toString(),
                fatal: false
            });
        }
    });

    // ==========================================================================
    // EXPORT FOR TESTING
    // ==========================================================================
    window.PortfolioJS = {
        showNotification,
        validateEmail: isValidEmail,
        validatePhone: isValidPhone,
        throttle,
        debounce
    };

})();
