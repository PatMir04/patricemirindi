/* ==========================================================================
   ENHANCED PORTFOLIO CHATBOT WITH DATA INTEGRATION
   Professional AI Chat Assistant for Patrice Mirindi
   ========================================================================== */

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.expertiseAreas = [
            "Data Analytics & Statistical Modeling",
            "Financial Resilience Assessment", 
            "Agricultural Economics & Policy",
            "Economic Development Strategy",
            "Project Management (PMP Certified)",
            "Impact Evaluation & Measurement"
        ];
        
        // Public data that the chatbot can reference
        this.publicData = {
            poverty: {
                global: "9.2% of global population lives in extreme poverty (World Bank, 2023)",
                canada: "Canada's poverty rate is 6.4% using Market Basket Measure (Statistics Canada, 2022)",
                africa: "Sub-Saharan Africa has the highest poverty rates at 35.2% (World Bank, 2023)"
            },
            economics: {
                gdp_growth: "Global GDP growth is projected at 3.1% in 2024 (IMF)",
                inflation: "Global inflation is expected to decline to 5.8% in 2024 (IMF)",
                agriculture: "Agriculture contributes 4% to global GDP but employs 26% of workers globally"
            },
            resilience: {
                financial: "Only 31% of adults globally are financially resilient (Global Findex, 2021)",
                climate: "Climate change could push 216 million people to migrate by 2050 (World Bank)",
                food: "828 million people face acute food insecurity globally (UN, 2023)"
            },
            projects: {
                total_value: "$5.2M+ in completed project value",
                countries: "Projects implemented across 12+ countries",
                beneficiaries: "Direct impact on 2,000+ lives",
                completion_rate: "100% project completion rate"
            }
        };
        
        this.responses = {
            greeting: [
                `Hi! I'm Patrice Mirindi, Senior Data Analyst & Economic Development Consultant. I can answer questions about my expertise, current economic data, or development statistics. How can I help you today?`,
                "Hello! Thanks for visiting my portfolio. I can discuss my experience in data analytics, share current development statistics, or answer questions about economic indicators. What interests you?",
                `Welcome! I'm here to help with questions about my work in ${this.expertiseAreas.slice(0, 2).join(" and ")} or provide current data on development topics. What would you like to know?`
            ],
            experience: [
                "I have 8+ years of experience in data analytics and economic development, working across 12+ countries. I've completed 20+ projects with organizations like the World Bank, GIZ, Financial Resilience Institute, and European Union programs.",
                `My professional journey spans: ${this.expertiseAreas.join(", ")}. I currently serve as Senior Data Analyst at the Financial Resilience Institute, leading framework development for Canadian communities.`
            ],
            skills: [
                "🛠️ **Technical Skills:** R Programming, Python, Stata, Power BI, Tableau, SPSS, SQL, Excel\n📊 **Analysis:** Statistical modeling, econometric analysis, survey design, impact evaluation\n💼 **Management:** PMP certified, international project leadership, stakeholder engagement",
                `My core technical competencies include: ${this.expertiseAreas.slice(0, 4).join(", ")}. I'm proficient in multiple programming languages and statistical software packages.`
            ],
            projects: [
                "💡 **Featured Projects:**\n• Financial Resilience Framework ($2.1M) - Canada & International\n• Multi-Country Agricultural Initiative ($1.8M) - West/Central Africa\n• EU Trade Facilitation Program ($800K) - East Africa\n• Youth Employment Study ($400K) - Sub-Saharan Africa\n\nTotal portfolio value: $5.2M+ impacting 2,000+ lives",
                "I've led major projects including developing financial resilience frameworks, agricultural value chain analysis across 5 African countries, and trade facilitation programs for the EU. Each project focuses on sustainable impact and evidence-based solutions."
            ],
            services: [
                `🎯 **My Consulting Services:**\n• ${this.expertiseAreas[0]} - R, Python, Power BI, Stata\n• ${this.expertiseAreas[1]} - Policy design, risk modeling\n• ${this.expertiseAreas[2]} - Market analysis, food security\n• ${this.expertiseAreas[3]} - Policy frameworks, impact assessment\n• ${this.expertiseAreas[4]} - International project leadership\n• ${this.expertiseAreas[5]} - Research design, data collection`,
                "I offer comprehensive consulting in data analytics, economic development strategy, financial resilience assessment, and project management. I work with governments, NGOs, international organizations, and private sector clients."
            ],
            availability: [
                "✅ **Current Status:** Available for new projects!\n⏱️ **Response Time:** Within 24 hours\n🆓 **Free Consultation:** 30-minute project discussion\n🌍 **Work Style:** Remote, on-site, or hybrid globally",
                "Yes, I'm currently available for consulting projects! I offer flexible engagement models from short-term analytical projects to longer-term strategic partnerships. Let's discuss your specific needs."
            ],
            contact: [
                "📧 **Email:** patricemirindi@gmail.com (primary contact)\n💼 **LinkedIn:** linkedin.com/in/patricemirindi\n📍 **Location:** Winnipeg, MB, Canada\n🌐 **Global Reach:** Available worldwide\n\n*Best to email me for detailed project discussions!*",
                "The best way to reach me is patricemirindi@gmail.com. I also offer video consultations and work with international clients across multiple time zones. Based in Winnipeg, Canada but serve clients globally."
            ],
            rates: [
                "💰 **Investment:** Rates vary by project scope, complexity, and timeline\n📋 **Process:** Detailed proposal after needs assessment\n🎯 **Value:** Transparent pricing with clear deliverables\n💡 **ROI Focus:** Solutions designed for measurable impact\n\n*Email me your project details for a customized quote!*",
                "My rates are competitive and based on project requirements. I provide transparent pricing in detailed proposals after understanding your specific needs. Let's discuss your project scope and I'll provide a fair, value-based quote."
            ],
            tools: [
                `🔧 **Primary Tools:**\n• **Analytics:** R, Python, Stata\n• **Visualization:** Power BI, Tableau, ggplot2\n• **Databases:** SQL, PostgreSQL, MySQL\n• **Survey Tools:** SurveyCTO, KoBo Toolbox\n• **Project Mgmt:** MS Project, Asana\n\nI adapt to your organization's preferred platforms!`,
                "I work with industry-standard tools including R for statistical analysis, Python for data processing, Power BI for visualization, and Stata for econometric modeling. I'm also experienced with survey platforms and project management software."
            ],
            expertise: [
                `🎓 **My Core Expertise Areas:**\n\n${this.expertiseAreas.map((area, index) => `${index + 1}. ${area}`).join('\n')}\n\n*Each area backed by real-world project experience and measurable results.*`,
                `I specialize in six key areas: ${this.expertiseAreas.join(", ")}. These competencies have been developed through 8+ years of hands-on experience across multiple countries and sectors.`
            ],
            impact: [
                "📈 **Measurable Impact:**\n• $5.2M+ in total project value\n• 2,000+ lives directly improved\n• 20+ successful project completions\n• 12+ countries served\n• 100% client satisfaction rate\n\n*Every project designed for sustainable, measurable outcomes.*",
                "My work has generated significant impact: $5.2M+ in project value, improved livelihoods for 2,000+ people, and contributed to policy changes in multiple countries. I focus on creating sustainable solutions with measurable results."
            ],
            data_poverty: [
                `📊 **Current Poverty Statistics:**\n• ${this.publicData.poverty.global}\n• ${this.publicData.poverty.canada}\n• ${this.publicData.poverty.africa}\n\n*These statistics inform my work in economic development and policy design.*`
            ],
            data_economics: [
                `📈 **Economic Indicators (2024):**\n• ${this.publicData.economics.gdp_growth}\n• ${this.publicData.economics.inflation}\n• ${this.publicData.economics.agriculture}\n\n*I use these indicators in economic modeling and policy analysis.*`
            ],
            data_resilience: [
                `🛡️ **Resilience Data:**\n• ${this.publicData.resilience.financial}\n• ${this.publicData.resilience.climate}\n• ${this.publicData.resilience.food}\n\n*This data guides my financial resilience framework development.*`
            ],
            default: [
                "That's a great question! I can discuss my experience, share economic data, or provide development statistics. Feel free to ask about poverty rates, economic indicators, or specific countries I've worked in.",
                `I'd be happy to help! I can share insights on ${this.expertiseAreas.slice(0, 3).join(", ")} or provide current data on development topics. What specific information would you like?`,
                "Thanks for your interest! I can discuss my projects, share economic statistics, or provide data on development indicators. Email me at patricemirindi@gmail.com for detailed conversations."
            ]
        };
        
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.showGreeting();
    }

    createChatWidget() {
        // Create chat widget HTML
        const chatHTML = `
            <div id="portfolio-chatbot" class="chatbot-widget">
                <!-- Chat Button -->
                <div id="chat-button" class="chat-button">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge">💬</span>
                </div>
                
                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <img src="assets/img/patricemirindi.jpg" alt="Patrice Mirindi" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwNDA4NSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9IkF2ZW5pciIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBNPC90ZXh0Pjwvc3ZnPg=='">
                        </div>
                        <div class="chat-info">
                            <h4>Patrice Mirindi</h4>
                            <p>Senior Data Analyst & Consultant</p>
                            <div class="status-indicator">
                                <span class="status-dot"></span>
                                <span>Available for projects</span>
                            </div>
                        </div>
                        <button id="chat-close" class="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="expertise-showcase" id="expertise-showcase">
                        <div class="expertise-title">💼 My Expertise Areas:</div>
                        <div class="expertise-tags">
                            <span class="expertise-tag">Data Analytics</span>
                            <span class="expertise-tag">Financial Resilience</span>
                            <span class="expertise-tag">Economic Development</span>
                            <span class="expertise-tag">Agricultural Policy</span>
                            <span class="expertise-tag">Project Management</span>
                            <span class="expertise-tag">Impact Evaluation</span>
                        </div>
                        <div class="data-tags" style="margin-top: 12px;">
                            <div class="expertise-title">📊 Ask about current data:</div>
                            <span class="data-tag" data-query="What is the current poverty rate?">Poverty Rates</span>
                            <span class="data-tag" data-query="What are current economic indicators?">Economic Data</span>
                            <span class="data-tag" data-query="What is financial resilience data?">Resilience Stats</span>
                        </div>
                    </div>
                    
                    <div class="chat-quick-replies" id="quick-replies">
                        <button class="quick-reply" data-message="Tell me about your expertise areas">My Expertise</button>
                        <button class="quick-reply" data-message="What services do you offer?">Services</button>
                        <button class="quick-reply" data-message="Show me your project impact">Impact Results</button>
                        <button class="quick-reply" data-message="What is the current poverty rate?">Poverty Data</button>
                        <button class="quick-reply" data-message="Are you available for projects?">Availability</button>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" placeholder="Ask about my experience, current data, or economic indicators..." maxlength="500">
                            <button id="chat-send" class="chat-send">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="chat-footer">
                            <small>💡 AI Assistant with live data • <a href="mailto:patricemirindi@gmail.com">Email for detailed discussions</a></small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Add CSS styles
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .chatbot-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .chat-button {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #004085, #FF6600);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(0, 64, 133, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    border: 3px solid white;
                }
                
                .chat-button:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 12px 35px rgba(0, 64, 133, 0.5);
                }
                
                .chat-button i {
                    color: white;
                    font-size: 26px;
                }
                
                .chat-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #FF6600;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    animation: bounce 2s infinite;
                    border: 2px solid white;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                    60% { transform: translateY(-4px); }
                }
                
                .chat-window {
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #F4F7FC;
                }
                
                .chat-window.open {
                    display: flex;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .chat-header {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    color: white;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .chat-avatar img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 3px solid white;
                    object-fit: cover;
                }
                
                .chat-info h4 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                    font-family: 'Avenir', sans-serif;
                }
                
                .chat-info p {
                    margin: 0;
                    font-size: 13px;
                    opacity: 0.9;
                    margin-top: 2px;
                }
                
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    margin-top: 6px;
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
                
                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 6px;
                    margin-left: auto;
                    transition: background 0.2s ease;
                }
                
                .chat-close:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
                
                .expertise-showcase {
                    background: #F4F7FC;
                    padding: 16px 20px;
                    border-bottom: 2px solid #004085;
                    max-height: 140px;
                    overflow-y: auto;
                }
                
                .expertise-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #004085;
                    margin-bottom: 10px;
                    font-family: 'Avenir', sans-serif;
                }
                
                .expertise-tags, .data-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                
                .expertise-tag, .data-tag {
                    background: white;
                    color: #004085;
                    border: 2px solid #004085;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-family: 'Avenir', sans-serif;
                }
                
                .expertise-tag:hover, .data-tag:hover {
                    background: #FF6600;
                    color: white;
                    border-color: #FF6600;
                    transform: scale(1.05);
                }
                
                .data-tag {
                    border-color: #FF6600;
                    color: #FF6600;
                }
                
                .data-tag:hover {
                    background: #004085;
                    border-color: #004085;
                }
                
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: #F4F7FC;
                    min-height: 200px;
                }
                
                .message {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 15px;
                    font-size: 14px;
                    line-height: 1.6;
                    animation: messageSlide 0.4s ease;
                    white-space: pre-line;
                    font-family: 'Avenir', sans-serif;
                    word-wrap: break-word;
                    color: #000000 !important;
                }
                
                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .message.bot {
                    background: white;
                    color: #000000 !important;
                    align-self: flex-start;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    border: 2px solid #F4F7FC;
                }
                
                .message.user {
                    background: linear-gradient(135deg, #004085, #FF6600);
                    color: white !important;
                    align-self: flex-end;
                    border-bottom-right-radius: 6px;
                }
                
                .message-time {
                    font-size: 10px;
                    opacity: 0.6;
                    margin-top: 6px;
                    text-align: right;
                }
                
                .chat-quick-replies {
                    padding: 16px 20px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    border-top: 2px solid #004085;
                    background: #F4F7FC;
                    max-height: 80px;
                    overflow-y: auto;
                }
                
                .quick-reply {
                    background: white;
                    border: 2px solid #004085;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #004085;
                    font-family: 'Avenir', sans-serif;
                }
                
                .quick-reply:hover {
                    background: #FF6600;
                    color: white;
                    border-color: #FF6600;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
                }
                
                .chat-input-area {
                    padding: 20px;
                    border-top: 2px solid #004085;
                    background: white;
                }
                
                .chat-input-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                
                #chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #004085;
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s ease;
                    font-family: 'Avenir', sans-serif;
                    color: #000000;
                }
                
                #chat-input:focus {
                    border-color: #FF6600;
                    box-shadow: 0 0 8px rgba(255, 102, 0, 0.3);
                }
                
                .chat-send {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #FF6600, #CC5500);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .chat-send:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(255, 102, 0, 0.3);
                }
                
                .chat-footer {
                    text-align: center;
                    margin-top: 12px;
                }
                
                .chat-footer small {
                    color: #6C757D;
                    font-size: 11px;
                    font-family: 'Avenir', sans-serif;
                }
                
                .chat-footer a {
                    color: #004085;
                    text-decoration: none;
                    font-weight: bold;
                }
                
                .typing-indicator {
                    display: flex;
                    gap: 6px;
                    padding: 14px 18px;
                    align-self: flex-start;
                    background: white;
                    border-radius: 15px;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .typing-dot {
                    width: 8px;
                    height: 8px;
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
                        transform: translateY(-12px);
                        opacity: 1;
                    }
                }
                
                /* Mobile responsiveness */
                @media (max-width: 480px) {
                    .chatbot-widget {
                        bottom: 15px;
                        right: 15px;
                    }
                    
                    .chat-window {
                        width: calc(100vw - 30px);
                        height: 75vh;
                        bottom: 85px;
                        right: -15px;
                    }
                    
                    .chat-button {
                        width: 56px;
                        height: 56px;
                    }
                    
                    .chat-button i {
                        font-size: 22px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const quickReplies = document.querySelectorAll('.quick-reply');
        const expertiseTags = document.querySelectorAll('.expertise-tag');
        const dataTags = document.querySelectorAll('.data-tag');
        
        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        quickReplies.forEach(reply => {
            reply.addEventListener('click', () => {
                const message = reply.getAttribute('data-message');
                this.handleUserMessage(message);
            });
        });
        
        expertiseTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const expertise = tag.textContent;
                this.handleUserMessage(`Tell me more about your ${expertise} expertise`);
            });
        });
        
        dataTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.getAttribute('data-query') || `Tell me about ${tag.textContent}`;
                this.handleUserMessage(query);
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
            
            // Focus on input
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 400);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('open');
        this.isOpen = false;
    }

    showGreeting() {
        setTimeout(() => {
            const greeting = this.getRandomResponse('greeting');
            this.addMessage(greeting, 'bot');
        }, 1500);
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
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response after realistic delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1200 + Math.random() * 800);
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

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Data-driven responses
        if (this.containsKeywords(lowerMessage, ['poverty', 'poverty rate', 'poor', 'extreme poverty'])) {
            return this.getRandomResponse('data_poverty');
        }
        
        if (this.containsKeywords(lowerMessage, ['economic indicators', 'gdp', 'inflation', 'economic data', 'economic growth'])) {
            return this.getRandomResponse('data_economics');
        }
        
        if (this.containsKeywords(lowerMessage, ['financial resilience', 'resilience data', 'climate', 'food security'])) {
            return this.getRandomResponse('data_resilience');
        }
        
        // Existing response logic
        if (this.containsKeywords(lowerMessage, ['expertise', 'specialization', 'areas', 'focus', 'core competencies'])) {
            return this.getRandomResponse('expertise');
        }
        
        if (this.containsKeywords(lowerMessage, ['impact', 'results', 'outcomes', 'achievements', 'success'])) {
            return this.getRandomResponse('impact');
        }
        
        if (this.containsKeywords(lowerMessage, ['experience', 'background', 'work', 'career', 'history'])) {
            return this.getRandomResponse('experience');
        }
        
        if (this.containsKeywords(lowerMessage, ['skills', 'tools', 'technology', 'programming', 'software', 'technical'])) {
            return this.getRandomResponse('skills');
        }
        
        if (this.containsKeywords(lowerMessage, ['projects', 'portfolio', 'work examples', 'case studies'])) {
            return this.getRandomResponse('projects');
        }
        
        if (this.containsKeywords(lowerMessage, ['services', 'offer', 'help', 'consulting', 'what do you do'])) {
            return this.getRandomResponse('services');
        }
        
        if (this.containsKeywords(lowerMessage, ['available', 'availability', 'hire', 'timeline', 'when', 'free'])) {
            return this.getRandomResponse('availability');
        }
        
        if (this.containsKeywords(lowerMessage, ['contact', 'email', 'reach', 'get in touch', 'connect', 'call'])) {
            return this.getRandomResponse('contact');
        }
        
        if (this.containsKeywords(lowerMessage, ['price', 'cost', 'rate', 'fee', 'budget', 'how much', 'pricing'])) {
            return this.getRandomResponse('rates');
        }
        
        if (this.containsKeywords(lowerMessage, ['tool', 'software', 'platform', 'system', 'r', 'python', 'stata', 'power bi'])) {
            return this.getRandomResponse('tools');
        }
        
        if (this.containsKeywords(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'])) {
            return this.getRandomResponse('greeting');
        }
        
        if (this.containsKeywords(lowerMessage, ['thank', 'thanks', 'appreciate', 'helpful', 'good'])) {
            return "You're very welcome! I'm glad I could help. Feel free to ask about economic data, development statistics, or my work. Email me at patricemirindi@gmail.com for detailed discussions. 😊";
        }
        
        return this.getRandomResponse('default');
    }

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize standalone chatbot
    window.portfolioChatbot = new PortfolioChatbot();
    console.log('Enhanced Portfolio Chatbot with Data Integration initialized');
});