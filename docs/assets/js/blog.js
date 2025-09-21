/**
 * Blog Platform JavaScript - Futuristic Theme
 * Interactive blog with filtering, animations, and futuristic effects
 * Created by Patrice Mirindi
 */

class FuturisticBlog {
    constructor() {
        this.posts = [];
        this.currentFilter = 'all';
        this.loadedPosts = 6;
        this.totalPosts = 20;
        
        this.initializeEffects();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    initializeEffects() {
        // Create floating particles
        this.createFloatingParticles();
        
        // Initialize glitch effect
        this.setupGlitchEffect();
        
        // Setup holographic text effects
        this.setupHolographicEffects();
    }

    createFloatingParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particleContainer.appendChild(particle);
        }
    }

    setupGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every interval
                    element.classList.add('glitch-active');
                    setTimeout(() => {
                        element.classList.remove('glitch-active');
                    }, 200);
                }
            }, 2000);
        });
    }

    setupHolographicEffects() {
        const holographicElements = document.querySelectorAll('.holographic-text');
        holographicElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.textShadow = `
                    0 0 5px #00ffff,
                    0 0 10px #00ffff,
                    0 0 20px #00ffff,
                    0 0 40px #00ffff
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.textShadow = '';
            });
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterPosts(btn.dataset.category));
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSignup(e));
        }
        
        // Search functionality (if search input exists)
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPosts(e.target.value));
        }
    }

    filterPosts(category) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentFilter = category;
        
        // Filter posts with animation
        const posts = document.querySelectorAll('.post-card');
        posts.forEach((post, index) => {
            setTimeout(() => {
                if (category === 'all' || post.dataset.category.includes(category)) {
                    post.style.display = 'block';
                    post.style.animation = 'slideInUp 0.5s ease forwards';
                    post.style.opacity = '0';
                    setTimeout(() => {
                        post.style.opacity = '1';
                    }, 50);
                } else {
                    post.style.animation = 'slideOutDown 0.3s ease forwards';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            }, index * 50);
        });
    }

    loadMorePosts() {
        const loadMoreBtn = document.getElementById('load-more');
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            const additionalPosts = this.generateAdditionalPosts();
            const postsGrid = document.getElementById('posts-grid');
            
            additionalPosts.forEach((postHtml, index) => {
                setTimeout(() => {
                    postsGrid.insertAdjacentHTML('beforeend', postHtml);
                    const newPost = postsGrid.lastElementChild;
                    newPost.style.opacity = '0';
                    newPost.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        newPost.style.transition = 'all 0.5s ease';
                        newPost.style.opacity = '1';
                        newPost.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
            
            this.loadedPosts += additionalPosts.length;
            
            loadMoreBtn.innerHTML = '<i class="fas fa-download"></i> Load More Articles';
            loadMoreBtn.disabled = false;
            
            if (this.loadedPosts >= this.totalPosts) {
                loadMoreBtn.style.display = 'none';
            }
        }, 1500);
    }

    generateAdditionalPosts() {
        const additionalPosts = [
            {
                title: "Blockchain Applications in Agricultural Supply Chains: DRC Coffee Case Study",
                excerpt: "How blockchain technology can improve transparency and farmer incomes in DRC's coffee sector...",
                category: "drc agriculture",
                categoryLabel: "DRC Analysis",
                date: "2025-08-27",
                readTime: "7 min",
                image: "https://images.unsplash.com/photo-1442411210362-bc4902d4a2d4?w=400"
            },
            {
                title: "Gender Equality in Development Finance: Evidence from Sub-Saharan Africa",
                excerpt: "Analyzing the impact of gender-targeted financial instruments on women's economic empowerment...",
                category: "policy data",
                categoryLabel: "Policy",
                date: "2025-08-25",
                readTime: "9 min",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
            },
            {
                title: "Machine Learning for Poverty Prediction: Satellite Data Applications",
                excerpt: "Using computer vision and satellite imagery to predict poverty levels in real-time...",
                category: "data agriculture",
                categoryLabel: "Data Science",
                date: "2025-08-22",
                readTime: "11 min",
                image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400"
            }
        ];
        
        return additionalPosts.map(post => `
            <article class="post-card futuristic-card" data-category="${post.category}">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="post-category">${post.categoryLabel}</div>
                </div>
                <div class="post-content">
                    <h3><a href="#">${post.title}</a></h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}</time>
                        <span class="read-time">${post.readTime}</span>
                    </div>
                </div>
            </article>
        `);
    }

    handleNewsletterSignup(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const interests = document.getElementById('interests').value;
        
        // Simulate API call
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            submitBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
            
            // Reset form
            setTimeout(() => {
                e.target.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Show thank you message
                this.showNotification('Thank you for subscribing! Welcome to the future of development economics.', 'success');
            }, 2000);
        }, 1500);
    }

    searchPosts(query) {
        const posts = document.querySelectorAll('.post-card');
        const searchQuery = query.toLowerCase();
        
        posts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchQuery) || excerpt.includes(searchQuery) || searchQuery === '') {
                post.style.display = 'block';
                post.style.opacity = '1';
            } else {
                post.style.opacity = '0.3';
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} futuristic-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.post-card, .featured-article, .futuristic-card').forEach(el => {
            observer.observe(el);
        });
        
        // Add scroll-triggered effects
        this.setupScrollEffects();
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Update navigation glow effect based on scroll
            const nav = document.querySelector('.futuristic-nav');
            if (nav) {
                if (scrolled > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Add reading progress for individual articles (if on article page)
    initializeReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }
    
    // Initialize syntax highlighting for code blocks (if needed)
    initializeSyntaxHighlighting() {
        // This would be for individual article pages with code
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    // Social sharing functionality
    initializeSocialSharing() {
        const shareButtons = document.querySelectorAll('.social-share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = btn.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl = '';
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.futuristicBlog = new FuturisticBlog();
    
    // Add some additional futuristic interactions
    
    // Hover effects for cards
    document.querySelectorAll('.futuristic-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add typing effect to certain elements
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Add matrix rain effect to certain sections
    const matrixSections = document.querySelectorAll('.matrix-bg');
    matrixSections.forEach(section => {
        createMatrixRain(section);
    });
});

// Matrix rain effect function
function createMatrixRain(container) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.style.position = 'relative';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}