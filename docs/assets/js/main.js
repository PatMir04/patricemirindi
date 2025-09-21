/* ==========================================================================
   PATRICE MIRINDI PORTFOLIO - MAIN JAVASCRIPT
   Professional, Clean, and Functional
   ========================================================================== */

(function() {
    'use strict';

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        initializePortfolio();
    });

    function initializePortfolio() {
        initNavigation();
        initMobileMenu();
        initScrollEffects();
        initCounters();
        initReadingProgress();
        initSmoothScrolling();
        initAnimations();
        console.log('Portfolio initialized successfully');
    }

    // ==========================================================================
    // NAVIGATION
    // ==========================================================================
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Navbar scroll effect
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10));
    }

    // ==========================================================================
    // MOBILE MENU
    // ==========================================================================
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ==========================================================================
    // READING PROGRESS
    // ==========================================================================
    function initReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', throttle(function() {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
        }, 10));
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
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // SCROLL ANIMATIONS
    // ==========================================================================
    function initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Handle counters
                    if (entry.target.classList.contains('stat-number') || entry.target.hasAttribute('data-count')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .card, .stat-number, [data-count]'
        );

        animatedElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }

    // ==========================================================================
    // COUNTERS
    // ==========================================================================
    function initCounters() {
        // Fixed values for statistics
        const stats = {
            'years-experience': 8,
            'projects-completed': 50,
            'countries-worked': 12,
            'lives-impacted': 2000,
            'client-satisfaction': 100,
            'total-project-value': 5.2,
            'organizations': 15
        };

        // Apply fixed values immediately
        Object.keys(stats).forEach(key => {
            const elements = document.querySelectorAll(`[data-stat="${key}"], .stat-${key}`);
            elements.forEach(element => {
                const value = stats[key];
                if (key === 'total-project-value') {
                    element.textContent = '$' + value + 'M+';
                } else if (key === 'lives-impacted') {
                    element.textContent = value.toLocaleString() + '+';
                } else if (key === 'client-satisfaction') {
                    element.textContent = value + '%';
                } else {
                    element.textContent = value + (value > 1 ? '+' : '');
                }
            });
        });

        // Set up observers for animation
        const counters = document.querySelectorAll('.stat-number, [data-count]');
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
        // Skip if already animated
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');

        const targetText = element.textContent.trim();
        
        // Extract number from text
        let target = 0;
        let suffix = '';
        let prefix = '';
        
        if (targetText.includes('$')) {
            prefix = '$';
            const match = targetText.match(/([0-9.]+)/);
            target = match ? parseFloat(match[1]) : 0;
            suffix = targetText.includes('M') ? 'M+' : '+';
        } else if (targetText.includes('%')) {
            const match = targetText.match(/([0-9]+)/);
            target = match ? parseInt(match[1]) : 0;
            suffix = '%';
        } else {
            const match = targetText.match(/([0-9,]+)/);
            if (match) {
                target = parseInt(match[1].replace(/,/g, ''));
                suffix = targetText.includes('+') ? '+' : '';
            }
        }

        if (target === 0) return;

        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;
            
            let displayValue;
            if (prefix === '$' && suffix.includes('M')) {
                displayValue = current.toFixed(1);
            } else if (target >= 1000 && !suffix.includes('%')) {
                displayValue = Math.floor(current).toLocaleString();
            } else {
                displayValue = Math.floor(current).toString();
            }
            
            element.textContent = prefix + displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        // Start with 0
        element.textContent = prefix + '0' + suffix;
        requestAnimationFrame(updateCounter);
    }

    // ==========================================================================
    // ANIMATIONS
    // ==========================================================================
    function initAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .fade-in.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .hamburger.active .bar:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active .bar:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active .bar:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
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

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // ==========================================================================
    // ERROR HANDLING
    // ==========================================================================
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });

    // ==========================================================================
    // EXPORT FOR GLOBAL ACCESS
    // ==========================================================================
    window.PortfolioJS = {
        animateCounter,
        throttle,
        debounce
    };

})();