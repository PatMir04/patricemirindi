/*
 * PATRICE MIRINDI - PROFESSIONAL CHAT WIDGET
 * Simple, robust implementation for professional consultation website
 */

class ProfessionalChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userLanguage = 'en';
        
        // Professional knowledge base
        this.profile = {
            name: "Patrice Mirindi",
            email: "patricemirindi@gmail.com",
            origin: "Democratic Republic of Congo (DRC)",
            location: "Winnipeg, MB, Canada",
            title: "Development Economist & Data Analytics Consultant",
            experience: "8+ years",
            availability: "Available for new consulting projects"
        };
        
        this.countries = [
            "Democratic Republic of Congo", "Canada", "Ghana", "Nigeria", 
            "Burundi", "Eritrea", "Benin", "Burkina Faso", "Senegal", 
            "Côte d'Ivoire", "Rwanda", "Kenya", "Uganda", "South Africa"
        ];
        
        this.init();
    }

    init() {
        try {
            this.createWidget();
            this.attachEvents();
            setTimeout(() => this.showWelcome(), 2000);
            console.log('✅ Professional chat widget initialized');
        } catch (error) {
            console.error('❌ Chat widget failed:', error);
            this.showFallback();
        }
    }

    createWidget() {
        // Remove any existing chat widgets
        const existing = document.getElementById('professional-chat');
        if (existing) existing.remove();
        
        const html = `
            <div id="professional-chat" class="chat-widget">
                <!-- Floating Chat Button -->
                <div id="chat-toggle" class="chat-button">
                    <div class="button-content">
                        <img src="./assets/img/patricemirindi.jpg" 
                             alt="Patrice Mirindi" 
                             class="profile-image"
                             onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">
                        <div class="chat-icon">💬</div>
                    </div>
                </div>
                
                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="header-info">
                            <img src="./assets/img/patricemirindi.jpg" 
                                 alt="Patrice" 
                                 class="avatar"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMwMDQwODUiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UE08L3RleHQ+PC9zdmc+'">
                            <div class="header-text">
                                <h4>Patrice Mirindi</h4>
                                <p>Available for Projects</p>
                            </div>
                        </div>
                        <button id="chat-close" class="close-btn">&times;</button>
                    </div>
                    
                    <div id="chat-messages" class="chat-messages">
                        <!-- Messages appear here -->
                    </div>
                    
                    <div class="quick-actions">
                        <button class="quick-btn" data-msg="What countries have you worked in?">🌍 Countries</button>
                        <button class="quick-btn" data-msg="What is your experience?">💼 Experience</button>
                        <button class="quick-btn" data-msg="Are you available?">✅ Availability</button>
                        <button class="quick-btn" data-msg="How to contact you?">📧 Contact</button>
                    </div>
                    
                    <div class="chat-input-section">
                        <input type="text" 
                               id="chat-input" 
                               placeholder="Ask about my background, projects, or expertise..." 
                               maxlength="300">
                        <button id="chat-send">📤</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('professional-chat-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'professional-chat-styles';
        styles.textContent = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .chat-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #004085, #FF6600);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 64, 133, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                border: 3px solid white;
                position: relative;
                overflow: hidden;
            }
            
            .chat-button:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 32px rgba(0, 64, 133, 0.4);
            }
            
            .button-content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .profile-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            
            .chat-icon {
                position: absolute;
                bottom: -5px;
                right: -5px;
                background: #FF6600;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                border: 2px solid white;
                animation: bounce 2s infinite;
            }
            
            .button-content.no-image .chat-icon {
                position: static;
                width: 32px;
                height: 32px;
                font-size: 18px;
                animation: none;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-8px); }
                60% { transform: translateY(-4px); }
            }
            
            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e1e5e9;
            }
            
            .chat-window.open {
                display: flex;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .chat-header {
                background: linear-gradient(135deg, #004085, #FF6600);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid white;
                object-fit: cover;
            }
            
            .header-text h4 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }
            
            .header-text p {
                margin: 0;
                font-size: 11px;
                opacity: 0.9;
            }
            
            .close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
                animation: fadeIn 0.3s ease;
            }
            
            .message.bot {
                background: white;
                color: #374151;
                align-self: flex-start;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                border: 1px solid #e1e5e9;
            }
            
            .message.user {
                background: linear-gradient(135deg, #004085, #FF6600);
                color: white;
                align-self: flex-end;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .quick-actions {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid #e1e5e9;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            
            .quick-btn {
                background: #f8fafc;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }
            
            .quick-btn:hover {
                background: #004085;
                color: white;
                border-color: #004085;
            }
            
            .chat-input-section {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid #e1e5e9;
                display: flex;
                gap: 12px;
                align-items: center;
            }
            
            #chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #e1e5e9;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
                background: #f8fafc;
            }
            
            #chat-input:focus {
                border-color: #FF6600;
                background: white;
            }
            
            #chat-send {
                width: 40px;
                height: 40px;
                background: #FF6600;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            #chat-send:hover {
                background: #e55100;
                transform: scale(1.05);
            }
            
            .typing {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                align-self: flex-start;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            
            .typing-dot:nth-child(1) { animation-delay: 0s; }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-10px); opacity: 1; }
            }
            
            /* Mobile responsive */
            @media (max-width: 480px) {
                .chat-widget {
                    bottom: 16px;
                    right: 16px;
                }
                
                .chat-window {
                    width: calc(100vw - 32px);
                    height: 400px;
                    right: -8px;
                }
                
                .chat-button {
                    width: 56px;
                    height: 56px;
                }
                
                .quick-actions {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    attachEvents() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-btn');
        
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChat());
        }
        
        if (close) {
            close.addEventListener('click', () => this.closeChat());
        }
        
        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-msg');
                if (message) this.handleMessage(message);
            });
        });
    }

    toggleChat() {
        const window = document.getElementById('chat-window');
        if (!window) return;
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            window.classList.add('open');
            this.isOpen = true;
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) input.focus();
            }, 300);
        }
    }

    closeChat() {
        const window = document.getElementById('chat-window');
        if (window) {
            window.classList.remove('open');
            this.isOpen = false;
        }
    }

    showWelcome() {
        const welcome = "👋 Hi! I'm Patrice's assistant. Ask me about his background, the countries he's worked in, or how to get in touch for consulting projects.";
        this.addMessage(welcome, 'bot');
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        this.handleMessage(message);
        input.value = '';
    }

    handleMessage(message) {
        this.addMessage(message, 'user');
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    getResponse(message) {
        const msg = message.toLowerCase();
        const isFrench = this.detectFrench(msg);
        
        // Countries question
        if ((msg.includes('countries') || msg.includes('country') || msg.includes('pays')) && 
            (msg.includes('work') || msg.includes('experience') || msg.includes('travail'))) {
            const countries = this.countries.join(', ');
            return isFrench ? 
                `Patrice a travaillé dans ${this.countries.length} pays: ${countries}. Il se spécialise en développement économique et analyse de données.` :
                `Patrice has worked in ${this.countries.length} countries: ${countries}. He specializes in economic development and data analytics.`;
        }
        
        // Contact/availability
        if (msg.includes('contact') || msg.includes('available') || msg.includes('hire') || 
            msg.includes('contacter') || msg.includes('disponible')) {
            return isFrench ?
                `Patrice est actuellement disponible pour de nouveaux projets. Contactez-le à ${this.profile.email} pour une consultation gratuite de 30 minutes.` :
                `Patrice is currently available for new projects. Contact him at ${this.profile.email} for a free 30-minute consultation.`;
        }
        
        // Experience
        if (msg.includes('experience') || msg.includes('background') || msg.includes('expérience')) {
            return isFrench ?
                `Patrice a ${this.profile.experience} d'expérience en économie du développement et analyse de données. Il a travaillé dans ${this.countries.length} pays.` :
                `Patrice has ${this.profile.experience} of experience in development economics and data analytics. He's worked across ${this.countries.length} countries.`;
        }
        
        // Origin
        if ((msg.includes('where') || msg.includes('où')) && 
            (msg.includes('from') || msg.includes('vient'))) {
            return isFrench ?
                `Patrice vient de ${this.profile.origin} et vit maintenant à ${this.profile.location}.` :
                `Patrice is from ${this.profile.origin} and currently lives in ${this.profile.location}.`;
        }
        
        // Greetings
        if (msg.match(/^(hi|hello|hey|bonjour|salut)\b/)) {
            return isFrench ?
                "Bonjour! Je peux vous renseigner sur l'expertise de Patrice, les pays où il a travaillé, ou vous aider à le contacter. Que souhaitez-vous savoir?" :
                "Hello! I can tell you about Patrice's expertise, the countries he's worked in, or help you get in touch. What would you like to know?";
        }
        
        // Default helpful response
        return isFrench ?
            `Je peux vous parler de l'expertise de Patrice (développement économique, ${this.countries.length} pays), ou vous aider à le contacter à ${this.profile.email}. Quelle information souhaitez-vous?` :
            `I can tell you about Patrice's expertise (economic development, ${this.countries.length} countries), or help you contact him at ${this.profile.email}. What would you like to know?`;
    }

    detectFrench(message) {
        const frenchWords = ['bonjour', 'salut', 'où', 'comment', 'dans', 'quels', 'pays', 'travaillé', 'expérience', 'contacter'];
        return frenchWords.some(word => message.includes(word));
    }

    addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'typing';
        typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    showFallback() {
        const fallback = `
            <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
                <a href="mailto:patricemirindi@gmail.com" 
                   style="background: #004085; color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(0,64,133,0.3); display: flex; align-items: center; gap: 8px;">
                    📧 Contact Patrice
                </a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', fallback);
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.professionalChat = new ProfessionalChatWidget();
    });
} else {
    window.professionalChat = new ProfessionalChatWidget();
}