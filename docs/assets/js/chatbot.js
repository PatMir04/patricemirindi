/* ==========================================================================
   SUPER INTELLIGENT BILINGUAL CHATBOT FOR PATRICE MIRINDI
   Complete Implementation: Profile Photo Button, Full French/English Support,
   Smart Intent Recognition, 10-Question Conversion, Complete Knowledge Base
   ========================================================================== */

class SuperIntelligentChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversations = this.loadConversations();
        this.contacts = this.loadContacts();
        this.currentConversationId = null;
        this.questionCount = 0;
        this.lastQuestionTime = Date.now();
        this.userLanguage = 'en'; // Default to English
        
        // COMPLETE KNOWLEDGE BASE - ALL COUNTRIES & EXPERTISE
        this.profile = {
            name: "Patrice Mirindi",
            origin: "Democratic Republic of Congo (DRC)",
            current_location: "Canada", // Privacy protected - no specific city
            nationality: "Congolese-Canadian",
            education: "MSc Agricultural Economics from University of Nairobi",
            languages: ["French (Native)", "English (Fluent)", "Swahili (Fluent)", "Lingala (Native)"],
            experience_years: "8+",
            email: "patricemirindi@gmail.com",
            linkedin: "linkedin.com/in/patricemirindi",
            github: "github.com/PatMir04",
            availability: "Currently available for new consulting projects",
            response_time: "within 24 hours",
            consultation: "Free 30-minute consultation available"
        };
        
        // COMPLETE COUNTRIES LIST - FROM YOUR WORK EXPERIENCE
        this.countries_worked = [
            "Democratic Republic of Congo",
            "Canada", 
            "Ghana",
            "Nigeria", 
            "Burundi",
            "Eritrea", 
            "Benin",
            "Burkina Faso",
            "Senegal",
            "Côte d'Ivoire", // Ivory Coast
            "Rwanda",
            "Kenya", 
            "Uganda", // CORRECTED: Uganda instead of Ethiopia
            "South Africa"
        ];
        
        this.current_role = {
            title: "Senior Data Analyst",
            organization: "Financial Resilience Institute",
            location: "Canada",
            start_date: "October 2024",
            status: "Current position"
        };
        
        // COMPREHENSIVE EXPERTISE AREAS
        this.expertise = {
            core_skills: [
                "Data Analytics & Statistical Modeling",
                "Financial Resilience Assessment", 
                "Agricultural Economics & Policy",
                "Economic Development Strategy",
                "Project Management (PMP Certified)",
                "Impact Evaluation & Measurement"
            ],
            technical: ["R Programming", "Python", "Stata", "Power BI", "SQL", "Excel", "SPSS", "Tableau"],
            economic_development: [
                "Financial resilience frameworks",
                "Poverty reduction strategies",
                "Statistical modeling for economic indicators", 
                "Policy assessment and evaluation",
                "Data-driven development solutions",
                "Economic impact analysis",
                "Sustainable development metrics",
                "Value chain development",
                "Food security analysis",
                "Gender transformative programming"
            ],
            specializations: [
                "Econometric modeling", 
                "Survey design and methodology", 
                "Policy analysis and evaluation",
                "Value chain development",
                "Impact measurement",
                "Financial inclusion research"
            ]
        };
        
        this.projects = {
            total_value: "$7.5 million",
            completed: "25+",
            countries: this.countries_worked.length + "+",
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
                <!-- Chat Button with PROFILE PHOTO -->
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
                            <img src="assets/img/patricemirindi.jpg" alt="Patrice Mirindi" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwNDA4NSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UE08L3RleHQ+PC9zdmc+'">
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
                            <button class="suggestion-btn" data-message="What countries have you worked in?">
                                <i class="fas fa-map"></i>
                                <span>Countries</span>
                            </button>
                            <button class="suggestion-btn" data-message="Tell me about economic development">
                                <i class="fas fa-chart-line"></i>
                                <span>Economic Work</span>
                            </button>
                            <button class="suggestion-btn" data-message="What is your experience?">
                                <i class="fas fa-briefcase"></i>
                                <span>Experience</span>
                            </button>
                            <button class="suggestion-btn" data-message="Are you available for consulting?">
                                <i class="fas fa-handshake"></i>
                                <span>Availability</span>
                            </button>
                            <button class="suggestion-btn" data-message="How can I contact you?">
                                <i class="fas fa-envelope"></i>
                                <span>Contact</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" placeholder="Ask me anything about Patrice's background, expertise, or countries he's worked in..." maxlength="500">
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
                
                /* PROFILE PHOTO CHAT BUTTON */
                .chat-button {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    border: 4px solid white;
                    overflow: hidden;
                }
                
                .chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 15px 40px rgba(0, 64, 133, 0.5);
                }
                
                .profile-button-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }
                
                .chat-button:hover .profile-button-image {
                    transform: scale(1.05);
                }
                
                /* Fallback if photo doesn't load */
                .fallback-button {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
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
                
                /* Conversion Message Styling */
                .conversion-message {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    margin: 10px 0;
                    text-align: center;
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }
                
                .conversion-message h4 {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                }
                
                .conversion-message p {
                    margin: 0 0 15px 0;
                    font-size: 14px;
                }
                
                .contact-button {
                    background: white;
                    color: #10b981;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .contact-button:hover {
                    background: #f0fdf4;
                    transform: translateY(-2px);
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
        
        // Detect language from user message
        this.userLanguage = this.detectLanguage(message);
        
        // Count questions for conversion trigger
        if (this.isQuestion(message)) {
            this.questionCount++;
            this.lastQuestionTime = Date.now();
        }
        
        // Reset counter if idle for 5 minutes
        if (Date.now() - this.lastQuestionTime > 300000) {
            this.questionCount = 0;
        }
        
        // Check for 10-question conversion trigger
        if (this.questionCount >= 10) {
            setTimeout(() => {
                this.showConversionMessage();
                this.questionCount = 0; // Reset after showing conversion
            }, 1500);
        }
        
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
    
    // ADVANCED LANGUAGE DETECTION
    detectLanguage(message) {
        const frenchWords = ['bonjour', 'salut', 'bonsoir', 'comment', 'quelles', 'sont', 'ses', 'où', 'vient', 'patrice', 'disponible', 'est-il', 'compétences', 'projets', 'contacter', 'dans', 'quels', 'pays', 'travaillé'];
        const wordCount = message.toLowerCase().split(' ').length;
        const frenchMatches = frenchWords.filter(word => message.toLowerCase().includes(word)).length;
        
        // If more than 20% of words are French, respond in French
        return (frenchMatches / wordCount) > 0.2 ? 'fr' : 'en';
    }
    
    isQuestion(message) {
        const questionWords = ['what', 'where', 'when', 'why', 'how', 'which', 'who', 'is', 'are', 'can', 'do', 'does', 'will', 'would', 'could', 'should', 
                               'qu\\'est-ce que', 'où', 'quand', 'pourquoi', 'comment', 'quel', 'quelle', 'quels', 'quelles', 'qui', 'est-ce que'];
        return questionWords.some(word => message.toLowerCase().includes(word)) || 
               message.includes('?');
    }
    
    // ENHANCED SMART RESPONSE GENERATION
    generateSmartResponse(message) {
        const msg = message.toLowerCase().trim();
        const isFrench = this.userLanguage === 'fr';
        
        // 1. GREETINGS - BOTH LANGUAGES
        if (this.isGreeting(msg)) {
            return this.getGreetingResponse(isFrench);
        }
        
        // 2. COUNTRIES QUESTION - MOST IMPORTANT FIX
        if (this.isCountriesQuestion(msg)) {
            return this.getCountriesResponse(isFrench);
        }\n        \n        // 3. ECONOMIC DEVELOPMENT QUESTIONS\n        if (this.isEconomicDevelopmentQuestion(msg)) {\n            return this.getEconomicDevelopmentResponse(isFrench);\n        }\n        \n        // 4. ORIGIN/LOCATION QUESTIONS\n        if (this.isOriginQuestion(msg)) {\n            return isFrench ? \n                `Patrice est originaire de la République Démocratique du Congo (RDC) et vit actuellement au ${this.profile.current_location}.` :\n                `Patrice is originally from the Democratic Republic of Congo (DRC) and currently lives in ${this.profile.current_location}.`;\n        }\n        \n        // 5. CONTACT INFORMATION\n        if (this.isContactQuestion(msg)) {\n            return isFrench ?\n                `Vous pouvez contacter Patrice à ${this.profile.email}. Il répond généralement ${this.profile.response_time} et offre une consultation gratuite de 30 minutes.` :\n                `You can reach Patrice at ${this.profile.email}. He typically responds ${this.profile.response_time} and offers a ${this.profile.consultation}.`;\n        }\n        \n        // 6. AVAILABILITY\n        if (this.isAvailabilityQuestion(msg)) {\n            return isFrench ?\n                `Oui! Patrice est actuellement disponible pour de nouveaux projets de consultation. Contactez-le à ${this.profile.email} pour discuter de vos besoins.` :\n                `Yes! Patrice is ${this.profile.availability}. You can contact him at ${this.profile.email} to discuss your project needs.`;\n        }\n        \n        // 7. EXPERIENCE & BACKGROUND  \n        if (this.isExperienceQuestion(msg)) {\n            return isFrench ?\n                `Patrice a plus de ${this.profile.experience_years} années d'expérience en économie du développement et analyse de données. Il a travaillé dans ${this.countries_worked.length}+ pays et a complété ${this.projects.completed} projets d'une valeur de plus de ${this.projects.total_value}.` :\n                `Patrice has ${this.profile.experience_years} years of experience in development economics and data analytics. He's worked across ${this.countries_worked.length}+ countries and has completed ${this.projects.completed} projects worth over ${this.projects.total_value}.`;\n        }\n        \n        // 8. CURRENT ROLE\n        if (this.isCurrentRoleQuestion(msg)) {\n            return isFrench ?\n                `Patrice travaille actuellement comme ${this.current_role.title} à ${this.current_role.organization} au ${this.current_role.location}. Il a commencé ce poste en ${this.current_role.start_date}.` :\n                `Patrice currently works as a ${this.current_role.title} at the ${this.current_role.organization} in ${this.current_role.location}. He started this role in ${this.current_role.start_date}.`;\n        }\n        \n        // 9. SKILLS & EXPERTISE\n        if (this.isSkillsQuestion(msg)) {\n            return isFrench ?\n                `Patrice se spécialise dans ${this.expertise.core_skills.slice(0, 3).join(', ')} et plus. Ses compétences techniques incluent ${this.expertise.technical.slice(0, 4).join(', ')}. Il détient une ${this.profile.education}.` :\n                `Patrice specializes in ${this.expertise.core_skills.slice(0, 3).join(', ')} and more. His technical skills include ${this.expertise.technical.slice(0, 4).join(', ')}. He has an ${this.profile.education}.`;\n        }\n        \n        // 10. PROJECTS\n        if (this.isProjectsQuestion(msg)) {\n            return isFrench ?\n                `Patrice a géré ${this.projects.completed} projets d'une valeur totale de ${this.projects.total_value}. Son travail a impacté ${this.projects.beneficiaries} vies dans ${this.projects.countries} pays avec un taux de succès de ${this.projects.success_rate}.` :\n                `Patrice has managed ${this.projects.completed} projects with a total value of ${this.projects.total_value}. His work has impacted ${this.projects.beneficiaries} lives across ${this.projects.countries} countries with a ${this.projects.success_rate} success rate.`;\n        }\n        \n        // 11. EDUCATION & LANGUAGES\n        if (this.isEducationQuestion(msg)) {\n            return isFrench ?\n                `Patrice détient une ${this.profile.education}. Il parle ${this.profile.languages.join(', ')}.` :\n                `Patrice holds an ${this.profile.education}. He speaks ${this.profile.languages.join(', ')}.`;\n        }\n        \n        // 12. DEFAULT - HELPFUL RESPONSE\n        return this.getHelpfulDefault(isFrench);\n    }\n    \n    // ENHANCED INTENT RECOGNITION FUNCTIONS\n    isGreeting(msg) {\n        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'bonjour', 'salut', 'bonsoir', 'ça va'];\n        return greetings.some(greeting => {\n            return msg === greeting || \n                   msg.startsWith(greeting + ' ') || \n                   msg.startsWith(greeting + ',') ||\n                   msg.startsWith(greeting + '!');\n        });\n    }\n    \n    // CRITICAL FIX: Countries Question Recognition\n    isCountriesQuestion(msg) {\n        return (msg.includes('countries') || msg.includes('country') || msg.includes('pays')) &&\n               (msg.includes('worked') || msg.includes('work') || msg.includes('experience') || \n                msg.includes('travaillé') || msg.includes('travail') || msg.includes('expérience')) &&\n               (msg.includes('patrice') || msg.includes('you') || msg.includes('he') || msg.includes('il'));\n    }\n    \n    // NEW: Economic Development Question Recognition\n    isEconomicDevelopmentQuestion(msg) {\n        return (msg.includes('economic development') || msg.includes('development work') ||\n                msg.includes('développement économique') || msg.includes('travail de développement') ||\n                msg.includes('poverty') || msg.includes('pauvreté') ||\n                msg.includes('policy') || msg.includes('politique') ||\n                msg.includes('resilience') || msg.includes('résilience') ||\n                msg.includes('financial health') || msg.includes('santé financière'));\n    }\n    \n    isOriginQuestion(msg) {\n        return (msg.includes('where') || msg.includes('où')) && \n               (msg.includes('from') || msg.includes('vient') || msg.includes('origin') || msg.includes('originaire')) &&\n               (msg.includes('patrice') || msg.includes('you') || msg.includes('il'));\n    }\n    \n    isContactQuestion(msg) {\n        return msg.includes('contact') || msg.includes('email') || msg.includes('reach') || \n               msg.includes('get in touch') || msg.includes('how to contact') ||\n               msg.includes('contacter') || msg.includes('comment le joindre');\n    }\n    \n    isAvailabilityQuestion(msg) {\n        return msg.includes('available') || msg.includes('availability') || \n               msg.includes('hire') || msg.includes('free') || msg.includes('busy') ||\n               msg.includes('disponible') || msg.includes('libre');\n    }\n    \n    isExperienceQuestion(msg) {\n        return msg.includes('experience') || msg.includes('background') || \n               msg.includes('career') || msg.includes('work history') ||\n               msg.includes('expérience') || msg.includes('parcours');\n    }\n    \n    isCurrentRoleQuestion(msg) {\n        return (msg.includes('current') && (msg.includes('job') || msg.includes('role') || \n               msg.includes('position') || msg.includes('work'))) ||\n               msg.includes('financial resilience institute') ||\n               msg.includes('poste actuel') || msg.includes('travail actuel');\n    }\n    \n    isSkillsQuestion(msg) {\n        return msg.includes('skills') || msg.includes('expertise') || msg.includes('specialization') ||\n               msg.includes('capabilities') || msg.includes('what can you do') || msg.includes('good at') ||\n               msg.includes('compétences') || msg.includes('spécialisation');\n    }\n    \n    isProjectsQuestion(msg) {\n        return msg.includes('project') || msg.includes('work') || msg.includes('portfolio') ||\n               msg.includes('case studies') || msg.includes('examples') ||\n               msg.includes('projets') || msg.includes('travaux');\n    }\n    \n    isEducationQuestion(msg) {\n        return msg.includes('education') || msg.includes('degree') || msg.includes('university') ||\n               msg.includes('qualification') || msg.includes('studied') || msg.includes('languages') ||\n               msg.includes('éducation') || msg.includes('diplôme') || msg.includes('université') ||\n               msg.includes('langues');\n    }\n    \n    // ENHANCED RESPONSE FUNCTIONS\n    getGreetingResponse(isFrench = false) {\n        const englishGreetings = [\n            \"Hi there! I'm Patrice's AI assistant. I can answer questions about his background, experience across 14+ countries, economic development work, or help you get in touch. What would you like to know?\",\n            \"Hello! Nice to meet you. I can tell you about Patrice's work in data analytics, his experience across Africa and Canada, or help schedule a consultation. How can I assist you?\",\n            \"Hey! Thanks for visiting. I know all about Patrice's expertise in economic development and can share information about the countries he's worked in. What interests you most?\"\n        ];\n        \n        const frenchGreetings = [\n            \"Bonjour! Je suis l'assistant IA de Patrice. Je peux répondre à vos questions sur son parcours, son expérience dans 14+ pays, son travail en développement économique, ou vous aider à le contacter. Que souhaitez-vous savoir?\",\n            \"Salut! Ravi de vous rencontrer. Je peux vous parler du travail de Patrice en analyse de données, de son expérience en Afrique et au Canada, ou vous aider à planifier une consultation. Comment puis-je vous aider?\",\n            \"Bonjour! Merci de votre visite. Je connais toute l'expertise de Patrice en développement économique et peux partager des informations sur les pays où il a travaillé. Qu'est-ce qui vous intéresse le plus?\"\n        ];\n        \n        const greetings = isFrench ? frenchGreetings : englishGreetings;\n        return greetings[Math.floor(Math.random() * greetings.length)];\n    }\n    \n    // CRITICAL FIX: Countries Response\n    getCountriesResponse(isFrench = false) {\n        const countries = this.countries_worked.join(', ');\n        \n        return isFrench ?\n            `Patrice a travaillé dans ${this.countries_worked.length} pays à travers l'Afrique et l'Amérique du Nord : ${countries}. Il se spécialise dans les projets de développement économique, d'analyse de données et de résilience financière dans ces régions.` :\n            `Patrice has worked in ${this.countries_worked.length} countries across Africa and North America: ${countries}. He specializes in economic development, data analytics, and financial resilience projects in these regions.`;\n    }\n    \n    // NEW: Economic Development Response\n    getEconomicDevelopmentResponse(isFrench = false) {\n        const economicAreas = this.expertise.economic_development.slice(0, 6).join(', ');\n        \n        return isFrench ?\n            `Patrice se spécialise dans le développement économique avec une expertise en : ${economicAreas}. Il a géré ${this.projects.completed} projets de développement d'une valeur de ${this.projects.total_value}, impactant ${this.projects.beneficiaries} vies dans ${this.countries_worked.length} pays.` :\n            `Patrice specializes in economic development with expertise in: ${economicAreas}. He has managed ${this.projects.completed} development projects worth ${this.projects.total_value}, impacting ${this.projects.beneficiaries} lives across ${this.countries_worked.length} countries.`;\n    }\n    \n    getHelpfulDefault(isFrench = false) {\n        return isFrench ?\n            `Je peux vous aider à en apprendre plus sur le parcours de Patrice (il vient de ${this.profile.origin}), son expertise en développement économique, les ${this.countries_worked.length} pays où il a travaillé, son portfolio de projets, ou sa disponibilité actuelle. Vous pouvez aussi le contacter directement à ${this.profile.email}. Quelle information spécifique souhaitez-vous?` :\n            `I can help you learn about Patrice's background (he's from ${this.profile.origin}), his economic development expertise, the ${this.countries_worked.length} countries he's worked in, his project portfolio, or current availability. You can also reach him directly at ${this.profile.email}. What specific information would you like?`;\n    }\n    \n    // 10-QUESTION CONVERSION SYSTEM\n    showConversionMessage() {\n        const conversionHTML = `\n            <div class=\"conversion-message\">\n                <h4>${this.userLanguage === 'fr' ? '🎯 Discutons directement!' : '🎯 Let\\'s Connect Directly!'}</h4>\n                <p>${this.userLanguage === 'fr' ? \n                    'Je vois que vous étudiez attentivement l\\'expertise de Patrice! Avec 10 questions détaillées, vous semblez sérieux concernant une collaboration potentielle.' : \n                    'I can see you\\'re thoroughly researching Patrice\\'s expertise! With 10 detailed questions, you seem serious about potential collaboration.'}</p>\n                <button class=\"contact-button\" onclick=\"window.location.href='mailto:patricemirindi@gmail.com?subject=Project Inquiry from Website Chatbot&body=Hi Patrice,%0A%0AI was exploring your website and have detailed questions about your expertise. I would like to discuss potential collaboration.%0A%0ABest regards,'\">\n                    ${this.userLanguage === 'fr' ? '📧 Contacter Patrice directement' : '📧 Contact Patrice Directly'}\n                </button>\n            </div>\n        `;\n        \n        const messagesContainer = document.getElementById('chat-messages');\n        messagesContainer.insertAdjacentHTML('beforeend', conversionHTML);\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n    }\n\n    addMessage(text, sender) {\n        const messagesContainer = document.getElementById('chat-messages');\n        const messageElement = document.createElement('div');\n        messageElement.className = `message ${sender}`;\n        \n        const now = new Date();\n        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });\n        \n        messageElement.innerHTML = `\n            <div class=\"message-text\">${text}</div>\n            <div class=\"message-time\">${timeString}</div>\n        `;\n        \n        messagesContainer.appendChild(messageElement);\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n        \n        this.messages.push({ text, sender, timestamp: now });\n    }\n\n    showTypingIndicator() {\n        const messagesContainer = document.getElementById('chat-messages');\n        const typingElement = document.createElement('div');\n        typingElement.className = 'typing-indicator';\n        typingElement.id = 'typing-indicator';\n        typingElement.innerHTML = `\n            <div class=\"typing-dot\"></div>\n            <div class=\"typing-dot\"></div>\n            <div class=\"typing-dot\"></div>\n        `;\n        \n        messagesContainer.appendChild(typingElement);\n        messagesContainer.scrollTop = messagesContainer.scrollHeight;\n    }\n\n    hideTypingIndicator() {\n        const typingIndicator = document.getElementById('typing-indicator');\n        if (typingIndicator) {\n            typingIndicator.remove();\n        }\n    }\n    \n    // CONVERSATION MANAGEMENT\n    startConversation() {\n        this.currentConversationId = 'conv_' + Date.now();\n        this.conversations[this.currentConversationId] = {\n            id: this.currentConversationId,\n            start_time: new Date().toISOString(),\n            messages: [],\n            user_info: {},\n            topics_discussed: [],\n            outcome: null\n        };\n    }\n    \n    endConversation() {\n        if (this.currentConversationId && this.conversations[this.currentConversationId]) {\n            this.conversations[this.currentConversationId].end_time = new Date().toISOString();\n            this.saveConversations();\n        }\n    }\n    \n    loadConversations() {\n        try {\n            return JSON.parse(localStorage.getItem('chatbot_conversations') || '{}');\n        } catch {\n            return {};\n        }\n    }\n    \n    saveConversations() {\n        try {\n            localStorage.setItem('chatbot_conversations', JSON.stringify(this.conversations));\n        } catch (e) {\n            console.log('Could not save conversations');\n        }\n    }\n    \n    loadContacts() {\n        try {\n            return JSON.parse(localStorage.getItem('chatbot_contacts') || '[]');\n        } catch {\n            return [];\n        }\n    }\n    \n    saveContacts() {\n        try {\n            localStorage.setItem('chatbot_contacts', JSON.stringify(this.contacts));\n        } catch (e) {\n            console.log('Could not save contacts');\n        }\n    }\n}\n\n// Initialize Super Intelligent Chatbot\ndocument.addEventListener('DOMContentLoaded', function() {\n    window.superIntelligentChatbot = new SuperIntelligentChatbot();\n    console.log('🤖 Super Intelligent Bilingual Chatbot initialized!');\n    console.log('✅ Features: Profile photo button, bilingual support, smart intent, 10-question conversion');\n    console.log('🌍 Countries: DRC, Canada, Ghana, Nigeria, Burundi, Eritrea, Benin, Burkina Faso, Senegal, Côte d\\'Ivoire, Rwanda, Kenya, Uganda, South Africa');\n});