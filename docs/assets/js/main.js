/* ==========================================================================
   PATRICE MIRINDI PORTFOLIO - MAIN JAVASCRIPT
   Professional, Clean, and Functional - Enhanced Navigation
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
    // ENHANCED NAVIGATION
    // ==========================================================================
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!navbar) return;

        // Set active nav link based on current page
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Enhanced navbar scroll effect with better performance
        let isScrolling = false;
        function updateNavbar() {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            isScrolling = false;
        }

        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(updateNavbar);
                isScrolling = true;
            }
        });

        // Add hover effects to nav links
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // ==========================================================================
    // ENHANCED MOBILE MENU
    // ==========================================================================
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.querySelector('.navbar');
        
        if (!hamburger || !navMenu) return;

        // Toggle mobile menu
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add slight delay for better UX
                setTimeout(() => {
                    closeMobileMenu();
                }, 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && 
                !navMenu.contains(e.target) && 
                navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on window resize if open
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        function toggleMobileMenu() {
            const isActive = hamburger.classList.contains('active');
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
            
            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'mobile-menu-backdrop';
            backdrop.addEventListener('click', closeMobileMenu);
            document.body.appendChild(backdrop);
            
            // Animate menu items
            const menuItems = navMenu.querySelectorAll('.nav-item');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }

        function closeMobileMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            // Remove backdrop
            const backdrop = document.querySelector('.mobile-menu-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            
            // Reset menu item animations
            const menuItems = navMenu.querySelectorAll('.nav-item');
            menuItems.forEach(item => {
                item.style.transition = '';
                item.style.opacity = '';
                item.style.transform = '';
            });
        }
    }

    // ==========================================================================
    // READING PROGRESS
    // ==========================================================================
    function initReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;
        
        let isScrolling = false;
        function updateProgress() {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
            isScrolling = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(updateProgress);
                isScrolling = true;
            }
        });
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
            '.fade-in, .card, .stat-number, [data-count], .widget-card, .expertise-card, .testimonial-card'
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
            'projects-completed': 20,
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
                    element.textContent = value + '+';
                }
            });
        });

        // Set up observers for animation
        const counters = document.querySelectorAll('.stat-number, [data-count], .widget-value');
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
        } else if (targetText.includes('B')) {
            const match = targetText.match(/([0-9.]+)/);
            target = match ? parseFloat(match[1]) : 0;
            suffix = 'B';
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
            } else if (suffix.includes('B')) {
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
            
            .card, .widget-card, .expertise-card, .testimonial-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .nav-link {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .hamburger {
                cursor: pointer;
                z-index: 1001;
            }
            
            .hamburger .bar {
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
            
            .mobile-menu-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            /* Enhanced mobile navigation */
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    right: 0;
                    height: calc(100vh - 80px);
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px) saturate(180%);
                    transform: translateX(-100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1000;
                    overflow-y: auto;
                    padding: 2rem 1rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }
                
                .nav-menu.active {
                    transform: translateX(0);
                }
                
                .nav-menu .nav-item {
                    margin-bottom: 1rem;
                }
                
                .nav-menu .nav-link {
                    display: block;
                    padding: 1rem 1.5rem;
                    font-size: 1.125rem;
                    font-weight: 500;
                    border-radius: 1rem;
                    text-align: center;
                    background: rgba(248, 250, 252, 0.8);
                    border: 2px solid transparent;
                    margin-bottom: 0.5rem;
                }
                
                .nav-menu .nav-link:hover,
                .nav-menu .nav-link.active {
                    background: #004085;
                    color: white;
                    border-color: #FF6600;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 64, 133, 0.3);
                }
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