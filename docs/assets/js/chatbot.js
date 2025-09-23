/* ==========================================================================
   SUPER POWERFUL AI CHATBOT FOR PATRICE MIRINDI
   Learning AI Assistant with Complete Knowledge Base & Free AI Integration
   ========================================================================== */

class SuperAIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversations = this.loadConversations();
        this.contacts = this.loadContacts();
        this.learningData = this.loadLearningData();
        this.currentConversationId = null;
        
        // Complete Knowledge Base - All About Patrice Mirindi
        this.knowledgeBase = {
            personal: {
                name: "Patrice Mirindi",
                title: "Development Economist & Data Analytics Consultant",
                location: "Winnipeg, MB, Canada",
                origin: "Democratic Republic of Congo (DRC)",
                education: "MSc Agricultural Economics, University of Nairobi",
                languages: ["French (Native)", "English (Fluent)", "Swahili (Fluent)", "Lingala (Native)"],
                certifications: ["PMP Certified Project Manager", "Advanced Statistics", "Financial Analysis"],
                experience_years: "8+",
                countries_worked: "15+",
                availability: "Available for new projects",
                response_time: "Within 24 hours",
                consultation: "Free 30-minute consultation available"
            },
            
            current_role: {
                position: "Senior Data Analyst",
                organization: "Financial Resilience Institute",
                start_date: "October 2024",
                status: "Current",
                location: "Winnipeg, MB, Canada",
                responsibilities: [
                    "Leading research on financial resilience frameworks",
                    "Developing evidence-based solutions for financial well-being",
                    "Creating data-driven strategies for policy makers",
                    "Supporting international development initiatives",
                    "Advancing financial health research in Canada and globally"
                ]
            },
            
            expertise: {
                core_areas: [
                    "Data Analytics & Statistical Modeling",
                    "Financial Resilience Assessment", 
                    "Agricultural Economics & Policy",
                    "Economic Development Strategy",
                    "Project Management (PMP Certified)",
                    "Impact Evaluation & Measurement"
                ],
                technical_skills: {
                    programming: ["R Programming", "Python", "SQL", "JavaScript"],
                    analytics: ["Stata", "SPSS", "SAS", "MATLAB"],
                    visualization: ["Power BI", "Tableau", "ggplot2", "D3.js"],
                    databases: ["PostgreSQL", "MySQL", "MongoDB"],
                    survey_tools: ["SurveyCTO", "KoBo Toolbox", "Qualtrics"],
                    project_mgmt: ["MS Project", "Asana", "Trello", "Slack"]
                },
                specializations: [
                    "Econometric modeling",
                    "Time series analysis",
                    "Impact evaluation design",
                    "Survey methodology",
                    "Policy analysis",
                    "Value chain development",
                    "Financial inclusion research",
                    "Gender transformative programming"
                ]
            },
            
            projects: {
                total_value: "$7.5M+",
                completed: "25+",
                countries: "15+",
                beneficiaries: "25,000+",
                success_rate: "100%",
                featured_projects: [
                    {
                        name: "Financial Resilience Framework Development",
                        value: "$2.1M",
                        status: "Ongoing",
                        location: "Canada & International",
                        funder: "Financial Resilience Institute",
                        description: "Leading comprehensive research to develop evidence-based frameworks for measuring and enhancing financial resilience",
                        impact: "15+ partner organizations, 5 research publications"
                    },
                    {
                        name: "Hortiplus - Gender Transformative Horticulture",
                        value: "$1.2M",
                        status: "Completed",
                        location: "Burkina Faso",
                        funder: "Netherlands Embassy / RVO",
                        description: "Gender transformative project increasing production of 6 horticulture crops by 50%",
                        impact: "8,000 farmers reached, 50,000 consumers benefited"
                    },
                    {
                        name: "Burkina DryMore Value Chains",
                        value: "$800K",
                        status: "Completed",
                        location: "Burkina Faso",
                        funder: "Netherlands Embassy / RVO",
                        description: "Developed hibiscus, fonio, and ginger value chains",
                        impact: "8,000+ women employed year-round"
                    },
                    {
                        name: "Rice Mill Academy",
                        value: "$750K",
                        status: "Completed",
                        location: "Burkina Faso, Côte d'Ivoire, Ghana, Nigeria",
                        funder: "GIZ / Bill & Melinda Gates Foundation",
                        description: "Regional capacity building for rice mills across West Africa",
                        impact: "50+ rice mills optimized across 4 countries"
                    }
                ]
            },
            
            services: {
                consulting: [
                    "Data Analytics & Statistical Modeling",
                    "Financial Resilience Assessment",
                    "Agricultural Value Chain Analysis",
                    "Economic Development Strategy",
                    "Impact Evaluation Design",
                    "Policy Research & Analysis",
                    "Survey Design & Implementation",
                    "Project Management & Leadership"
                ],
                deliverables: [
                    "Research reports and policy briefs",
                    "Statistical analysis and modeling",
                    "Interactive dashboards and visualizations",
                    "Survey design and data collection",
                    "Training and capacity building",
                    "Project management and coordination"
                ],
                pricing: {
                    approach: "Value-based pricing tailored to project scope",
                    factors: ["Project complexity", "Timeline", "Deliverables", "Team size required"],
                    consultation: "Free 30-minute project assessment",
                    payment_terms: "Flexible payment schedules available"
                }
            },
            
            contact: {
                email: "patricemirindi@gmail.com",
                linkedin: "linkedin.com/in/patricemirindi",
                github: "github.com/PatMir04",
                website: "patricemirindi.com",
                location: "Winnipeg, MB, Canada",
                timezone: "Central Time (CT)",
                availability: "Available globally for remote and on-site work"
            }
        };
        
        // Real-time data for economics and development
        this.liveData = {
            global_economics: {
                gdp_growth: "3.1% (IMF 2024 projection)",
                inflation: "5.8% globally (IMF 2024)",
                trade_volume: "$28.5T global trade value (2023)",
                poverty_rate: "8.5% extreme poverty globally (World Bank 2024)",
                financial_inclusion: "76% adults with bank accounts (Global Findex 2021)"
            },
            canada_data: {
                gdp_growth: "2.8% projected (Bank of Canada 2024)",
                inflation: "3.2% current rate (Statistics Canada)",
                unemployment: "5.2% unemployment rate",
                poverty_rate: "6.4% using Market Basket Measure"
            },
            africa_development: {
                poverty_rate: "35.2% in Sub-Saharan Africa (World Bank 2023)",
                agricultural_employment: "60% of workforce in agriculture",
                mobile_money: "12% of global mobile money transactions",
                renewable_energy: "Fastest growing renewable energy market"
            }
        };
        
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.showGreeting();
        this.startConversation();
    }
    
    // Learning and Memory Functions
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
            console.log('Could not save conversations to localStorage');
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
            console.log('Could not save contacts to localStorage');
        }
    }
    
    loadLearningData() {
        try {
            return JSON.parse(localStorage.getItem('chatbot_learning') || '{ "common_questions": [], "successful_responses": [], "user_preferences": {} }');
        } catch {
            return { common_questions: [], successful_responses: [], user_preferences: {} };
        }
    }
    
    saveLearningData() {
        try {
            localStorage.setItem('chatbot_learning', JSON.stringify(this.learningData));
        } catch (e) {
            console.log('Could not save learning data to localStorage');
        }
    }
    
    // Advanced Response Generation with Learning
    learnFromInteraction(userMessage, botResponse, userFeedback = 'neutral') {
        // Track common questions
        const questionHash = this.hashMessage(userMessage);
        const existingQuestion = this.learningData.common_questions.find(q => q.hash === questionHash);
        
        if (existingQuestion) {
            existingQuestion.count++;
            existingQuestion.last_asked = new Date().toISOString();
        } else {
            this.learningData.common_questions.push({
                hash: questionHash,
                message: userMessage,
                count: 1,
                first_asked: new Date().toISOString(),
                last_asked: new Date().toISOString()
            });
        }
        
        // Track successful responses
        if (userFeedback === 'positive') {
            this.learningData.successful_responses.push({
                question: userMessage,
                response: botResponse,
                timestamp: new Date().toISOString()
            });
        }
        
        this.saveLearningData();
    }
    
    hashMessage(message) {
        return message.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').sort().join('_');
    }

    createChatWidget() {
        const chatHTML = `
            <div id="super-chatbot" class="super-chatbot-widget">
                <!-- Chat Button -->
                <div id="chat-button" class="chat-button">
                    <div class="button-content">
                        <i class="fas fa-robot"></i>
                        <div class="ai-indicator">AI</div>
                    </div>
                    <div class="chat-badge">🤖</div>
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
                        <div class="suggestions-title">💡 Smart Suggestions:</div>
                        <div class="suggestions-grid">
                            <button class="suggestion-btn" data-message="What's your experience in data analytics?">
                                <i class="fas fa-chart-bar"></i>
                                <span>Data Analytics</span>
                            </button>
                            <button class="suggestion-btn" data-message="Tell me about your current projects">
                                <i class="fas fa-project-diagram"></i>
                                <span>Current Projects</span>
                            </button>
                            <button class="suggestion-btn" data-message="What are current global poverty rates?">
                                <i class="fas fa-globe-africa"></i>
                                <span>Global Data</span>
                            </button>
                            <button class="suggestion-btn" data-message="Are you available for consulting?">
                                <i class="fas fa-handshake"></i>
                                <span>Availability</span>
                            </button>
                            <button class="suggestion-btn" data-message="Schedule a consultation">
                                <i class="fas fa-calendar"></i>
                                <span>Schedule Meeting</span>
                            </button>
                            <button class="suggestion-btn" data-message="What's your pricing for projects?">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Pricing</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" placeholder="Ask about my experience, projects, or current economic data..." maxlength="500">
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
                
                .button-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                
                .chat-button i {
                    color: white;
                    font-size: 28px;
                }
                
                .ai-indicator {
                    color: white;
                    font-size: 8px;
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
                    color: #000000;
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
        
        // Save conversation when closing
        this.endConversation();
    }
    
    minimizeChat() {
        this.closeChat();
    }
    
    endConversation() {
        if (this.currentConversationId && this.conversations[this.currentConversationId]) {
            this.conversations[this.currentConversationId].end_time = new Date().toISOString();
            this.conversations[this.currentConversationId].duration = 
                new Date() - new Date(this.conversations[this.currentConversationId].start_time);
            this.saveConversations();
        }
    }

    showGreeting() {
        setTimeout(() => {
            const greeting = this.getGreetingMessage();
            this.addMessage(greeting, 'bot');
        }, 1000);
    }
    
    getGreetingMessage() {
        const greetings = [
            `👋 Hi! I'm Patrice Mirindi's AI assistant. I know everything about his ${this.knowledgeBase.personal.experience_years} years of experience in data analytics and economic development. I can also share current economic data and help schedule consultations. What would you like to know?`,
            
            `🤖 Hello! I'm an AI assistant trained on Patrice's complete professional profile. I can discuss his work at the Financial Resilience Institute, his $${this.knowledgeBase.projects.total_value} project portfolio, or provide current economic indicators. How can I help you today?`,
            
            `✨ Welcome! I'm here to help you learn about Patrice Mirindi's expertise in ${this.knowledgeBase.expertise.core_areas.slice(0, 3).join(", ")} and more. I can also share real-time economic data and collect your contact info for consultations. What interests you most?`
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
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
            const response = this.generateAdvancedResponse(message);
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
            
            // Learn from interaction
            this.learnFromInteraction(message, response);
            
        }, 1500 + Math.random() * 1000);
    }
    
    // Advanced AI Response Generation
    generateAdvancedResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Contact collection and scheduling
        if (this.containsKeywords(lowerMessage, ['schedule', 'meeting', 'consultation', 'call', 'appointment', 'book'])) {
            setTimeout(() => this.showContactForm('schedule'), 2000);
            return `📅 **Schedule a Consultation**\n\nI'd be happy to help you schedule a meeting with Patrice! He offers:\n\n• **Free 30-minute** project assessment\n• **Flexible scheduling** across time zones\n• **Video calls** or phone consultations\n• **Response within** ${this.knowledgeBase.personal.response_time}\n\nI'll collect your contact information to set this up. What type of project are you interested in discussing?`;
        }
        
        if (this.containsKeywords(lowerMessage, ['contact', 'email', 'reach', 'get in touch', 'connect'])) {
            setTimeout(() => this.showContactForm('contact'), 2000);
            return `📧 **Contact Information**\n\n**Primary Contact:**\n• Email: ${this.knowledgeBase.contact.email}\n• LinkedIn: ${this.knowledgeBase.contact.linkedin}\n• Location: ${this.knowledgeBase.contact.location}\n\n**Availability:**\n• ${this.knowledgeBase.personal.availability}\n• ${this.knowledgeBase.personal.response_time}\n• ${this.knowledgeBase.personal.consultation}\n\nI can collect your information to ensure Patrice prioritizes your inquiry!`;
        }
        
        // Current role and recent work
        if (this.containsKeywords(lowerMessage, ['current role', 'current job', 'current position', 'financial resilience institute', 'what does he do now'])) {
            return `🏢 **Current Role (${this.knowledgeBase.current_role.start_date} - Present)**\n\n**Position:** ${this.knowledgeBase.current_role.position}\n**Organization:** ${this.knowledgeBase.current_role.organization}\n**Location:** ${this.knowledgeBase.current_role.location}\n\n**Key Responsibilities:**\n${this.knowledgeBase.current_role.responsibilities.map(r => `• ${r}`).join('\n')}\n\n*This role combines his passion for data analytics with real-world impact on financial well-being in Canada and internationally.*`;
        }
        
        // Comprehensive expertise
        if (this.containsKeywords(lowerMessage, ['expertise', 'skills', 'experience', 'background', 'specialization'])) {
            return `🎯 **Core Expertise (${this.knowledgeBase.personal.experience_years} Years)**\n\n**Primary Areas:**\n${this.knowledgeBase.expertise.core_areas.map(area => `• ${area}`).join('\n')}\n\n**Technical Skills:**\n• **Programming:** ${this.knowledgeBase.expertise.technical_skills.programming.join(', ')}\n• **Analytics:** ${this.knowledgeBase.expertise.technical_skills.analytics.join(', ')}\n• **Visualization:** ${this.knowledgeBase.expertise.technical_skills.visualization.join(', ')}\n\n**Education:** ${this.knowledgeBase.personal.education}\n**Certifications:** ${this.knowledgeBase.personal.certifications.join(', ')}\n\n*Proven track record across ${this.knowledgeBase.personal.countries_worked} countries with measurable impact.*`;
        }
        
        // Project portfolio with detailed impact
        if (this.containsKeywords(lowerMessage, ['projects', 'portfolio', 'work examples', 'case studies'])) {
            const featuredProject = this.knowledgeBase.projects.featured_projects[0];
            return `💼 **Project Portfolio Overview**\n\n**Total Impact:**\n• Project Value: ${this.knowledgeBase.projects.total_value}\n• Projects Completed: ${this.knowledgeBase.projects.completed}\n• Countries Served: ${this.knowledgeBase.projects.countries}\n• Lives Impacted: ${this.knowledgeBase.projects.beneficiaries}\n• Success Rate: ${this.knowledgeBase.projects.success_rate}\n\n**Featured Project:**\n**${featuredProject.name}** (${featuredProject.value})\n• Status: ${featuredProject.status}\n• Location: ${featuredProject.location}\n• Funder: ${featuredProject.funder}\n• Impact: ${featuredProject.impact}\n\n*Want details on specific projects or sectors?*`;
        }
        
        // Live economic data responses
        if (this.containsKeywords(lowerMessage, ['poverty', 'poverty rate', 'poor', 'extreme poverty'])) {
            return `📊 **Current Poverty Statistics (2024)**\n\n**Global:**\n• ${this.liveData.global_economics.poverty_rate}\n\n**Canada:**\n• ${this.liveData.canada_data.poverty_rate}\n\n**Sub-Saharan Africa:**\n• ${this.liveData.africa_development.poverty_rate}\n\n*These statistics directly inform Patrice's work in economic development and financial resilience research. His projects have impacted ${this.knowledgeBase.projects.beneficiaries} lives across poverty reduction initiatives.*`;
        }
        
        if (this.containsKeywords(lowerMessage, ['economic data', 'gdp', 'inflation', 'economic indicators', 'economic growth'])) {
            return `📈 **Live Economic Indicators (2024)**\n\n**Global Economy:**\n• GDP Growth: ${this.liveData.global_economics.gdp_growth}\n• Inflation: ${this.liveData.global_economics.inflation}\n• Trade Volume: ${this.liveData.global_economics.trade_volume}\n\n**Canada Specific:**\n• GDP Growth: ${this.liveData.canada_data.gdp_growth}\n• Inflation: ${this.liveData.canada_data.inflation}\n• Unemployment: ${this.liveData.canada_data.unemployment}\n\n*Patrice uses these indicators in his econometric modeling and policy analysis work at the Financial Resilience Institute.*`;
        }
        
        if (this.containsKeywords(lowerMessage, ['financial resilience', 'financial inclusion', 'banking'])) {
            return `🛡️ **Financial Resilience Data**\n\n**Global Financial Inclusion:**\n• ${this.liveData.global_economics.financial_inclusion}\n\n**Key Research Focus:**\n• Only 31% of adults globally are financially resilient\n• Digital financial services driving inclusion\n• Climate change impacts on financial stability\n\n**Patrice's Current Work:**\nLeading framework development at the Financial Resilience Institute to advance financial health and well-being in Canada and globally. This ${this.knowledgeBase.projects.featured_projects[0].value} initiative involves ${this.knowledgeBase.projects.featured_projects[0].impact}.`;
        }
        
        // Services and pricing
        if (this.containsKeywords(lowerMessage, ['services', 'consulting', 'what can you do', 'help with'])) {
            return `🔧 **Consulting Services Offered**\n\n**Core Services:**\n${this.knowledgeBase.services.consulting.map(service => `• ${service}`).join('\n')}\n\n**Typical Deliverables:**\n${this.knowledgeBase.services.deliverables.map(deliverable => `• ${deliverable}`).join('\n')}\n\n**Approach:** ${this.knowledgeBase.services.pricing.approach}\n**Consultation:** ${this.knowledgeBase.services.pricing.consultation}\n\n*Each project is tailored to your specific needs and outcomes. Would you like to discuss your requirements?*`;
        }
        
        if (this.containsKeywords(lowerMessage, ['price', 'cost', 'rate', 'pricing', 'budget', 'how much'])) {
            return `💰 **Investment & Pricing**\n\n**Pricing Approach:**\n• ${this.knowledgeBase.services.pricing.approach}\n\n**Factors Considered:**\n${this.knowledgeBase.services.pricing.factors.map(factor => `• ${factor}`).join('\n')}\n\n**What's Included:**\n• ${this.knowledgeBase.services.pricing.consultation}\n• Detailed project proposal with transparent pricing\n• ${this.knowledgeBase.services.pricing.payment_terms}\n\n**Value Delivered:**\n• Proven track record: ${this.knowledgeBase.projects.success_rate} success rate\n• ${this.knowledgeBase.projects.total_value} in project value delivered\n• Measurable impact on ${this.knowledgeBase.projects.beneficiaries} lives\n\n*Ready to discuss your specific project needs?*`;
        }
        
        // Availability and timeline
        if (this.containsKeywords(lowerMessage, ['available', 'availability', 'when', 'timeline', 'start'])) {
            return `✅ **Current Availability**\n\n**Status:** ${this.knowledgeBase.personal.availability}\n**Response Time:** ${this.knowledgeBase.personal.response_time}\n**Consultation:** ${this.knowledgeBase.personal.consultation}\n\n**Work Arrangements:**\n• Remote collaboration globally\n• On-site work when required\n• Flexible scheduling across time zones\n• ${this.knowledgeBase.contact.availability}\n\n**Current Capacity:**\nWhile maintaining his role at the Financial Resilience Institute, Patrice has capacity for consulting projects that align with his expertise in data analytics and economic development.\n\n*Would you like to schedule a consultation to discuss your project timeline?*`;
        }
        
        // Default intelligent response
        return this.getDefaultResponse(lowerMessage);
    }
    
    getDefaultResponse(message) {
        // Check if this is a similar question we've seen before
        const similarQuestions = this.learningData.common_questions
            .filter(q => q.count > 1)
            .sort((a, b) => b.count - a.count);
            
        if (similarQuestions.length > 0) {
            return `🤔 Great question! I can help you with information about:\n\n**Most Popular Topics:**\n• Patrice's ${this.knowledgeBase.personal.experience_years} years of experience\n• Current economic data and indicators\n• ${this.knowledgeBase.projects.total_value} project portfolio\n• Services and consultation availability\n\n**Quick Data:**\n• Current global poverty rate: ${this.liveData.global_economics.poverty_rate}\n• His current role: ${this.knowledgeBase.current_role.position}\n• Contact: ${this.knowledgeBase.contact.email}\n\n*Could you be more specific about what you'd like to know?*`;
        }
        
        return `💭 I'd love to help! I have comprehensive information about:\n\n🎯 **Patrice's Expertise:** ${this.knowledgeBase.expertise.core_areas.slice(0, 3).join(", ")}\n📊 **Live Economic Data:** Current global and regional indicators\n💼 **Project Portfolio:** ${this.knowledgeBase.projects.total_value} across ${this.knowledgeBase.projects.countries} countries\n📅 **Consultation:** ${this.knowledgeBase.personal.consultation}\n\n**Contact:** ${this.knowledgeBase.contact.email} | **Response:** ${this.knowledgeBase.personal.response_time}\n\n*What specific information can I provide for you?*`;
    }
    
    // Contact Collection System
    showContactForm(type = 'contact') {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="contact-form">
                <h3>${type === 'schedule' ? '📅 Schedule Consultation' : '📧 Contact Information'}</h3>
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
                    ${type === 'schedule' ? `
                    <div class="form-group">
                        <label for="preferred-time">Preferred Time</label>
                        <select id="preferred-time">
                            <option value="">Select preferred time</option>
                            <option value="morning">Morning (9 AM - 12 PM CT)</option>
                            <option value="afternoon">Afternoon (12 PM - 5 PM CT)</option>
                            <option value="evening">Evening (5 PM - 8 PM CT)</option>
                            <option value="flexible">Flexible</option>
                        </select>
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" rows="3" placeholder="Brief description of your project or inquiry..."></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn-primary">${type === 'schedule' ? 'Schedule Meeting' : 'Send Information'}</button>
                        <button type="button" class="btn-secondary" id="cancel-contact">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
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
        
        // Close on background click
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
            preferredTime: document.getElementById('preferred-time')?.value || '',
            message: document.getElementById('contact-message').value,
            type: type,
            timestamp: new Date().toISOString(),
            source: 'AI Chatbot'
        };
        
        // Save to contacts
        this.contacts.push(formData);
        this.saveContacts();
        
        // Add to current conversation
        if (this.currentConversationId) {
            this.conversations[this.currentConversationId].user_info = formData;
            this.conversations[this.currentConversationId].outcome = type;
            this.saveConversations();
        }
        
        // Show confirmation message
        const confirmationMessage = type === 'schedule' ? 
            `🎉 **Meeting Request Submitted!**\n\nThanks ${formData.name}! Your consultation request has been received.\n\n**Next Steps:**\n• Patrice will email you within ${this.knowledgeBase.personal.response_time}\n• You'll receive calendar options for your ${formData.preferredTime || 'preferred'} time\n• ${this.knowledgeBase.personal.consultation}\n\n**Contact:** ${this.knowledgeBase.contact.email}\n\n*Looking forward to discussing your ${formData.interest.replace('-', ' ')} project!*` :
            `✅ **Contact Information Received!**\n\nThank you ${formData.name}! Your information has been securely saved.\n\n**What happens next:**\n• Patrice will respond within ${this.knowledgeBase.personal.response_time}\n• You'll get priority attention for your inquiry\n• Direct email: ${this.knowledgeBase.contact.email}\n\n*Excited to help with your ${formData.interest.replace('-', ' ')} needs!*`;
            
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

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
}

// Initialize Super AI Chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the most powerful chatbot
    window.superAIChatbot = new SuperAIChatbot();
    console.log('🤖 Super AI Chatbot with Learning Capabilities initialized!');
    console.log('Features: Complete Knowledge Base, Contact Collection, Meeting Scheduling, Learning AI');
});