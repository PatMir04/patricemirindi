/* ==========================================================================
   ENHANCED TAWK.TO CHAT WIDGET
   ==========================================================================
   Professional chat integration with custom features
   ========================================================================== */

class EnhancedTawkWidget {
    constructor(widgetId, customizations = {}) {
        this.widgetId = widgetId;
        this.isReady = false;
        this.messageQueue = [];
        this.customizations = {
            welcomeMessage: 'Hi! I\'m Patrice Mirindi. How can I help you with data analytics or consulting projects?',
            offlineMessage: 'I\'m currently offline, but please leave a message and I\'ll get back to you within 24 hours.',
            autoGreeting: true,
            autoGreetingDelay: 5000,
            trackingEnabled: true,
            customStyles: true,
            ...customizations
        };
        
        this.init();
    }

    init() {
        // Load Tawk.to widget
        this.loadTawkWidget();
        
        // Initialize custom features
        this.initializeCustomFeatures();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Enhanced Tawk Widget initialized');
    }

    loadTawkWidget() {
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        
        // Configure Tawk before loading
        Tawk_API.onLoad = () => {
            this.isReady = true;
            this.onWidgetReady();
            console.log('Tawk.to widget loaded successfully');
        };

        Tawk_API.onStatusChange = (status) => {
            this.onStatusChange(status);
        };

        Tawk_API.onChatMessageVisitor = (message) => {
            this.onVisitorMessage(message);
        };

        Tawk_API.onChatMessageAgent = (message) => {
            this.onAgentMessage(message);
        };

        Tawk_API.onChatStarted = () => {
            this.onChatStarted();
        };

        Tawk_API.onChatEnded = () => {
            this.onChatEnded();
        };

        // Load the script
        (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/' + this.widgetId + '/1j5mto36j';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1, s0);
        })();

        // Make Tawk_API globally available
        window.Tawk_API = Tawk_API;
    }

    initializeCustomFeatures() {
        // Auto-greeting
        if (this.customizations.autoGreeting) {
            setTimeout(() => {
                this.showAutoGreeting();
            }, this.customizations.autoGreetingDelay);
        }

        // Custom styles
        if (this.customizations.customStyles) {
            this.applyCustomStyles();
        }

        // Initialize quick actions
        this.initializeQuickActions();
    }

    setupEventListeners() {
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.onScrollStop();
            }, 150);
        });

        // Contact form submission tracking
        const contactForms = document.querySelectorAll('form[id*="contact"]');
        contactForms.forEach(form => {
            form.addEventListener('submit', () => {
                this.onContactFormSubmit();
            });
        });

        // Button click tracking
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') && e.target.textContent.toLowerCase().includes('contact')) {
                this.onContactButtonClick();
            }
        });
    }

    onWidgetReady() {
        // Process queued messages
        this.processMessageQueue();
        
        // Set custom attributes
        this.setVisitorAttributes();
        
        // Initialize business hours check
        this.checkBusinessHours();
        
        // Track widget load
        this.trackEvent('chat_widget_loaded');
    }

    onStatusChange(status) {
        console.log('Tawk status changed:', status);
        
        if (status === 'online') {
            this.showOnlineIndicator();
        } else if (status === 'away') {
            this.showAwayMessage();
        } else if (status === 'offline') {
            this.showOfflineMessage();
        }
        
        this.trackEvent('chat_status_change', { status });
    }

    onVisitorMessage(message) {
        console.log('Visitor message:', message);
        this.trackEvent('chat_message_sent', { 
            message_length: message.length,
            timestamp: new Date().toISOString()
        });
        
        // Auto-categorize message
        this.categorizeMessage(message);
    }

    onAgentMessage(message) {
        console.log('Agent message:', message);
        this.trackEvent('chat_message_received', { 
            message_length: message.length,
            timestamp: new Date().toISOString()
        });
    }

    onChatStarted() {
        console.log('Chat started');
        this.trackEvent('chat_started', {
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            referrer: document.referrer
        });
        
        // Send welcome message with context
        this.sendContextualWelcome();
    }

    onChatEnded() {
        console.log('Chat ended');
        this.trackEvent('chat_ended', {
            timestamp: new Date().toISOString(),
            session_duration: this.getSessionDuration()
        });
        
        // Show feedback prompt
        this.showFeedbackPrompt();
    }

    showAutoGreeting() {
        if (!this.isReady) {
            this.messageQueue.push(() => this.showAutoGreeting());
            return;
        }

        const currentPage = this.getCurrentPageContext();
        let greetingMessage = this.customizations.welcomeMessage;

        // Customize greeting based on current page
        switch(currentPage) {
            case 'work-experience':
                greetingMessage += ' I see you\'re viewing my work experience. Any questions about my projects?';
                break;
            case 'skills-expertise':
                greetingMessage += ' Interested in my technical skills? I\'d be happy to discuss how I can help with your data challenges.';
                break;
            case 'key-projects':
                greetingMessage += ' Looking at my project portfolio? Let me know if you\'d like details about any specific project.';
                break;
            case 'contact':
                greetingMessage += ' Ready to start a project? Let\'s discuss your requirements!';
                break;
            default:
                greetingMessage += ' Feel free to ask about my experience, skills, or how I can help with your next project.';
        }

        // Show greeting with slight delay for better UX
        setTimeout(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'greeting',
                    message: greetingMessage
                });
            }
        }, 1000);

        this.trackEvent('auto_greeting_shown', { page: currentPage });
    }

    showOnlineIndicator() {
        // Add visual indicator that chat is available
        const chatButton = document.querySelector('#tawkchat-status-container');
        if (chatButton) {
            chatButton.classList.add('online');
            chatButton.setAttribute('title', 'Patrice is online - Start a conversation!');
        }
    }

    showAwayMessage() {
        const awayMessage = 'I might not respond immediately, but please leave your message and I\'ll get back to you soon!';
        this.queueMessage(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'away_status',
                    message: awayMessage
                });
            }
        });
    }

    showOfflineMessage() {
        this.queueMessage(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'offline_status',
                    message: this.customizations.offlineMessage
                });
            }
        });
    }

    sendContextualWelcome() {
        const context = this.gatherPageContext();
        const welcomeData = {
            event: 'contextual_welcome',
            message: `Welcome! I'm Patrice Mirindi, Senior Data Analyst & Economic Development Consultant.`,
            context: context
        };

        this.queueMessage(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent(welcomeData);
            }
        });
    }

    setVisitorAttributes() {
        if (!window.Tawk_API || !window.Tawk_API.setAttributes) return;

        const attributes = {
            'Page URL': window.location.href,
            'Page Title': document.title,
            'User Agent': navigator.userAgent,
            'Screen Resolution': `${screen.width}x${screen.height}`,
            'Referrer': document.referrer || 'Direct',
            'Language': navigator.language,
            'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Visit Time': new Date().toISOString()
        };

        window.Tawk_API.setAttributes(attributes, function(error) {
            if (error) {
                console.error('Error setting Tawk attributes:', error);
            } else {
                console.log('Tawk attributes set successfully');
            }
        });
    }

    checkBusinessHours() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Business hours: Monday-Friday 9 AM - 6 PM CST (Winnipeg time)
        const isBusinessHours = (day >= 1 && day <= 5) && (hour >= 9 && hour < 18);
        
        if (!isBusinessHours) {
            setTimeout(() => {
                this.showBusinessHoursMessage();
            }, 2000);
        }

        this.trackEvent('business_hours_check', { 
            is_business_hours: isBusinessHours,
            current_hour: hour,
            current_day: day
        });
    }

    showBusinessHoursMessage() {
        const message = 'I\'m currently outside regular business hours (9 AM - 6 PM CST, Monday-Friday), but please leave your message and I\'ll respond within 24 hours. For urgent matters, you can also email me directly at patricemirindi@gmail.com.';
        
        this.queueMessage(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'business_hours_info',
                    message: message
                });
            }
        });
    }

    initializeQuickActions() {
        // Define quick action responses
        this.quickActions = {
            'services': 'I offer data analytics, economic development consulting, financial resilience assessment, and project management services. What type of project are you working on?',
            'experience': 'I have 8+ years of experience in data analytics and economic development, working across 12+ countries with organizations like the World Bank, GIZ, and Financial Resilience Institute.',
            'tools': 'I\'m proficient in R, Python, Stata, Power BI, Tableau, and various statistical and visualization tools. What kind of analysis are you looking to do?',
            'availability': 'I\'m currently available for new consulting projects. I typically respond within 24 hours and offer a free 30-minute initial consultation to discuss project needs.',
            'rates': 'My rates vary based on project scope, timeline, and complexity. I provide transparent pricing in detailed proposals. Would you like to discuss your specific project requirements?'
        };
    }

    categorizeMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple keyword matching for message categorization
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
            this.trackEvent('message_category', { category: 'pricing' });
        } else if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            this.trackEvent('message_category', { category: 'experience' });
        } else if (lowerMessage.includes('service') || lowerMessage.includes('help') || lowerMessage.includes('project')) {
            this.trackEvent('message_category', { category: 'services' });
        } else if (lowerMessage.includes('available') || lowerMessage.includes('timeline')) {
            this.trackEvent('message_category', { category: 'availability' });
        } else {
            this.trackEvent('message_category', { category: 'general' });
        }
    }

    showFeedbackPrompt() {
        setTimeout(() => {
            const feedbackMessage = 'Thank you for chatting with me! If you found this helpful, I\'d appreciate any feedback. You can also connect with me on LinkedIn or check out my full portfolio.';
            
            this.queueMessage(() => {
                if (window.Tawk_API && window.Tawk_API.addEvent) {
                    window.Tawk_API.addEvent({
                        event: 'feedback_prompt',
                        message: feedbackMessage
                    });
                }
            });
        }, 2000);
    }

    applyCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Custom Tawk Widget Styles */
            #tawk-chat-widget {
                --primary-color: #004085;
                --secondary-color: #FF6600;
            }
            
            .tawk-chat-container {
                border-radius: 12px !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
            }
            
            .tawk-chat-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
            }
            
            .tawk-message-container {
                font-family: 'Inter', sans-serif !important;
            }
            
            .tawk-button {
                background: var(--primary-color) !important;
                transition: all 0.3s ease !important;
            }
            
            .tawk-button:hover {
                background: var(--secondary-color) !important;
                transform: translateY(-2px) !important;
            }
            
            /* Online indicator */
            #tawkchat-status-container.online::after {
                content: '';
                position: absolute;
                top: -5px;
                right: -5px;
                width: 12px;
                height: 12px;
                background: #28a745;
                border: 2px solid white;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Page context helpers
    getCurrentPageContext() {
        const path = window.location.pathname;
        if (path.includes('work-experience')) return 'work-experience';
        if (path.includes('skills-expertise')) return 'skills-expertise';
        if (path.includes('key-projects')) return 'key-projects';
        if (path.includes('contact')) return 'contact';
        if (path.includes('about')) return 'about';
        return 'home';
    }

    gatherPageContext() {
        return {
            page: this.getCurrentPageContext(),
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
    }

    // Event tracking and handlers
    onPageHidden() {
        this.trackEvent('page_hidden', { timestamp: new Date().toISOString() });
    }

    onPageVisible() {
        this.trackEvent('page_visible', { timestamp: new Date().toISOString() });
    }

    onScrollStop() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > 75 && !this.hasShownScrollPrompt) {
            this.showScrollEngagementPrompt();
            this.hasShownScrollPrompt = true;
        }
    }

    showScrollEngagementPrompt() {
        setTimeout(() => {
            const message = 'I see you\'ve been exploring my portfolio! Any questions about my experience or how I can help with your project?';
            
            this.queueMessage(() => {
                if (window.Tawk_API && window.Tawk_API.addEvent) {
                    window.Tawk_API.addEvent({
                        event: 'scroll_engagement',
                        message: message
                    });
                }
            });
        }, 3000);

        this.trackEvent('scroll_engagement_prompt', { scroll_percent: 75 });
    }

    onContactFormSubmit() {
        setTimeout(() => {
            const message = 'I see you just submitted the contact form. I\'ll get back to you within 24 hours, but if you have any immediate questions, feel free to ask here!';
            
            this.queueMessage(() => {
                if (window.Tawk_API && window.Tawk_API.addEvent) {
                    window.Tawk_API.addEvent({
                        event: 'form_submission_followup',
                        message: message
                    });
                }
            });
        }, 2000);

        this.trackEvent('contact_form_submitted');
    }

    onContactButtonClick() {
        this.trackEvent('contact_button_clicked', { timestamp: new Date().toISOString() });
    }

    // Utility methods
    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const messageFunc = this.messageQueue.shift();
            messageFunc();
        }
    }

    queueMessage(messageFunc) {
        if (this.isReady) {
            messageFunc();
        } else {
            this.messageQueue.push(messageFunc);
        }
    }

    getSessionDuration() {
        // Calculate session duration if available
        if (this.sessionStart) {
            return new Date() - this.sessionStart;
        }
        return null;
    }

    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'chat',
                ...parameters
            });
        }
        
        // Console logging for debugging
        if (this.customizations.trackingEnabled) {
            console.log(`Chat Event: ${eventName}`, parameters);
        }
    }

    // Public API methods
    showWidget() {
        if (window.Tawk_API && window.Tawk_API.showWidget) {
            window.Tawk_API.showWidget();
        }
    }

    hideWidget() {
        if (window.Tawk_API && window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
        }
    }

    maximize() {
        if (window.Tawk_API && window.Tawk_API.maximize) {
            window.Tawk_API.maximize();
        }
    }

    minimize() {
        if (window.Tawk_API && window.Tawk_API.minimize) {
            window.Tawk_API.minimize();
        }
    }

    sendMessage(message) {
        this.queueMessage(() => {
            if (window.Tawk_API && window.Tawk_API.addEvent) {
                window.Tawk_API.addEvent({
                    event: 'custom_message',
                    message: message
                });
            }
        });
    }

    setVisitorName(name) {
        if (window.Tawk_API && window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                name: name
            });
        }
    }

    setVisitorEmail(email) {
        if (window.Tawk_API && window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                email: email
            });
        }
    }

    // Destroy method
    destroy() {
        if (window.Tawk_API && window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
        }
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('scroll', this.onScroll);
        
        console.log('Enhanced Tawk Widget destroyed');
    }
}

// Export for global use
window.EnhancedTawkWidget = EnhancedTawkWidget;

// Auto-initialize if widget ID is provided via data attribute
document.addEventListener('DOMContentLoaded', function() {
    const tawkScript = document.querySelector('script[data-tawk-id]');
    if (tawkScript) {
        const widgetId = tawkScript.getAttribute('data-tawk-id');
        const customizations = JSON.parse(tawkScript.getAttribute('data-customizations') || '{}');
        
        window.enhancedTawk = new EnhancedTawkWidget(widgetId, customizations);
    }
});
