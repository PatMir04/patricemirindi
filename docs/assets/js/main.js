// ==========================================================================
// NAVIGATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ==========================================================================
    // ANIMATIONS & EFFECTS
    // ==========================================================================

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.expertise-card, .highlight-card, .skill-item, .experience-item, .project-card, .value-item, .accomplishment-item').forEach(el => {
        observer.observe(el);
    });

    // ==========================================================================
    // FORM ENHANCEMENTS
    // ==========================================================================

    // Character counter for textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const charCounter = document.querySelector('.char-counter');
        if (charCounter) {
            messageTextarea.addEventListener('input', function() {
                const currentLength = this.value.length;
                const maxLength = 1000;
                charCounter.textContent = `${currentLength} / ${maxLength} characters`;

                if (currentLength > maxLength * 0.9) {
                    charCounter.style.color = '#DC3545';
                } else {
                    charCounter.style.color = '#6C757D';
                }
            });
        }
    }

    // ==========================================================================
    // UTILITIES
    // ==========================================================================

    // Add loading states to buttons
    function addButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;

        return function() {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    // Show/hide elements with animation
    function slideDown(element, duration = 300) {
        element.style.display = 'block';
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.height = element.scrollHeight + 'px';
        }, 10);

        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
    }

    function slideUp(element, duration = 300) {
        element.style.height = element.offsetHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.height = '0px';
        }, 10);

        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
    }

    // Make these functions available globally
    window.PatriceUtils = {
        addButtonLoading,
        slideDown,
        slideUp
    };

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Debounce function for performance
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

    // Throttle function for scroll events
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
        }
    }

    // Make utility functions available globally
    window.PatriceUtils = {
        ...window.PatriceUtils,
        debounce,
        throttle
    };

    // ==========================================================================
    // SKILL PROGRESS BARS ANIMATION
    // ==========================================================================
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar, .progress-fill');

        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';

            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }

    // Animate progress bars when they come into view
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.technical-skills, .language-skills');
    if (skillsSection) {
        progressObserver.observe(skillsSection);
    }
});