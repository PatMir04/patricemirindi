/*
 * PATRICE MIRINDI - ENHANCED PROFESSIONAL CHAT WIDGET
 * Intelligent chatbot with comprehensive knowledge base integration
 */

class ProfessionalChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userLanguage = 'en';
        this.knowledgeBase = null;
        this.initialized = false;
        
        // Basic profile info (fallback)
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

    async init() {
        try {
            await this.loadProfessionalKnowledge();
            this.createWidget();
            this.attachEvents();
            setTimeout(() => this.showWelcome(), 2000);
            this.initialized = true;
            console.log('✅ Enhanced professional chat widget initialized');
        } catch (error) {
            console.error('❌ Chat widget failed:', error);
            this.showFallback();
        }
    }

    async loadProfessionalKnowledge() {
        try {
            console.log('🔄 Loading professional knowledge base...');
            const response = await fetch('./data/professional_profile.json');
            
            if (response.ok) {
                this.knowledgeBase = await response.json();
                console.log('✅ Professional knowledge loaded successfully');
                console.log('📊 Tools available:', this.knowledgeBase.skills?.data_analytics_tools?.length || 0);
                console.log('🌍 Countries available:', this.knowledgeBase.countries_worked?.length || 0);
            } else {
                console.warn('⚠️ Professional profile not found, using fallback knowledge');
                this.knowledgeBase = this.getFallbackKnowledge();
            }
        } catch (error) {
            console.warn('⚠️ Failed to load knowledge base:', error);
            this.knowledgeBase = this.getFallbackKnowledge();
        }
    }

    getFallbackKnowledge() {
        return {
            skills: {
                data_analytics_tools: [
                    {name: "Excel", proficiency: "expert", description: "Advanced economic modeling and analysis"},
                    {name: "SPSS", proficiency: "advanced", description: "Statistical analysis for development projects"},
                    {name: "R", proficiency: "intermediate", description: "Econometric modeling and forecasting"},
                    {name: "Python", proficiency: "intermediate", description: "Data processing and automation"},
                    {name: "Tableau", proficiency: "intermediate", description: "Data visualization and dashboards"},
                    {name: "Power BI", proficiency: "intermediate", description: "Business intelligence reporting"}
                ]
            }
        };
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
                        <button class="quick-btn" data-msg="What data analytics tools do you use?">🛠️ Tools</button>
                        <button class="quick-btn" data-msg="What countries have you worked in?">🌍 Countries</button>
                        <button class="quick-btn" data-msg="What is your experience?">💼 Experience</button>
                        <button class="quick-btn" data-msg="Are you available for consulting?">✅ Availability</button>
                        <button class="quick-btn" data-msg="Tell me about your projects">📊 Projects</button>
                        <button class="quick-btn" data-msg="How can I contact you?">📧 Contact</button>
                    </div>
                    
                    <div class="chat-input-section">
                        <input type="text" 
                               id="chat-input" 
                               placeholder="Ask about tools, experience, projects, or expertise..." 
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
                width: 420px;
                height: 550px;
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
                min-height: 200px;
            }
            
            .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                animation: fadeIn 0.3s ease;
                word-wrap: break-word;
            }
            
            .message.bot {
                background: white;
                color: #374151;
                align-self: flex-start;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                border: 1px solid #e1e5e9;
                border-radius: 16px 16px 16px 4px;
            }
            
            .message.user {
                background: linear-gradient(135deg, #004085, #FF6600);
                color: white;
                align-self: flex-end;
                border-radius: 16px 16px 4px 16px;
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
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .quick-btn {
                background: #f8fafc;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                padding: 8px 10px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-weight: 500;
            }
            
            .quick-btn:hover {
                background: #004085;
                color: white;
                border-color: #004085;
                transform: translateY(-1px);
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
                color: #000;
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
                border-radius: 16px 16px 16px 4px;
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
                    height: 70vh;
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
        const welcome = "👋 Hi! I'm Patrice's AI assistant. I have detailed knowledge about his analytics tools, project experience across 14 countries, and professional expertise. What would you like to know?";
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
            const response = this.getIntelligentResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 800);
    }

    getIntelligentResponse(message) {
        try {
            const msg = message.toLowerCase();
            const isFrench = this.detectFrench(msg);
            
            // Enhanced tool-specific responses
            if (this.isToolsQuestion(msg)) {
                return this.getToolsResponse(msg, isFrench);
            }
            
            // Project-specific responses
            if (this.isProjectsQuestion(msg)) {
                return this.getProjectsResponse(isFrench);
            }
            
            // Methodology responses
            if (this.isMethodologyQuestion(msg)) {
                return this.getMethodologyResponse(isFrench);
            }
            
            // Countries question with enhanced context
            if (this.isCountriesQuestion(msg)) {
                return this.getCountriesResponse(isFrench);
            }
            
            // Education and background
            if (this.isEducationQuestion(msg)) {
                return this.getEducationResponse(isFrench);
            }
            
            // Contact/availability
            if (this.isContactQuestion(msg)) {
                return this.getContactResponse(isFrench);
            }
            
            // Experience
            if (this.isExperienceQuestion(msg)) {
                return this.getExperienceResponse(isFrench);
            }
            
            // Greetings
            if (this.isGreeting(msg)) {
                return this.getGreetingResponse(isFrench);
            }
            
            // Default intelligent response
            return this.getDefaultResponse(isFrench);
        } catch (error) {
            console.error('Error generating response:', error);
            return "I'm sorry, I encountered an error. Please contact Patrice directly at patricemirindi@gmail.com for assistance.";
        }
    }

    isToolsQuestion(msg) {
        return msg.includes('tool') || msg.includes('software') || msg.includes('analytics') ||
               msg.includes('excel') || msg.includes('spss') || msg.includes('tableau') ||
               msg.includes('python') || msg.includes('power bi') || msg.includes('stata') ||
               msg.includes('technologies') || msg.includes('programs');
    }

    getToolsResponse(msg, isFrench = false) {
        if (!this.knowledgeBase?.skills?.data_analytics_tools) {
            return isFrench ?
                "Patrice utilise Excel, SPSS, R, Python, Tableau, et Power BI pour ses analyses de données en développement économique." :
                "Patrice uses Excel, SPSS, R, Python, Tableau, and Power BI for data analytics in economic development.";
        }
        
        const tools = this.knowledgeBase.skills.data_analytics_tools;
        
        // Check for specific tool mentioned
        const specificTool = tools.find(tool => 
            msg.includes(tool.name.toLowerCase())
        );
        
        if (specificTool) {
            return isFrench ?
                `Patrice utilise ${specificTool.name} avec un niveau ${specificTool.proficiency}. ${specificTool.description || 'Outil essentiel pour ses projets de développement économique.'}` :
                `Patrice uses ${specificTool.name} at ${specificTool.proficiency} level. ${specificTool.description || 'Essential tool for economic development projects.'}. ${specificTool.use_cases ? 'Use cases include: ' + specificTool.use_cases.join(', ') + '.' : ''}`;
        }
        
        // General tools overview
        const toolsList = tools.map(t => `${t.name} (${t.proficiency})`).join(', ');
        
        return isFrench ?
            `Patrice utilise une gamme complète d'outils d'analyse de données: ${toolsList}. Par exemple, Excel pour la modélisation économique avancée, SPSS pour l'analyse démographique, et Tableau pour la visualisation interactive. Souhaitez-vous des détails sur un outil spécifique?` :
            `Patrice uses a comprehensive suite of data analytics tools: ${toolsList}. For example, Excel for advanced economic modeling, SPSS for demographic analysis, and Tableau for interactive visualizations. Would you like details about a specific tool?`;
    }

    isProjectsQuestion(msg) {
        return msg.includes('project') || msg.includes('work') || msg.includes('experience') ||
               msg.includes('portfolio') || msg.includes('examples');
    }

    getProjectsResponse(isFrench = false) {
        if (!this.knowledgeBase?.projects) {
            return isFrench ?
                "Patrice a géré 25+ projets d'une valeur de $7.5M+ dans 14 pays. Contactez-le pour des exemples détaillés." :
                "Patrice has managed 25+ projects worth $7.5M+ across 14 countries. Contact him for detailed examples.";
        }
        
        const projects = this.knowledgeBase.projects.slice(0, 2); // Show top 2 projects
        const projectDescriptions = projects.map(p => 
            `${p.name} (${p.organization}): ${p.description.substring(0, 100)}...`
        ).join('\n\n');
        
        return isFrench ?
            `Voici quelques projets clés de Patrice:\n\n${projectDescriptions}\n\nAu total, il a géré ${this.knowledgeBase.achievements?.total_projects || '25+'} projets d'une valeur de ${this.knowledgeBase.achievements?.project_value || '$7.5M+'}.` :
            `Here are some of Patrice's key projects:\n\n${projectDescriptions}\n\nIn total, he has managed ${this.knowledgeBase.achievements?.total_projects || '25+'} projects worth ${this.knowledgeBase.achievements?.project_value || '$7.5M+'}.`;
    }

    isMethodologyQuestion(msg) {
        return msg.includes('method') || msg.includes('approach') || msg.includes('analysis') ||
               msg.includes('statistical') || msg.includes('econometric') || msg.includes('regression');
    }

    getMethodologyResponse(isFrench = false) {
        const methodologies = this.knowledgeBase?.skills?.methodologies || [
            'Regression Analysis', 'Time Series Forecasting', 'Impact Evaluation', 'Survey Design'
        ];
        
        const methodsList = methodologies.map(m => 
            typeof m === 'object' ? m.name : m
        ).join(', ');
        
        return isFrench ?
            `Patrice emploie diverses méthodologies analytiques: ${methodsList}. Il se spécialise dans la modélisation économétrique pour l'évaluation des politiques et l'analyse d'impact des projets de développement.` :
            `Patrice employs various analytical methodologies: ${methodsList}. He specializes in econometric modeling for policy evaluation and development project impact analysis.`;
    }

    isCountriesQuestion(msg) {
        return (msg.includes('countries') || msg.includes('country') || msg.includes('pays')) &&
               (msg.includes('work') || msg.includes('experience') || msg.includes('travail'));
    }

    getCountriesResponse(isFrench = false) {
        const countries = this.knowledgeBase?.countries_worked || this.countries;
        const countryList = Array.isArray(countries) ? 
            countries.map(c => typeof c === 'object' ? c.country : c).join(', ') :
            this.countries.join(', ');
        
        return isFrench ?
            `Patrice a travaillé dans ${countries.length || 14} pays: ${countryList}. Son expertise couvre l'Afrique subsaharienne et l'Amérique du Nord, avec des projets en économie agricole, développement urbain, et résilience financière.` :
            `Patrice has worked in ${countries.length || 14} countries: ${countryList}. His expertise spans Sub-Saharan Africa and North America, with projects in agricultural economics, urban development, and financial resilience.`;
    }

    isEducationQuestion(msg) {
        return msg.includes('education') || msg.includes('degree') || msg.includes('university') ||
               msg.includes('background') || msg.includes('qualification');
    }

    getEducationResponse(isFrench = false) {
        const education = this.knowledgeBase?.education;
        
        if (education) {
            return isFrench ?
                `Patrice détient un ${education.primary_degree} de ${education.institution}. Il se spécialise en ${education.specialization}. Il parle couramment ${education.languages?.map(l => l.language).join(', ')}.` :
                `Patrice holds an ${education.primary_degree} from ${education.institution}. He specializes in ${education.specialization}. He is fluent in ${education.languages?.map(l => l.language).join(', ')}.`;
        }
        
        return isFrench ?
            "Patrice détient une Maîtrise en Économie Agricole de l'Université de Nairobi et parle français, anglais, swahili et lingala." :
            "Patrice holds an MSc in Agricultural Economics from University of Nairobi and speaks French, English, Swahili, and Lingala.";
    }

    isContactQuestion(msg) {
        return msg.includes('contact') || msg.includes('available') || msg.includes('hire') ||
               msg.includes('email') || msg.includes('reach');
    }

    getContactResponse(isFrench = false) {
        return isFrench ?
            `Patrice est actuellement disponible pour de nouveaux projets de consultation. Contactez-le à ${this.profile.email} pour une consultation gratuite de 30 minutes. Il répond généralement dans les 24 heures.` :
            `Patrice is currently available for new consulting projects. Contact him at ${this.profile.email} for a free 30-minute consultation. He typically responds within 24 hours.`;
    }

    isExperienceQuestion(msg) {
        return msg.includes('experience') || msg.includes('background') || msg.includes('career');
    }

    getExperienceResponse(isFrench = false) {
        const achievements = this.knowledgeBase?.achievements;
        
        return isFrench ?
            `Patrice a ${this.profile.experience} d'expérience en économie du développement. Il a géré ${achievements?.total_projects || '25+'} projets d'une valeur de ${achievements?.project_value || '$7.5M+'} dans ${achievements?.countries || '14'} pays, impactant ${achievements?.beneficiaries || '25,000+'} vies.` :
            `Patrice has ${this.profile.experience} of experience in development economics. He has managed ${achievements?.total_projects || '25+'} projects worth ${achievements?.project_value || '$7.5M+'} across ${achievements?.countries || '14'} countries, impacting ${achievements?.beneficiaries || '25,000+'} lives.`;
    }

    isGreeting(msg) {
        return msg.match(/^(hi|hello|hey|bonjour|salut)\b/);
    }

    getGreetingResponse(isFrench = false) {
        return isFrench ?
            "Bonjour! Je suis l'assistant IA de Patrice. J'ai des connaissances détaillées sur ses outils d'analyse, son expérience dans 14 pays, et son expertise professionnelle. Que souhaitez-vous savoir?" :
            "Hello! I'm Patrice's AI assistant. I have detailed knowledge about his analytics tools, experience across 14 countries, and professional expertise. What would you like to know?";
    }

    getDefaultResponse(isFrench = false) {
        return isFrench ?
            `Je peux vous renseigner sur l'expertise de Patrice en analyse de données (Excel, SPSS, R, Python, Tableau), ses projets dans ${this.countries.length} pays, ou vous aider à le contacter à ${this.profile.email}. Quelle information spécifique souhaitez-vous?` :
            `I can tell you about Patrice's data analytics expertise (Excel, SPSS, R, Python, Tableau), his projects across ${this.countries.length} countries, or help you contact him at ${this.profile.email}. What specific information would you like?`;
    }

    detectFrench(message) {
        const frenchWords = ['bonjour', 'salut', 'où', 'comment', 'dans', 'quels', 'pays', 'travaillé', 'expérience', 'contacter', 'outils', 'projets'];
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