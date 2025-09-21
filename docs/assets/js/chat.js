// assets/js/tawk-enhanced.js
// ==========================================================================
// ENHANCED TAWK.TO INTEGRATION FOR PATRICE MIRINDI PORTFOLIO
// Site ID: 68d05919a5528e1923b76c3a | Widget ID: 1j5mto36j
// ==========================================================================

class EnhancedTawkWidget {
    constructor(siteId, widgetId) {
        this.siteId = siteId;
        this.widgetId = widgetId;
        this.isLoaded = false;
        this.visitorData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: this.getPageViews(),
            interests: [],
            engagementScore: 0
        };
        
        this.init();
    }
    
    init() {
        this.loadTawkScript();
        this.setupVisitorTracking();
        this.setupPageAnalytics();
        this.removeOldChatWidget(); // Remove existing chat widget
    }
    
    removeOldChatWidget() {
        // Remove existing chat widget elements
        const existingChatWidget = document.getElementById('chat-widget');
        if (existingChatWidget) {
            existingChatWidget.style.display = 'none';
        }
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getPageViews() {
        const views = localStorage.getItem('pm-page-views') || 0;
        const newViews = parseInt(views) + 1;
        localStorage.setItem('pm-page-views', newViews);
        return newViews;
    }
    
    loadTawkScript() {
        // Initialize Tawk_API
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        
        // Load the Tawk.to script with your credentials
        (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = `https://embed.tawk.to/${this.siteId}/${this.widgetId}`;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
        })();
        
        this.setupTawkEvents();
    }
    
    setupTawkEvents() {
        const self = this;
        
        // When Tawk.to loads completely
        window.Tawk_API.onLoad = function(){
            console.log('Enhanced Tawk.to loaded successfully');
            self.isLoaded = true;
            self.customizeAppearance();
            self.setVisitorInformation();
            self.startEngagementTracking();
            self.showSmartWelcome();
        };
        
        // When chat widget is ready
        window.Tawk_API.onStatusChange = function(status){
            console.log('Tawk status:', status);
            if (status === 'online') {
                self.setOnlineCustomization();
            } else {
                self.setOfflineCustomization();
            }
        };
        
        // When chat is maximized/opened
        window.Tawk_API.onChatMaximized = function(){
            self.trackEvent('chat_opened');
            self.sendVisitorContext();
            self.updateEngagementScore(10);
        };
        
        // When chat is minimized/closed
        window.Tawk_API.onChatMinimized = function(){
            self.trackEvent('chat_closed');
        };
        
        // When visitor starts typing
        window.Tawk_API.onChatStarted = function(){
            self.trackEvent('chat_started');
            self.updateEngagementScore(20);
            self.sendDetailedContext();
        };
        
        // When visitor sends a message
        window.Tawk_API.onChatMessageVisitor = function(message){
            self.analyzeMessage(message);
            self.updateEngagementScore(5);
            self.trackEvent('message_sent', { 
                length: message.length,
                contains_question: message.includes('?'),
                contains_email: /\S+@\S+\.\S+/.test(message)
            });
        };
        
        // When agent responds
        window.Tawk_API.onChatMessageAgent = function(message){
            self.trackEvent('agent_response', { response_time: self.calculateResponseTime() });
        };
        
        // When chat session ends
        window.Tawk_API.onChatEnded = function(){
            self.trackEvent('chat_ended', { 
                duration: Date.now() - self.visitorData.startTime,
                engagement_score: self.visitorData.engagementScore
            });
            self.showFeedbackPrompt();
        };
        
        // When offline message is submitted
        window.Tawk_API.onOfflineSubmit = function(data){
            self.trackEvent('offline_message_submitted');
            self.handleOfflineMessage(data);
        };
        
        // When pre-chat form is submitted
        window.Tawk_API.onPrechatSubmit = function(data){
            self.trackEvent('prechat_submitted');
            self.updateVisitorData(data);
        };
    }
    
    customizeAppearance() {
        // Set custom styling that matches your portfolio design
        window.Tawk_API.customStyle = {
            visibility: {
                desktop: {
                    position: 'br', // bottom right
                    xOffset: 20,
                    yOffset: 20
                },
                mobile: {
                    position: 'br',
                    xOffset: 15,
                    yOffset: 15
                }
            },
            zIndex: 9999
        };
        
        // Add sophisticated custom CSS
        this.injectCustomCSS();
    }
    
    injectCustomCSS() {
        const style = document.createElement('style');
        style.id = 'tawk-custom-styles';
        style.textContent = `
            /* Enhanced Tawk.to Styling */
            .tawk-button-circle {
                background: linear-gradient(135deg, #004085 0%, #FF6600 100%) !important;
                box-shadow: 0 4px 20px rgba(0, 64, 133, 0.4) !important;
                border: 2px solid rgba(255, 255, 255, 0.2) !important;
                animation: tawkPulse 3s ease-in-out infinite !important;
            }
            
            @keyframes tawkPulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 4px 20px rgba(0, 64, 133, 0.4);
                }
                50% { 
                    transform: scale(1.05);
                    box-shadow: 0 6px 30px rgba(0, 64, 133, 0.6);
                }
            }
            
            .tawk-button-circle:hover {
                background: linear-gradient(135deg, #FF6600 0%, #FFD700 100%) !important;
                transform: scale(1.1) !important;
                animation: none !important;
            }
            
            /* Chat window customization */
            .tawk-chatbox-frame {
                border-radius: 16px !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
                border: 2px solid rgba(0, 64, 133, 0.1) !important;
            }
            
            /* Header styling */
            .tawk-header {
                background: linear-gradient(135deg, #004085 0%, #002952 100%) !important;
                border-radius: 14px 14px 0 0 !important;
            }
            
            /* Hide Tawk.to branding */
            .tawk-branding,
            .tawk-branding-container,
            #tawk-bubble-text {
                display: none !important;
            }
            
            /* Message styling */
            .tawk-message-visitor {
                background: #004085 !important;
                border-radius: 18px 18px 4px 18px !important;
            }
            
            .tawk-message-agent {
                background: #f8f9fa !important;
                border: 1px solid #e9ecef !important;
                border-radius: 18px 18px 18px 4px !important;
            }
            
            /* Mobile responsive adjustments */
            @media (max-width: 768px) {
                .tawk-chatbox-frame {
                    border-radius: 0 !important;
                    height: 100vh !important;
                    width: 100vw !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                }
            }
            
            /* Notification badge */
            .tawk-notification-badge {
                background: #FF6600 !important;
                color: white !important;
                font-weight: bold !important;
                animation: bounce 1s infinite !important;
            }
            
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setVisitorInformation() {
        const pageContext = this.getPageContext();
        const deviceInfo = this.getDeviceInfo();
        const behaviorData = this.getBehaviorData();
        
        // Set comprehensive visitor attributes
        if (window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                'name': this.getVisitorName(),
                'current_page': pageContext.pageName,
                'page_category': pageContext.category,
                'interests': pageContext.interests.join(', '),
                'device_type': deviceInfo.type,
                'screen_size': deviceInfo.screenSize,
                'browser': deviceInfo.browser,
                'session_id': this.visitorData.sessionId,
                'page_views': this.visitorData.pageViews.toString(),
                'time_on_site': this.getTimeOnSite(),
                'referrer': document.referrer || 'Direct',
                'is_returning_visitor': this.isReturningVisitor().toString(),
                'engagement_score': this.visitorData.engagementScore.toString(),
                'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...behaviorData
            });
        }
        
        // Add relevant tags
        const tags = [
            pageContext.category,
            deviceInfo.type,
            this.isReturningVisitor() ? 'returning-visitor' : 'new-visitor',
            'portfolio-visitor',
            ...pageContext.interests.slice(0, 3) // Limit to 3 interest tags
        ];
        
        if (window.Tawk_API.addTags) {
            window.Tawk_API.addTags(tags);
        }
    }
    
    getVisitorName() {
        // Try to get name from various sources
        const storedName = localStorage.getItem('pm-visitor-name');
        if (storedName) return storedName;
        
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        if (nameParam) return nameParam;
        
        return 'Portfolio Visitor';
    }
    
    getPageContext() {
        const path = window.location.pathname.toLowerCase();
        const page = path.split('/').pop().replace('.html', '') || 'home';
        
        const pageContexts = {
            'index': { 
                pageName: 'Homepage', 
                category: 'overview',
                interests: ['general-inquiry', 'overview', 'introduction'],
                priority: 'high'
            },
            'home': { 
                pageName: 'Homepage', 
                category: 'overview',
                interests: ['general-inquiry', 'overview', 'introduction'],
                priority: 'high'
            },
            'about': { 
                pageName: 'About Page', 
                category: 'personal',
                interests: ['background', 'education', 'personal-story', 'biography'],
                priority: 'medium'
            },
            'work-experience': { 
                pageName: 'Experience Page',
                category: 'professional',
                interests: ['career', 'employment', 'work-history', 'achievements'],
                priority: 'high'
            },
            'skills-expertise': { 
                pageName: 'Skills Page',
                category: 'technical',
                interests: ['technical-skills', 'programming', 'tools', 'capabilities'],
                priority: 'high'
            },
            'key-projects': { 
                pageName: 'Projects Page',
                category: 'portfolio',
                interests: ['projects', 'case-studies', 'work-examples', 'portfolio'],
                priority: 'very-high'
            },
            'contact': { 
                pageName: 'Contact Page',
                category: 'conversion',
                interests: ['hire', 'consulting', 'collaboration', 'contact'],
                priority: 'very-high'
            }
        };
        
        return pageContexts[page] || {
            pageName: 'Other Page',
            category: 'general',
            interests: ['general'],
            priority: 'low'
        };
    }
    
    getDeviceInfo() {
        const width = window.screen.width;
        const userAgent = navigator.userAgent;
        
        let deviceType = 'desktop';
        if (width <= 768) deviceType = 'mobile';
        else if (width <= 1024) deviceType = 'tablet';
        
        let browser = 'unknown';
        if (userAgent.includes('Chrome')) browser = 'chrome';
        else if (userAgent.includes('Firefox')) browser = 'firefox';
        else if (userAgent.includes('Safari')) browser = 'safari';
        else if (userAgent.includes('Edge')) browser = 'edge';
        
        return {
            type: deviceType,
            screenSize: `${width}x${window.screen.height}`,
            browser: browser,
            isMobile: deviceType === 'mobile',
            isTablet: deviceType === 'tablet'
        };
    }
    
    getBehaviorData() {
        return {
            'scroll_depth': this.getMaxScrollDepth() + '%',
            'time_on_current_page': this.getTimeOnCurrentPage(),
            'clicks_count': this.getClickCount(),
            'form_interactions': this.getFormInteractions(),
            'video_interactions': this.getVideoInteractions()
        };
    }
    
    setupVisitorTracking() {
        this.trackScrollDepth();
        this.trackTimeSpent();
        this.trackClickBehavior();
        this.trackFormInteractions();
        this.detectUserIntent();
    }
    
    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                localStorage.setItem('pm-max-scroll', maxScrollDepth);
                
                // Update engagement score based on scroll
                if (scrollPercent >= 25 && !this.scrollMilestones?.quarter) {
                    this.scrollMilestones = { ...this.scrollMilestones, quarter: true };
                    this.updateEngagementScore(5);
                    this.updateVisitorAttribute('scroll_25', 'true');
                }
                if (scrollPercent >= 50 && !this.scrollMilestones?.half) {
                    this.scrollMilestones = { ...this.scrollMilestones, half: true };
                    this.updateEngagementScore(5);
                    this.updateVisitorAttribute('scroll_50', 'true');
                }
                if (scrollPercent >= 75 && !this.scrollMilestones?.threeQuarter) {
                    this.scrollMilestones = { ...this.scrollMilestones, threeQuarter: true };
                    this.updateEngagementScore(10);
                    this.updateVisitorAttribute('scroll_75', 'true');
                }
                if (scrollPercent >= 90 && !this.scrollMilestones?.ninety) {
                    this.scrollMilestones = { ...this.scrollMilestones, ninety: true };
                    this.updateEngagementScore(15);
                    this.updateVisitorAttribute('scroll_90', 'true');
                }
            }
        });
    }
    
    trackTimeSpent() {
        let timeSpent = 0;
        const startTime = Date.now();
        
        setInterval(() => {
            timeSpent = Math.round((Date.now() - startTime) / 1000);
            localStorage.setItem('pm-time-spent', timeSpent);
            
            // Update engagement based on time spent
            if (timeSpent >= 30 && !this.timeMilestones?.thirty) {
                this.timeMilestones = { ...this.timeMilestones, thirty: true };
                this.updateEngagementScore(5);
                this.maybeShowProactiveMessage('time_30');
            }
            if (timeSpent >= 60 && !this.timeMilestones?.sixty) {
                this.timeMilestones = { ...this.timeMilestones, sixty: true };
                this.updateEngagementScore(10);
                this.maybeShowProactiveMessage('time_60');
            }
            if (timeSpent >= 120 && !this.timeMilestones?.twoMinutes) {
                this.timeMilestones = { ...this.timeMilestones, twoMinutes: true };
                this.updateEngagementScore(15);
                this.maybeShowProactiveMessage('time_120');
            }
        }, 10000); // Every 10 seconds
    }
    
    trackClickBehavior() {
        let clickCount = 0;
        
        document.addEventListener('click', (e) => {
            clickCount++;
            localStorage.setItem('pm-click-count', clickCount);
            
            const element = e.target;
            let clickType = 'general';
            
            if (element.classList.contains('btn')) clickType = 'button';
            else if (element.tagName === 'A') clickType = 'link';
            else if (element.closest('.expertise-card')) clickType = 'expertise';
            else if (element.closest('.project-card')) clickType = 'project';
            else if (element.closest('.contact-method')) clickType = 'contact';
            
            this.updateEngagementScore(1);
            
            // Track specific high-value clicks
            if (clickType === 'contact' || clickType === 'button') {
                this.updateEngagementScore(5);
                this.addTag(`clicked-${clickType}`);
            }
        });
    }
    
    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        let formInteractions = 0;
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    formInteractions++;
                    this.updateEngagementScore(10);
                    this.updateVisitorAttribute('form_interaction', 'true');
                    
                    if (input.type === 'email' || input.name === 'email') {
                        this.addTag('interested-in-contact');
                    }
                });
                
                input.addEventListener('blur', () => {
                    if (input.value.trim()) {
                        this.updateEngagementScore(5);
                        
                        // Store form data for context
                        if (input.name === 'name' && input.value.trim()) {
                            localStorage.setItem('pm-visitor-name', input.value.trim());
                            this.updateVisitorAttribute('name', input.value.trim());
                        }
                        if (input.name === 'email' && input.value.trim()) {
                            this.updateVisitorAttribute('email', input.value.trim());
                        }
                    }
                });
            });
            
            form.addEventListener('submit', () => {
                this.updateEngagementScore(25);
                this.addTag('form-submitted');
                this.trackEvent('form_submitted', { form_id: form.id || 'unknown' });
            });
        });
    }
    
    detectUserIntent() {
        // Detect user intent based on behavior patterns
        const urlParams = new URLSearchParams(window.location.search);
        
        // UTM parameters indicate marketing source
        if (urlParams.get('utm_source')) {
            this.addTag(`source-${urlParams.get('utm_source')}`);
            this.updateVisitorAttribute('traffic_source', urlParams.get('utm_source'));
        }
        
        // Check for hiring intent
        if (urlParams.get('hiring') || document.location.hash.includes('hire')) {
            this.addTag('hiring-intent');
            this.updateEngagementScore(20);
        }
        
        // Detect referrers that indicate business intent
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('linkedin') || referrer.includes('upwork') || referrer.includes('freelancer')) {
            this.addTag('business-referral');
            this.updateEngagementScore(15);
        }
    }
    
    setupPageAnalytics() {
        // Enhanced page analytics
        this.trackPagePerformance();
        this.trackContentEngagement();
        this.setupExitIntentDetection();
    }
    
    trackPagePerformance() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.updateVisitorAttribute('page_load_time', `${Math.round(loadTime / 1000)}s`);
        });
    }
    
    trackContentEngagement() {
        // Track which sections users spend most time viewing
        const sections = document.querySelectorAll('section[id]');
        const sectionTimes = {};
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (!sectionTimes[sectionId]) {
                        sectionTimes[sectionId] = { start: Date.now(), total: 0 };
                    } else {
                        sectionTimes[sectionId].start = Date.now();
                    }
                } else {
                    const sectionId = entry.target.id;
                    if (sectionTimes[sectionId] && sectionTimes[sectionId].start) {
                        sectionTimes[sectionId].total += Date.now() - sectionTimes[sectionId].start;
                        sectionTimes[sectionId].start = null;
                        
                        // Track high engagement sections
                        if (sectionTimes[sectionId].total > 10000) { // 10 seconds
                            this.updateEngagementScore(5);
                            this.addTag(`engaged-${sectionId}`);
                        }
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupExitIntentDetection() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) { // Mouse moved to top of screen
                this.handleExitIntent();
            }
        });
        
        // Mobile exit intent (scroll to top quickly)
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY < lastScrollY - 100 && window.scrollY < 100) {
                this.handleExitIntent();
            }
            lastScrollY = window.scrollY;
        });
    }
    
    handleExitIntent() {
        if (!this.exitIntentTriggered && this.visitorData.engagementScore >= 20) {
            this.exitIntentTriggered = true;
            this.trackEvent('exit_intent_detected');
            
            setTimeout(() => {
                this.showExitIntentMessage();
            }, 500);
        }
    }
    
    // Smart messaging based on behavior
    maybeShowProactiveMessage(trigger) {
        if (this.hasActiveChat() || this.recentlyShowedMessage()) return;
        
        const messages = this.getContextualMessages(trigger);
        if (messages.length > 0) {
            const message = messages[Math.floor(Math.random() * messages.length)];
            setTimeout(() => {
                this.showProactiveMessage(message);
            }, Math.random() * 3000 + 2000); // Random delay 2-5 seconds
        }
    }
    
    getContextualMessages(trigger) {
        const pageContext = this.getPageContext();
        const engagementLevel = this.getEngagementLevel();
        
        const messageBank = {
            'time_30': {
                'high': [
                    "👋 Hi! I see you're exploring my portfolio. I'm Patrice - happy to answer any questions about my data analytics experience!",
                    "Hello! I notice you're interested in my work. I specialize in R, Python, and economic development consulting. How can I help?",
                    "Hi there! I'm available to discuss any of my projects or services. What would you like to know more about?"
                ],
                'medium': [
                    "I'm here if you have any questions about my background or services!",
                    "Feel free to ask about my experience with data analytics or economic consulting.",
                    "Hi! I can provide more details about any of my projects or technical skills."
                ]
            },
            'time_60': {
                'high': [
                    "I see you're taking time to review my work - that's great! I'm available for new consulting projects. What are you working on?",
                    "Thanks for your interest in my portfolio! I'd love to discuss how I can help with your data analytics or economic development needs.",
                    "I notice you've been exploring my experience. I'm currently available for consulting. Would you like to discuss a potential collaboration?"
                ]
            },
            'scroll_75': {
                'high': [
                    "I see you've reviewed most of my portfolio! I'd be happy to discuss any specific projects or answer questions about my approach.",
                    "Thanks for the thorough review! I'm available to chat about consulting opportunities or answer any technical questions."
                ]
            }
        };
        
        const triggerMessages = messageBank[trigger];
        if (!triggerMessages) return [];
        
        return triggerMessages[engagementLevel] || triggerMessages['medium'] || [];
    }
    
    getEngagementLevel() {
        const score = this.visitorData.engagementScore;
        if (score >= 50) return 'high';
        if (score >= 20) return 'medium';
        return 'low';
    }
    
    showProactiveMessage(message) {
        if (!this.isLoaded || this.hasActiveChat()) return;
        
        // Use Tawk.to's trigger system
        this.createFloatingMessage(message);
        this.lastProactiveMessage = Date.now();
        this.trackEvent('proactive_message_shown', { message: message.substring(0, 50) });
    }
    
    createFloatingMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'pm-chat-notification';
        notification.innerHTML = `
            <div class="pm-notification-content">
                <div class="pm-notification-avatar">
                    <img src="assets/img/patricemirindi.jpg" alt="Patrice Mirindi" width="40" height="40">
                </div>
                <div class="pm-notification-message">
                    <strong>Patrice Mirindi</strong>
                    <p>${message}</p>
                </div>
                <button class="pm-notification-close">&times;</button>
            </div>
        `;
        
        // Styling
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            max-width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9998;
            cursor: pointer;
            animation: pmSlideIn 0.3s ease-out;
            font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, sans-serif);
        `;
        
        // Add animation styles
        if (!document.querySelector('#pm-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'pm-notification-styles';
            style.textContent = `
                @keyframes pmSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .pm-notification-content {
                    display: flex;
                    align-items: flex-start;
                    padding: 1rem;
                    gap: 0.75rem;
                }
                
                .pm-notification-avatar img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .pm-notification-message {
                    flex: 1;
                    min-width: 0;
                }
                
                .pm-notification-message strong {
                    color: #004085;
                    font-size: 0.875rem;
                    display: block;
                    margin-bottom: 0.25rem;
                }
                
                .pm-notification-message p {
                    font-size: 0.875rem;
                    color: #333;
                    line-height: 1.4;
                    margin: 0;
                }
                
                .pm-notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .pm-notification-close:hover {
                    color: #333;
                }
                
                .pm-chat-notification:hover {
                    box-shadow: 0 6px 30px rgba(0,0,0,0.2);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Event handlers
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('pm-notification-close')) {
                this.openChatWithMessage(message);
                notification.remove();
            }
        });
        
        notification.querySelector('.pm-notification-close').addEventListener('click', (e) => {
            e.stopPropagation();
            notification.style.animation = 'pmSlideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 15 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'pmSlideIn 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 15000);
    }
    
    openChatWithMessage(contextMessage) {
        if (window.Tawk_API.maximize) {
            window.Tawk_API.maximize();
            
            // Send context to help with the conversation
            setTimeout(() => {
                if (window.Tawk_API.addEvent) {
                    window.Tawk_API.addEvent({
                        event: 'proactive-engagement',
                        type: 'internal',
                        message: `Visitor engaged with proactive message: "${contextMessage}"`
                    });
                }
            }, 1000);
        }
    }
    
    showExitIntentMessage() {
        const messages = [
            "Wait! Before you go - I'm available for consulting projects. Quick question?",
            "Interested in working together? I'm just a message away!",
            "Have a data analytics challenge? Let's chat about how I can help!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showProactiveMessage(message);
    }
    
    // Utility methods
    hasActiveChat() {
        return window.Tawk_API && window.Tawk_API.getStatus() === 'online' && 
               window.Tawk_API.getWindowType() === 'inline';
    }
    
    recentlyShowedMessage() {
        return this.lastProactiveMessage && (Date.now() - this.lastProactiveMessage) < 60000; // 1 minute
    }
    
    updateEngagementScore(points) {
        this.visitorData.engagementScore += points;
        this.updateVisitorAttribute('engagement_score', this.visitorData.engagementScore.toString());
    }
    
    updateVisitorAttribute(key, value) {
        if (this.isLoaded && window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({ [key]: value });
        }
    }
    
    addTag(tag) {
        if (this.isLoaded && window.Tawk_API.addTags) {
            window.Tawk_API.addTags([tag]);
        }
    }
    
    // Helper methods for data collection
    getMaxScrollDepth() {
        return localStorage.getItem('pm-max-scroll') || 0;
    }
    
    getTimeOnSite() {
        const timeSpent = localStorage.getItem('pm-time-spent') || 0;
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        return `${minutes}m ${seconds}s`;
    }
    
    getTimeOnCurrentPage() {
        const timeSpent = Math.round((Date.now() - this.visitorData.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        return `${minutes}m ${seconds}s`;
    }
    
    getClickCount() {
        return localStorage.getItem('pm-click-count') || 0;
    }
    
    getFormInteractions() {
        return localStorage.getItem('pm-form-interactions') || 0;
    }
    
    getVideoInteractions() {
        return localStorage.getItem('pm-video-interactions') || 0;
    }
    
    isReturningVisitor() {
        return localStorage.getItem('pm-page-views') > 1;
    }
    
    // Advanced features
    setOnlineCustomization() {
        // When agent is online, show different styling
        if (window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                'agent_status': 'online',
                'response_expectation': 'Live chat available'
            });
        }
    }
    
    setOfflineCustomization() {
        // When agent is offline, show offline messaging
        if (window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                'agent_status': 'offline',
                'response_expectation': 'I will respond within 24 hours'
            });
        }
    }
    
    sendVisitorContext() {
        const context = `
🎯 VISITOR CONTEXT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━

📊 ENGAGEMENT DATA:
• Page: ${this.getPageContext().pageName}
• Time on site: ${this.getTimeOnSite()}
• Pages viewed: ${this.visitorData.pageViews}
• Scroll depth: ${this.getMaxScrollDepth()}%
• Engagement score: ${this.visitorData.engagementScore}/100
• Device: ${this.getDeviceInfo().type} (${this.getDeviceInfo().screenSize})

🎯 INTERESTS DETECTED:
• ${this.getPageContext().interests.join(', ')}

🔍 BEHAVIOR SIGNALS:
• Clicks: ${this.getClickCount()}
• Form interaction: ${this.getFormInteractions() > 0 ? 'Yes' : 'No'}
• Returning visitor: ${this.isReturningVisitor() ? 'Yes' : 'No'}
• Referrer: ${document.referrer || 'Direct'}

💡 CONSULTATION READINESS: ${this.getEngagementLevel().toUpperCase()}
`;
        
        if (window.Tawk_API.addEvent) {
            window.Tawk_API.addEvent({
                event: 'visitor-context-summary',
                type: 'internal',
                message: context
            });
        }
    }
    
    sendDetailedContext() {
        // Send even more detailed context when chat starts
        setTimeout(() => {
            const detailedContext = `
📋 DETAILED VISITOR INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 TECHNICAL DETAILS:
• Browser: ${this.getDeviceInfo().browser}
• Screen: ${this.getDeviceInfo().screenSize}
• Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
• Session ID: ${this.visitorData.sessionId}

📈 ENGAGEMENT BREAKDOWN:
• Scroll milestones: ${Object.keys(this.scrollMilestones || {}).join(', ') || 'None'}
• Time milestones: ${Object.keys(this.timeMilestones || {}).join(', ') || 'None'}
• High-value actions: ${this.visitorData.engagementScore >= 30 ? 'Multiple' : 'Few'}

🎯 LIKELY INTENT:
${this.predictVisitorIntent()}

💼 RECOMMENDED APPROACH:
${this.getRecommendedApproach()}
`;
            
            if (window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'detailed-visitor-analysis',
                    type: 'internal',
                    message: detailedContext
                });
            }
        }, 5000); // Send after 5 seconds of chat starting
    }
    
    predictVisitorIntent() {
        const score = this.visitorData.engagementScore;
        const pageContext = this.getPageContext();
        const timeSpent = parseInt(this.getTimeOnSite());
        
        if (pageContext.category === 'conversion' && score >= 30) {
            return 'HIGH: Ready to hire/contact - hot lead';
        } else if (pageContext.category === 'portfolio' && score >= 25) {
            return 'MEDIUM-HIGH: Evaluating work quality - potential client';
        } else if (pageContext.category === 'technical' && score >= 20) {
            return 'MEDIUM: Assessing technical fit - technical evaluation';
        } else if (timeSpent >= 120 && score >= 15) {
            return 'MEDIUM: General interest - information gathering';
        } else {
            return 'LOW: Casual browsing - early stage interest';
        }
    }
    
    getRecommendedApproach() {
        const intent = this.predictVisitorIntent();
        
        if (intent.includes('HIGH')) {
            return '🔥 Focus on availability, rates, and project scope. Ask about their specific needs and timeline.';
        } else if (intent.includes('MEDIUM-HIGH')) {
            return '💼 Showcase relevant project examples and technical expertise. Offer to discuss their requirements.';
        } else if (intent.includes('MEDIUM')) {
            return '🤝 Be helpful and informative. Answer technical questions and offer consultation.';
        } else {
            return '📚 Provide general information and build interest. Focus on establishing credibility.';
        }
    }
    
    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();
        const keywords = {
            'urgent-hire': ['urgent', 'asap', 'immediately', 'quick', 'rush'],
            'budget-inquiry': ['budget', 'cost', 'price', 'rate', 'fee', 'charge', 'expensive', 'affordable'],
            'technical-deep': ['algorithm', 'model', 'statistical', 'regression', 'api', 'database'],
            'project-scope': ['project', 'requirement', 'scope', 'deliverable', 'timeline', 'duration'],
            'availability': ['available', 'free', 'schedule', 'start', 'when'],
            'comparison': ['vs', 'versus', 'compare', 'other', 'alternative', 'competitor'],
            'testimonial-request': ['reference', 'testimonial', 'previous', 'client', 'review'],
        };
        
        const detectedIntents = [];
        Object.entries(keywords).forEach(([intent, words]) => {
            if (words.some(word => lowerMessage.includes(word))) {
                detectedIntents.push(intent);
            }
        });
        
        if (detectedIntents.length > 0) {
            this.addTag(detectedIntents[0]); // Add primary intent as tag
            this.updateVisitorAttribute('message_intent', detectedIntents.join(', '));
        }
        
        // Detect contact information sharing
        if (/\S+@\S+\.\S+/.test(message)) {
            this.addTag('shared-email');
            this.updateEngagementScore(15);
        }
        
        if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(message)) {
            this.addTag('shared-phone');
            this.updateEngagementScore(15);
        }
    }
    
    calculateResponseTime() {
        // Calculate time between visitor message and agent response
        return 'calculated-by-tawk'; // Tawk.to handles this internally
    }
    
    updateVisitorData(data) {
        if (data.name) {
            localStorage.setItem('pm-visitor-name', data.name);
            this.visitorData.name = data.name;
        }
        if (data.email) {
            this.visitorData.email = data.email;
        }
    }
    
    showSmartWelcome() {
        // Show contextual welcome based on page and behavior
        const pageContext = this.getPageContext();
        const isReturning = this.isReturningVisitor();
        
        // Don't interfere with Tawk.to's own welcome message
        // This is handled by Tawk.to dashboard settings
    }
    
    handleOfflineMessage(data) {
        this.trackEvent('offline_message_received', {
            has_email: !!data.email,
            message_length: data.message ? data.message.length : 0
        });
        
        // Store offline message for follow-up
        const offlineData = {
            ...data,
            timestamp: new Date().toISOString(),
            sessionId: this.visitorData.sessionId,
            pageContext: this.getPageContext(),
            engagementScore: this.visitorData.engagementScore
        };
        
        localStorage.setItem('pm-offline-message', JSON.stringify(offlineData));
    }
    
    showFeedbackPrompt() {
        // Show subtle feedback prompt after chat ends
        setTimeout(() => {
            this.showProactiveMessage(
                "Thanks for chatting! I'd appreciate any feedback on how I can improve my services. Feel free to reach out anytime at patricemirindi@gmail.com"
            );
        }, 3000);
    }
    
    trackEvent(eventName, properties = {}) {
        // Enhanced analytics tracking
        const eventData = {
            event_category: 'enhanced_tawk_chat',
            event_label: eventName,
            custom_parameters: {
                session_id: this.visitorData.sessionId,
                page_context: this.getPageContext().category,
                engagement_score: this.visitorData.engagementScore,
                visitor_type: this.isReturningVisitor() ? 'returning' : 'new',
                ...properties
            }
        };
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console logging for debugging
        console.log('Enhanced Tawk Event:', eventName, eventData);
        
        // Send to your own analytics endpoint if needed
        this.sendToCustomAnalytics(eventName, eventData);
    }
    
    sendToCustomAnalytics(eventName, data) {
        // Optional: send to your own analytics
        fetch('/api/analytics/tawk-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: eventName, data })
        }).catch(error => {
            console.log('Custom analytics send failed:', error);
        });
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Enhanced Tawk.to integration ready');
});
