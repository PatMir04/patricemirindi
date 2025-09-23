/* ==========================================================================
   SUPER INTELLIGENT BILINGUAL CHATBOT FOR PATRICE MIRINDI
   Enhanced: Profile Photo Button, Full French Support, Smart Intent Recognition
   ========================================================================== */

class SuperIntelligentChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversations = this.loadConversations();
        this.contacts = this.loadContacts();
        this.currentConversationId = null;
        
        // Complete and Accurate Knowledge Base
        this.profile = {
            name: "Patrice Mirindi",
            origin: "Democratic Republic of Congo (DRC)",
            current_location: "Winnipeg, MB, Canada",
            nationality: "Congolese-Canadian",
            education: "MSc Agricultural Economics from University of Nairobi",
            languages: ["French (Native)", "English (Fluent)", "Swahili (Fluent)", "Lingala (Native)"],
            experience_years: "8+",
            countries_worked: "15+",
            email: "patricemirindi@gmail.com",
            linkedin: "linkedin.com/in/patricemirindi",
            github: "github.com/PatMir04",
            availability: "Currently available for new consulting projects",
            response_time: "within 24 hours",
            consultation: "Free 30-minute consultation available"
        };
        
        this.current_role = {
            title: "Senior Data Analyst",
            organization: "Financial Resilience Institute",
            location: "Winnipeg, MB, Canada",
            start_date: "October 2024",
            status: "Current position"
        };
        
        this.expertise = {
            core_skills: [
                "Data Analytics & Statistical Modeling",
                "Financial Resilience Assessment", 
                "Agricultural Economics & Policy",
                "Economic Development Strategy",
                "Project Management (PMP Certified)",
                "Impact Evaluation & Measurement"
            ],
            technical: ["R Programming", "Python", "Stata", "Power BI", "SQL", "Excel"],
            specializations: ["Econometric modeling", "Survey design", "Policy analysis", "Value chain development"]
        };
        
        this.projects = {
            total_value: "7.5 million dollars",
            completed: "25+",
            countries: "15+",
            beneficiaries: "25,000+",
            success_rate: "100%"
        };
        
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.showGreeting();
        this.startConversation();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="super-chatbot" class="super-chatbot-widget">
                <!-- Chat Button with Profile Photo -->
                <div id="chat-button" class="chat-button">
                    <img src="assets/img/patricemirindi.jpg" alt="Patrice Mirindi" class="profile-button-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="fallback-button" style="display: none;">
                        <i class="fas fa-user"></i>
                        <div class="pm-indicator">PM</div>
                    </div>
                    <div class="chat-badge">💬</div>
                </div>
                
                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <img src="assets/img/patricemirindi.jpg" alt="Patrice Mirindi" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwNDA4NSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9IkF2ZW5pciIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBNPC90ZXh0Pjwvc3ZnPg=='">
                        </div>
                        <div class="chat-info">
                            <h4>Patrice Mirindi <span class="ai-badge">AI Assistant</span></h4>
                            <p>Development Economist & Data Analytics Consultant</p>
                            <div class="status-indicator">
                                <span class="status-dot"></span>
                                <span>Available for projects • Learning AI</span>
                            </div>
                        </div>
                        <div class="chat-controls">
                            <button id="chat-minimize" class="chat-control" title="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button id="chat-close" class="chat-control" title="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="smart-suggestions" id="smart-suggestions">
                        <div class="suggestions-title">💡 Ask me about:</div>
                        <div class="suggestions-grid">
                            <button class="suggestion-btn" data-message="Where are you from?">
                                <i class="fas fa-globe-africa"></i>
                                <span>Background</span>
                            </button>
                            <button class="suggestion-btn" data-message="What is your experience?">
                                <i class="fas fa-chart-bar"></i>
                                <span>Experience</span>
                            </button>
                            <button class="suggestion-btn" data-message="Tell me about your projects">
                                <i class="fas fa-project-diagram"></i>
                                <span>Projects</span>
                            </button>
                            <button class="suggestion-btn" data-message="Are you available for consulting?">
                                <i class="fas fa-handshake"></i>
                                <span>Availability</span>
                            </button>
                            <button class="suggestion-btn" data-message="How can I contact you?">
                                <i class="fas fa-envelope"></i>
                                <span>Contact</span>
                            </button>
                            <button class="suggestion-btn" data-message="What are your rates?">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Pricing</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" placeholder="Ask me anything about Patrice or current economic data..." maxlength="500">
                            <button id="chat-send" class="chat-send">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="chat-footer">
                            <small>🤖 AI-Powered Assistant • <a href="mailto:patricemirindi@gmail.com">Email for detailed discussions</a></small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .super-chatbot-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .chat-button {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, #004085, #FF6600);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    border: 3px solid white;
                    overflow: hidden;
                }
                
                .chat-button:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 15px 40px rgba(0, 64, 133, 0.5);
                }
                
                /* Profile Photo in Button */
                .profile-button-image {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid white;
                    transition: all 0.3s ease;
                }
                
                .chat-button:hover .profile-button-image {
                    transform: scale(1.05);
                }
                
                /* Fallback Button Style */
                .fallback-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    color: white;
                }
                
                .fallback-button i {
                    font-size: 28px;
                }
                
                .pm-indicator {
                    font-size: 10px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
                
                .chat-badge {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #FF6600;
                    color: white;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    animation: bounce 2s infinite;
                    border: 2px solid white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                .chat-window {
                    position: absolute;
                    bottom: 90px;
                    right: 0;
                    width: 450px;
                    height: 650px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #f8fbff;
                }
                
                .chat-window.open {
                    display: flex;
                    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .chat-header {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    color: white;
                    padding: 20px 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .chat-avatar img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 3px solid white;
                    object-fit: cover;
                }
                
                .chat-info {
                    flex: 1;
                }
                
                .chat-info h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .ai-badge {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 600;
                }
                
                .chat-info p {
                    margin: 2px 0 0 0;
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    margin-top: 4px;
                    font-weight: 600;
                }
                
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
                
                .chat-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .chat-control {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .chat-control:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: scale(1.1);
                }
                
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: #f8fbff;
                    min-height: 300px;
                }
                
                .message {
                    max-width: 85%;
                    padding: 16px 20px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.6;
                    animation: messageSlide 0.4s ease;
                    white-space: pre-line;
                    word-wrap: break-word;
                    position: relative;
                }
                
                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .message.bot {
                    background: white;
                    color: #374151;
                    align-self: flex-start;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 6px 20px rgba(0, 64, 133, 0.08);
                    border: 2px solid #f0f8ff;
                }
                
                .message.user {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 6px;
                }
                
                .message-time {
                    font-size: 10px;
                    opacity: 0.6;
                    margin-top: 8px;
                    text-align: right;
                }
                
                .smart-suggestions {
                    padding: 20px;
                    background: #f0f8ff;
                    border-top: 2px solid #004085;
                }
                
                .suggestions-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #004085;
                    margin-bottom: 12px;
                }
                
                .suggestions-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }
                
                .suggestion-btn {
                    background: white;
                    border: 2px solid #004085;
                    border-radius: 10px;
                    padding: 10px 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-align: center;
                }
                
                .suggestion-btn:hover {
                    background: #FF6600;
                    color: white;
                    border-color: #FF6600;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
                }
                
                .suggestion-btn i {
                    font-size: 14px;
                    color: #004085;
                }
                
                .suggestion-btn:hover i {
                    color: white;
                }
                
                .suggestion-btn span {
                    font-size: 9px;
                    font-weight: 600;
                    color: #004085;
                }
                
                .suggestion-btn:hover span {
                    color: white;
                }
                
                .chat-input-area {
                    padding: 20px;
                    background: white;
                    border-top: 2px solid #004085;
                }
                
                .chat-input-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                
                #chat-input {
                    flex: 1;
                    padding: 14px 18px;
                    border: 2px solid #004085;
                    border-radius: 10px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s ease;
                    color: #000000;
                    background: #f8fbff;
                }
                
                #chat-input:focus {
                    border-color: #FF6600;
                    box-shadow: 0 0 12px rgba(255, 102, 0, 0.3);
                    background: white;
                }
                
                .chat-send {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #FF6600, #CC5500);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .chat-send:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(255, 102, 0, 0.4);
                }
                
                .chat-footer {
                    text-align: center;
                    margin-top: 12px;
                }
                
                .chat-footer small {
                    color: #6C757D;
                    font-size: 11px;
                }
                
                .chat-footer a {
                    color: #004085;
                    text-decoration: none;
                    font-weight: 600;
                }
                
                .typing-indicator {
                    display: flex;
                    gap: 8px;
                    padding: 16px 20px;
                    align-self: flex-start;
                    background: white;
                    border-radius: 18px;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 6px 20px rgba(0, 64, 133, 0.08);
                }
                
                .typing-dot {
                    width: 10px;
                    height: 10px;
                    background: #6C757D;
                    border-radius: 50%;
                    animation: typing 1.4s infinite;
                }
                
                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-15px);
                        opacity: 1;
                    }
                }
                
                /* Contact Collection Modal */
                .contact-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                }
                
                .contact-form {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    width: 400px;
                    max-width: 90vw;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
                }
                
                .contact-form h3 {
                    color: #004085;
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #004085;
                    font-weight: 600;
                }
                
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #f0f8ff;
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.3s ease;
                }
                
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: #FF6600;
                }
                
                .form-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }
                
                .btn-primary, .btn-secondary {
                    flex: 1;
                    padding: 12px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    color: white;
                }
                
                .btn-secondary {
                    background: #f0f8ff;
                    color: #004085;
                    border: 2px solid #004085;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 480px) {
                    .super-chatbot-widget {
                        bottom: 15px;
                        right: 15px;
                    }
                    
                    .chat-window {
                        width: calc(100vw - 30px);
                        height: 80vh;
                        bottom: 90px;
                        right: -15px;
                    }
                    
                    .chat-button {
                        width: 60px;
                        height: 60px;
                    }
                    
                    .profile-button-image {
                        width: 54px;
                        height: 54px;
                    }
                    
                    .suggestions-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const chatClose = document.getElementById('chat-close');
        const chatMinimize = document.getElementById('chat-minimize');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        
        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatMinimize.addEventListener('click', () => this.minimizeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.handleUserMessage(message);
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatBadge = document.querySelector('.chat-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatBadge.style.display = 'none';
            this.isOpen = true;
            
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 500);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('open');
        this.isOpen = false;
        this.endConversation();
    }
    
    minimizeChat() {
        this.closeChat();
    }

    showGreeting() {
        setTimeout(() => {
            const greeting = "👋 Hi! I'm Patrice's AI assistant. I can answer questions about his background, projects, expertise, or current economic data. What would you like to know?"
            this.addMessage(greeting, 'bot');
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.handleUserMessage(message);
            input.value = '';
        }
    }

    handleUserMessage(message) {
        this.addMessage(message, 'user');
        
        // Save to conversation
        if (this.currentConversationId) {
            this.conversations[this.currentConversationId].messages.push({
                type: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response after realistic delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateSmartResponse(message);
            this.addMessage(response, 'bot');
            
            // Save bot response to conversation
            if (this.currentConversationId) {
                this.conversations[this.currentConversationId].messages.push({
                    type: 'bot',
                    content: response,
                    timestamp: new Date().toISOString()
                });
                this.saveConversations();
            }
            
        }, 1200 + Math.random() * 800);
    }
    
    // SMART Response Generation with Full Bilingual Support
    generateSmartResponse(message) {
        const msg = message.toLowerCase().trim();
        
        // Detect language (French vs English)
        const isFrench = this.detectFrench(msg);
        
        // 1. GREETINGS - BOTH LANGUAGES
        if (this.isGreeting(msg)) {
            return this.getGreetingResponse(isFrench);
        }
        
        // 2. ORIGIN/LOCATION QUESTIONS
        if (this.isOriginQuestion(msg)) {
            return isFrench ? 
                `Patrice est originaire de la République Démocratique du Congo (RDC) et vit actuellement à ${this.profile.current_location}.` :
                `Patrice is originally from the Democratic Republic of Congo (DRC) and currently lives in ${this.profile.current_location}.`;
        }
        
        // 3. CONTACT INFORMATION
        if (this.isContactQuestion(msg)) {
            return isFrench ?
                `Vous pouvez contacter Patrice à ${this.profile.email}. Il répond généralement ${this.profile.response_time} et offre une consultation gratuite de 30 minutes.` :
                `You can reach Patrice at ${this.profile.email}. He typically responds ${this.profile.response_time} and offers a ${this.profile.consultation}.`;
        }
        
        // 4. AVAILABILITY
        if (this.isAvailabilityQuestion(msg)) {
            return isFrench ?
                `Oui! Patrice est actuellement disponible pour de nouveaux projets de consultation. Contactez-le à ${this.profile.email} pour discuter de vos besoins.` :
                `Yes! Patrice is ${this.profile.availability}. You can contact him at ${this.profile.email} to discuss your project needs.`;
        }
        
        // 5. EXPERIENCE & BACKGROUND  
        if (this.isExperienceQuestion(msg)) {
            return isFrench ?
                `Patrice a plus de ${this.profile.experience_years} années d'expérience en économie du développement et analyse de données. Il a travaillé dans ${this.profile.countries_worked} pays et a complété ${this.projects.completed} projets d'une valeur de plus de ${this.projects.total_value}.` :
                `Patrice has ${this.profile.experience_years} years of experience in development economics and data analytics. He's worked across ${this.profile.countries_worked} countries and has completed ${this.projects.completed} projects worth over ${this.projects.total_value}.`;
        }
        
        // 6. CURRENT ROLE
        if (this.isCurrentRoleQuestion(msg)) {
            return isFrench ?
                `Patrice travaille actuellement comme ${this.current_role.title} à ${this.current_role.organization} à ${this.current_role.location}. Il a commencé ce poste en ${this.current_role.start_date}.` :
                `Patrice currently works as a ${this.current_role.title} at the ${this.current_role.organization} in ${this.current_role.location}. He started this role in ${this.current_role.start_date}.`;
        }
        
        // 7. SKILLS & EXPERTISE
        if (this.isSkillsQuestion(msg)) {
            return isFrench ?
                `Patrice se spécialise dans ${this.expertise.core_skills.slice(0, 3).join(', ')} et plus. Ses compétences techniques incluent ${this.expertise.technical.slice(0, 4).join(', ')}. Il détient une ${this.profile.education}.` :
                `Patrice specializes in ${this.expertise.core_skills.slice(0, 3).join(', ')} and more. His technical skills include ${this.expertise.technical.slice(0, 4).join(', ')}. He has an ${this.profile.education}.`;
        }
        
        // 8. PROJECTS
        if (this.isProjectsQuestion(msg)) {
            return isFrench ?
                `Patrice a géré ${this.projects.completed} projets d'une valeur totale de ${this.projects.total_value}. Son travail a impacté ${this.projects.beneficiaries} vies dans ${this.projects.countries} pays avec un taux de succès de ${this.projects.success_rate}.` :
                `Patrice has managed ${this.projects.completed} projects with a total value of ${this.projects.total_value}. His work has impacted ${this.projects.beneficiaries} lives across ${this.projects.countries} countries with a ${this.projects.success_rate} success rate.`;
        }
        
        // 9. EDUCATION
        if (this.isEducationQuestion(msg)) {
            return isFrench ?
                `Patrice détient une ${this.profile.education}. Il parle ${this.profile.languages.join(', ')}.` :
                `Patrice holds an ${this.profile.education}. He speaks ${this.profile.languages.join(', ')}.`;
        }
        
        // 10. PRICING/RATES
        if (this.isPricingQuestion(msg)) {
            setTimeout(() => this.showContactForm('pricing'), 2000);
            return isFrench ?
                `Les tarifs de Patrice dépendent de la portée et de la chronologie du projet. Il offre une tarification transparente avec une consultation gratuite de 30 minutes pour discuter de vos besoins spécifiques. Je peux collecter vos informations pour obtenir un devis personnalisé.` :
                `Patrice's rates depend on project scope and timeline. He offers transparent pricing with a free 30-minute consultation to discuss your specific needs. I can collect your information to get you a custom quote.`;
        }
        
        // 11. SCHEDULING
        if (this.isSchedulingQuestion(msg)) {
            setTimeout(() => this.showContactForm('schedule'), 2000);
            return isFrench ?
                `Je peux vous aider à planifier une consultation avec Patrice! Il offre des discussions de projet gratuites de 30 minutes. Laissez-moi collecter vos informations pour organiser cela.` :
                `I can help you schedule a consultation with Patrice! He offers free 30-minute project discussions. Let me collect your information to set this up.`;
        }
        
        // 12. LANGUAGES
        if (this.isLanguageQuestion(msg)) {
            return isFrench ?
                `Patrice parle ${this.profile.languages.join(', ')}. Cela l'aide à travailler efficacement avec des clients et organisations internationaux.` :
                `Patrice speaks ${this.profile.languages.join(', ')}. This helps him work effectively with international clients and organizations.`;
        }
        
        // 13. DEFAULT - HELPFUL BUT CONCISE
        return this.getHelpfulDefault(isFrench);
    }
    
    // Language Detection and Intent Recognition Functions
    detectFrench(msg) {
        const frenchWords = ['bonjour', 'salut', 'bonsoir', 'comment', 'quelles', 'sont', 'ses', 'où', 'vient', 'patrice', 'disponible', 'est-il', 'compétences', 'projets', 'contacter'];
        return frenchWords.some(word => msg.includes(word));
    }
    
    isGreeting(msg) {
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'bonjour', 'salut', 'bonsoir', 'ça va'];
        return greetings.some(greeting => {
            return msg === greeting || 
                   msg.startsWith(greeting + ' ') || 
                   msg.startsWith(greeting + ',') ||
                   msg.startsWith(greeting + '!');
        });
    }
    
    isOriginQuestion(msg) {
        return (msg.includes('where') || msg.includes('où')) && 
               (msg.includes('from') || msg.includes('vient') || msg.includes('origin')) &&
               (msg.includes('patrice') || msg.includes('you') || msg.includes('il'));
    }
    
    isLocationQuestion(msg) {
        return (msg.includes('where') && (msg.includes('live') || msg.includes('based') || msg.includes('located'))) ||
               (msg.includes('current') && msg.includes('location')) ||
               (msg.includes('où') && msg.includes('vit'));
    }
    
    isContactQuestion(msg) {
        return msg.includes('contact') || msg.includes('email') || msg.includes('reach') || 
               msg.includes('get in touch') || msg.includes('how to contact') ||
               msg.includes('contacter') || msg.includes('comment le joindre');
    }
    
    isAvailabilityQuestion(msg) {
        return msg.includes('available') || msg.includes('availability') || 
               msg.includes('hire') || msg.includes('free') || msg.includes('busy') ||
               msg.includes('disponible') || msg.includes('libre');
    }
    
    isExperienceQuestion(msg) {
        return msg.includes('experience') || msg.includes('background') || 
               msg.includes('career') || msg.includes('work history') ||
               msg.includes('expérience') || msg.includes('parcours');
    }
    
    isCurrentRoleQuestion(msg) {
        return msg.includes('current') && (msg.includes('job') || msg.includes('role') || 
               msg.includes('position') || msg.includes('work')) ||
               msg.includes('financial resilience institute') ||
               msg.includes('poste actuel') || msg.includes('travail actuel');
    }
    
    isSkillsQuestion(msg) {
        return msg.includes('skills') || msg.includes('expertise') || msg.includes('specialization') ||
               msg.includes('capabilities') || msg.includes('what can you do') || msg.includes('good at') ||
               msg.includes('compétences') || msg.includes('spécialisation');
    }
    
    isProjectsQuestion(msg) {
        return msg.includes('project') || msg.includes('work') || msg.includes('portfolio') ||
               msg.includes('case studies') || msg.includes('examples') ||
               msg.includes('projets') || msg.includes('travaux');
    }
    
    isEducationQuestion(msg) {
        return msg.includes('education') || msg.includes('degree') || msg.includes('university') ||
               msg.includes('qualification') || msg.includes('studied') || msg.includes('languages') ||
               msg.includes('éducation') || msg.includes('diplôme') || msg.includes('université') ||
               msg.includes('langues');
    }
    
    isPricingQuestion(msg) {
        return msg.includes('price') || msg.includes('cost') || msg.includes('rate') || 
               msg.includes('pricing') || msg.includes('budget') || msg.includes('fee') ||
               msg.includes('prix') || msg.includes('tarif') || msg.includes('coût');
    }
    
    isSchedulingQuestion(msg) {
        return msg.includes('schedule') || msg.includes('meeting') || msg.includes('call') ||
               msg.includes('consultation') || msg.includes('appointment') || msg.includes('book') ||
               msg.includes('planifier') || msg.includes('rendez-vous') || msg.includes('réunion');
    }
    
    isLanguageQuestion(msg) {
        return msg.includes('language') || msg.includes('speak') || msg.includes('french') ||
               msg.includes('english') || msg.includes('swahili') || msg.includes('lingala') ||
               msg.includes('langues') || msg.includes('parle') || msg.includes('français');
    }
    
    // Response Functions
    getGreetingResponse(isFrench = false) {
        const englishGreetings = [
            "Hi there! I'm Patrice's AI assistant. I can answer questions about his background, experience, projects, or help you get in touch. What would you like to know?",
            "Hello! Nice to meet you. I can tell you about Patrice's work in data analytics and development economics, or help schedule a consultation. How can I assist you?",
            "Hey! Thanks for visiting. I know all about Patrice's expertise and can share current economic data too. What interests you most?"
        ];
        
        const frenchGreetings = [
            "Bonjour! Je suis l'assistant virtuel de Patrice. Je peux répondre à vos questions sur son parcours, son expérience, ses projets, ou vous aider à le contacter. Que souhaitez-vous savoir?",
            "Salut! Ravi de vous rencontrer. Je peux vous parler du travail de Patrice en analyse de données et économie du développement, ou vous aider à planifier une consultation. Comment puis-je vous aider?",
            "Bonjour! Merci de votre visite. Je connais toute l'expertise de Patrice et peux aussi partager des données économiques actuelles. Qu'est-ce qui vous intéresse le plus?"
        ];
        
        const greetings = isFrench ? frenchGreetings : englishGreetings;
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    getHelpfulDefault(isFrench = false) {
        return isFrench ?
            `Je peux vous aider à en apprendre plus sur le parcours de Patrice (il vient de ${this.profile.origin}), son expertise en analyse de données et développement économique, son portfolio de projets, ou sa disponibilité actuelle. Vous pouvez aussi le contacter directement à ${this.profile.email}. Quelle information spécifique souhaitez-vous?` :
            `I can help you learn about Patrice's background (he's from ${this.profile.origin}), his expertise in data analytics and economic development, his project portfolio, or current availability. You can also reach him directly at ${this.profile.email}. What specific information would you like?`;
    }

    // Contact Form Functions
    showContactForm(type = 'contact') {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="contact-form">
                <h3>${type === 'schedule' ? '📅 Schedule Consultation' : type === 'pricing' ? '💰 Get Pricing Quote' : '📧 Contact Information'}</h3>
                <form id="contact-collection-form">
                    <div class="form-group">
                        <label for="contact-name">Full Name *</label>
                        <input type="text" id="contact-name" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-email">Email Address *</label>
                        <input type="email" id="contact-email" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-organization">Organization</label>
                        <input type="text" id="contact-organization">
                    </div>
                    <div class="form-group">
                        <label for="contact-interest">Project Interest *</label>
                        <select id="contact-interest" required>
                            <option value="">Select area of interest</option>
                            <option value="data-analytics">Data Analytics & Statistical Modeling</option>
                            <option value="financial-resilience">Financial Resilience Assessment</option>
                            <option value="agricultural-economics">Agricultural Economics & Policy</option>
                            <option value="economic-development">Economic Development Strategy</option>
                            <option value="project-management">Project Management</option>
                            <option value="impact-evaluation">Impact Evaluation & Measurement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" rows="3" placeholder="Tell me about your project or question..."></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn-primary">${type === 'schedule' ? 'Schedule Meeting' : type === 'pricing' ? 'Get Quote' : 'Send Info'}</button>
                        <button type="button" class="btn-secondary" id="cancel-contact">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('contact-collection-form');
        const cancelBtn = document.getElementById('cancel-contact');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitContactForm(type);
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    submitContactForm(type) {
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            organization: document.getElementById('contact-organization').value,
            interest: document.getElementById('contact-interest').value,
            message: document.getElementById('contact-message').value,
            type: type,
            timestamp: new Date().toISOString(),
            source: 'AI Chatbot'
        };
        
        this.contacts.push(formData);
        this.saveContacts();
        
        if (this.currentConversationId) {
            this.conversations[this.currentConversationId].user_info = formData;
            this.conversations[this.currentConversationId].outcome = type;
            this.saveConversations();
        }
        
        const confirmationMessage = type === 'schedule' ? 
            `🎉 Meeting request submitted! Thanks ${formData.name}! Patrice will email you at ${formData.email} within 24 hours to schedule your consultation.` :
            type === 'pricing' ?
            `✅ Quote request received! Thanks ${formData.name}! Patrice will send you a detailed proposal at ${formData.email} within 24 hours.` :
            `📧 Contact info saved! Thanks ${formData.name}! Patrice will respond to ${formData.email} within 24 hours.`;
            
        setTimeout(() => {
            this.addMessage(confirmationMessage, 'bot');
        }, 500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: now });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Conversation Management
    startConversation() {
        this.currentConversationId = 'conv_' + Date.now();
        this.conversations[this.currentConversationId] = {
            id: this.currentConversationId,
            start_time: new Date().toISOString(),
            messages: [],
            user_info: {},
            topics_discussed: [],
            outcome: null
        };
    }
    
    endConversation() {
        if (this.currentConversationId && this.conversations[this.currentConversationId]) {
            this.conversations[this.currentConversationId].end_time = new Date().toISOString();
            this.saveConversations();
        }
    }
    
    loadConversations() {
        try {
            return JSON.parse(localStorage.getItem('chatbot_conversations') || '{}');
        } catch {
            return {};
        }
    }
    
    saveConversations() {
        try {
            localStorage.setItem('chatbot_conversations', JSON.stringify(this.conversations));
        } catch (e) {
            console.log('Could not save conversations');
        }
    }
    
    loadContacts() {
        try {
            return JSON.parse(localStorage.getItem('chatbot_contacts') || '[]');
        } catch {
            return [];
        }
    }
    
    saveContacts() {
        try {
            localStorage.setItem('chatbot_contacts', JSON.stringify(this.contacts));
        } catch (e) {
            console.log('Could not save contacts');
        }
    }
}

// Initialize Super Intelligent Chatbot
document.addEventListener('DOMContentLoaded', function() {
    window.superIntelligentChatbot = new SuperIntelligentChatbot();
    console.log('🤖 Super Intelligent Bilingual Chatbot initialized!');
    console.log('✅ Profile photo button, French support, smart intent recognition');
});