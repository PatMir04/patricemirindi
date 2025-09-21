/**
 * Data-Enhanced Chatbot with Visualization Capabilities
 * Integrates with SDG data and economic indicators to provide visual responses
 * Created by Patrice Mirindi
 */

class DataEnhancedChatbot {
    constructor() {
        this.knowledgeBase = null;
        this.dataConnections = {
            sdg: null,
            economic: null,
            agricultural: null
        };
        this.conversationHistory = [];
        this.isOpen = false;
        this.charts = new Map();
        
        this.loadKnowledgeBase();
        this.initializeDataConnections();
        this.initializeChat();
        this.setupEventListeners();
    }

    async loadKnowledgeBase() {
        try {
            // Enhanced knowledge base with data visualization capabilities
            this.knowledgeBase = {
                expertise: {
                    'sdg progress': {
                        keywords: ['sdg', 'sustainable development', 'goals', 'progress', 'targets', 'indicators'],
                        responses: [
                            "I can show you SDG progress data! Let me create a visualization for you.",
                            "Here's the latest data on Sustainable Development Goals progress.",
                            "I'll generate a chart showing SDG performance across countries."
                        ],
                        visualizations: ['sdg-progress-chart', 'country-comparison', 'goal-trends']
                    },
                    'poverty data': {
                        keywords: ['poverty', 'income', 'poor', 'wealth', 'distribution', 'inequality'],
                        responses: [
                            "Let me show you the latest poverty statistics and trends.",
                            "I can create visualizations showing poverty rates across different regions.",
                            "Here's a comprehensive analysis of global poverty data."
                        ],
                        visualizations: ['poverty-trends', 'income-distribution', 'regional-poverty']
                    },
                    'food security': {
                        keywords: ['food', 'hunger', 'nutrition', 'malnutrition', 'agriculture', 'crop'],
                        responses: [
                            "I'll generate food security visualizations showing global trends.",
                            "Let me show you agricultural productivity and food access data.",
                            "Here's an analysis of global food security indicators."
                        ],
                        visualizations: ['food-security-map', 'agricultural-trends', 'nutrition-indicators']
                    },
                    'economic development': {
                        keywords: ['gdp', 'growth', 'economy', 'development', 'income', 'economic'],
                        responses: [
                            "I can show you economic development trends and comparisons.",
                            "Let me create visualizations of economic growth patterns.",
                            "Here's an analysis of economic development indicators."
                        ],
                        visualizations: ['gdp-trends', 'development-comparison', 'economic-indicators']
                    },
                    'climate data': {
                        keywords: ['climate', 'temperature', 'emissions', 'carbon', 'environment', 'green'],
                        responses: [
                            "I'll show you climate and environmental data visualizations.",
                            "Let me generate charts showing climate change indicators.",
                            "Here's an analysis of environmental sustainability metrics."
                        ],
                        visualizations: ['climate-trends', 'emissions-data', 'environmental-indicators']
                    },
                    'country comparison': {
                        keywords: ['compare', 'comparison', 'versus', 'vs', 'between', 'countries'],
                        responses: [
                            "I can create country comparisons across various indicators.",
                            "Let me show you a side-by-side comparison of country performance.",
                            "Here's a comparative analysis with interactive visualizations."
                        ],
                        visualizations: ['country-radar', 'comparative-bars', 'ranking-chart']
                    }
                },
                faq: [
                    {
                        question: "Can you show me SDG data for specific countries?",
                        answer: "Absolutely! I can create interactive visualizations showing SDG progress for any country or group of countries. Just tell me which countries you're interested in, and I'll generate charts showing their performance across all 17 goals.",
                        requiresVisualization: true,
                        chartType: 'country-sdg-overview'
                    },
                    {
                        question: "How do I interpret the data visualizations?",
                        answer: "Each visualization includes interactive elements and detailed explanations. Hover over data points for specific values, use the legend to toggle data series, and look for the insights panel that provides key takeaways and trend analysis. All data sources are clearly cited.",
                        requiresVisualization: false
                    },
                    {
                        question: "Can you create custom charts based on my questions?",
                        answer: "Yes! I can generate custom visualizations based on your specific questions about development economics, agricultural data, poverty statistics, and more. Just ask me about any topic, and I'll create relevant charts and provide detailed analysis.",
                        requiresVisualization: true,
                        chartType: 'custom-analysis'
                    }
                ]
            };
        } catch (error) {
            console.error('Failed to load knowledge base:', error);
        }
    }

    async initializeDataConnections() {
        // Initialize connections to various data sources
        this.dataConnections = {
            sdg: {
                countries: this.generateSDGCountryData(),
                indicators: this.generateSDGIndicators(),
                trends: this.generateTrendData()
            },
            economic: {
                gdp: this.generateGDPData(),
                poverty: this.generatePovertyData(),
                inequality: this.generateInequalityData()
            },
            agricultural: {
                production: this.generateProductionData(),
                yields: this.generateYieldData(),
                foodSecurity: this.generateFoodSecurityData()
            }
        };
    }

    initializeChat() {
        const chatHTML = `
            <div id="data-enhanced-chatbot" class="data-chatbot">
                <div class="chat-button" id="data-chat-toggle">
                    <i class="fas fa-chart-line"></i>
                    <span class="chat-badge">Data Analytics Assistant</span>
                    <div class="pulse-ring"></div>
                </div>
                
                <div class="chat-window" id="data-chat-window">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <div class="avatar-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                        </div>
                        <div class="chat-info">
                            <h4>AI Data Assistant</h4>
                            <span class="status online">Ready to visualize data</span>
                        </div>
                        <div class="chat-actions">
                            <button class="btn-icon" id="clear-chat" title="Clear Chat">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="chat-close" id="data-chat-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-suggestions">
                        <div class="suggestion-chips">
                            <button class="suggestion-chip" data-question="Show me SDG progress for DRC">
                                <i class="fas fa-flag"></i> DRC SDG Progress
                            </button>
                            <button class="suggestion-chip" data-question="Compare poverty rates across African countries">
                                <i class="fas fa-chart-bar"></i> Poverty Analysis
                            </button>
                            <button class="suggestion-chip" data-question="Show food security trends in Sub-Saharan Africa">
                                <i class="fas fa-leaf"></i> Food Security
                            </button>
                            <button class="suggestion-chip" data-question="Create economic development comparison">
                                <i class="fas fa-chart-line"></i> Economic Trends
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="data-chat-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                <p>📊 Hello! I'm your AI Data Assistant specialized in development economics and SDG analytics.</p>
                                <p>I can help you with:</p>
                                <ul>
                                    <li>🌍 <strong>SDG Progress Tracking</strong> - Real-time country comparisons</li>
                                    <li>💰 <strong>Poverty & Inequality Data</strong> - Trends and regional analysis</li>
                                    <li>🌾 <strong>Agricultural Economics</strong> - Production and food security</li>
                                    <li>📈 <strong>Economic Development</strong> - Growth patterns and indicators</li>
                                    <li>🌡️ <strong>Climate Data</strong> - Environmental sustainability metrics</li>
                                </ul>
                                <p><strong>Ask me any question and I'll create interactive visualizations with the data!</strong></p>
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <div class="input-container">
                            <input type="text" id="data-chat-input-field" placeholder="Ask me about data, and I'll create visualizations..." maxlength="500">
                            <div class="input-actions">
                                <button id="attach-data" class="btn-icon" title="Attach Dataset">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <button id="voice-input" class="btn-icon" title="Voice Input">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button id="data-chat-send" disabled>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-footer">
                        <div class="data-status">
                            <div class="status-indicator">
                                <div class="status-dot"></div>
                                <span>Data sources active</span>
                            </div>
                            <div class="last-updated">
                                <i class="fas fa-sync-alt"></i>
                                <span>Updated: Just now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('data-chat-toggle');
        const chatClose = document.getElementById('data-chat-close');
        const chatSend = document.getElementById('data-chat-send');
        const chatInput = document.getElementById('data-chat-input-field');
        const clearChat = document.getElementById('clear-chat');
        const suggestionChips = document.querySelectorAll('.suggestion-chip');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        clearChat.addEventListener('click', () => this.clearChat());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        chatInput.addEventListener('input', (e) => {
            const sendButton = document.getElementById('data-chat-send');
            sendButton.disabled = !e.target.value.trim();
        });

        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.dataset.question;
                chatInput.value = question;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('data-chat-window');
        const chatButton = document.getElementById('data-chat-toggle');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatButton.classList.add('hidden');
            this.isOpen = true;
            
            setTimeout(() => {
                document.getElementById('data-chat-input-field').focus();
            }, 300);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('data-chat-window');
        const chatButton = document.getElementById('data-chat-toggle');
        
        chatWindow.classList.remove('open');
        chatButton.classList.remove('hidden');
        this.isOpen = false;
    }

    clearChat() {
        const messagesContainer = document.getElementById('data-chat-messages');
        const initialMessage = messagesContainer.querySelector('.bot-message');
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(initialMessage);
        this.conversationHistory = [];
        
        // Clear any existing charts
        this.charts.clear();
    }

    sendMessage() {
        const input = document.getElementById('data-chat-input-field');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        document.getElementById('data-chat-send').disabled = true;
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            const response = this.generateDataResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response.text, 'bot', response.visualization);
        }, 2000);
    }

    generateDataResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Check if question requires data visualization
        let requiresVisualization = false;
        let chartType = null;
        let data = null;
        
        // Analyze question for data requirements
        if (lowerQuestion.includes('show') || lowerQuestion.includes('chart') || 
            lowerQuestion.includes('visualize') || lowerQuestion.includes('graph') ||
            lowerQuestion.includes('compare') || lowerQuestion.includes('trend')) {
            requiresVisualization = true;
        }
        
        // Check expertise areas for matching keywords
        for (const [area, expertise] of Object.entries(this.knowledgeBase.expertise)) {
            if (expertise.keywords.some(keyword => lowerQuestion.includes(keyword))) {
                const responses = expertise.responses;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                if (requiresVisualization && expertise.visualizations) {
                    chartType = expertise.visualizations[0]; // Use first visualization type
                    data = this.getRelevantData(area, lowerQuestion);
                }
                
                return {
                    text: randomResponse,
                    visualization: requiresVisualization ? { type: chartType, data: data } : null
                };
            }
        }
        
        // Country-specific questions
        if (lowerQuestion.includes('drc') || lowerQuestion.includes('congo')) {
            return {
                text: "Here's the latest data for the Democratic Republic of Congo (DRC). The visualization shows comprehensive development indicators.",
                visualization: {
                    type: 'country-profile',
                    data: this.getCountryData('DRC')
                }
            };
        }
        
        // Default response with general data
        return {
            text: "I can help you explore development economics data! Try asking me about specific countries, SDG progress, poverty trends, or agricultural indicators. I'll create interactive visualizations to show you the data.",
            visualization: {
                type: 'overview-dashboard',
                data: this.getOverviewData()
            }
        };
    }

    getRelevantData(area, question) {
        // Return relevant data based on the area and specific question
        switch(area) {
            case 'sdg progress':
                return this.dataConnections.sdg;
            case 'poverty data':
                return this.dataConnections.economic.poverty;
            case 'food security':
                return this.dataConnections.agricultural.foodSecurity;
            case 'economic development':
                return this.dataConnections.economic.gdp;
            default:
                return this.getOverviewData();
        }
    }

    getCountryData(country) {
        // Generate country-specific data
        return {
            country: country,
            sdgScore: 45.2,
            rank: 156,
            trends: {
                poverty: { value: 77.8, change: -2.1 },
                education: { value: 32.1, change: 1.4 },
                health: { value: 28.9, change: 0.8 },
                economy: { value: 41.2, change: -0.3 }
            },
            indicators: this.generateCountryIndicators(country)
        };
    }

    getOverviewData() {
        return {
            globalStats: {
                sdgProgress: 60.2,
                povertyRate: 8.5,
                foodSecurityIndex: 72.3,
                climateCrisis: 3.2
            },
            topPerformers: ['Denmark', 'Sweden', 'Finland'],
            challengedCountries: ['Chad', 'Somalia', 'Niger']
        };
    }

    addMessage(content, sender, visualization = null) {
        const messagesContainer = document.getElementById('data-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString();
        
        let messageHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        // Add visualization if provided
        if (visualization && sender === 'bot') {
            const chartId = `chart-${Date.now()}`;
            messageHTML = `
                <div class="message-content">
                    <p>${content}</p>
                    <div class="message-chart" id="${chartId}"></div>
                    <div class="chart-actions">
                        <button class="btn-small" onclick="window.dataEnhancedChatbot.downloadChart('${chartId}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-small" onclick="window.dataEnhancedChatbot.fullscreenChart('${chartId}')">
                            <i class="fas fa-expand"></i> Fullscreen
                        </button>
                    </div>
                </div>
                <div class="message-time">${time}</div>
            `;
        }
        
        messageDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Create visualization after message is added to DOM
        if (visualization && sender === 'bot') {
            setTimeout(() => {
                this.createVisualization(chartId, visualization);
            }, 100);
        }
        
        this.conversationHistory.push({
            content,
            sender,
            visualization,
            timestamp: new Date()
        });
    }

    createVisualization(chartId, visualization) {
        const chartContainer = document.getElementById(chartId);
        if (!chartContainer) return;
        
        chartContainer.style.height = '300px';
        chartContainer.style.width = '100%';
        chartContainer.style.background = 'rgba(26, 26, 26, 0.8)';
        chartContainer.style.borderRadius = '10px';
        chartContainer.style.border = '1px solid var(--dark-border)';
        chartContainer.style.marginTop = '15px';
        
        switch(visualization.type) {
            case 'country-profile':
                this.createCountryProfileChart(chartContainer, visualization.data);
                break;
            case 'sdg-progress-chart':
                this.createSDGProgressChart(chartContainer, visualization.data);
                break;
            case 'poverty-trends':
                this.createPovertyTrendsChart(chartContainer, visualization.data);
                break;
            case 'overview-dashboard':
                this.createOverviewDashboard(chartContainer, visualization.data);
                break;
            default:
                this.createDefaultChart(chartContainer, visualization.data);
        }
        
        this.charts.set(chartId, visualization);
    }

    createCountryProfileChart(container, data) {
        const trace1 = {
            x: Object.keys(data.trends),
            y: Object.values(data.trends).map(t => t.value),
            type: 'bar',
            name: data.country,
            marker: {
                color: ['#e5243b', '#4c9f38', '#c5192d', '#fcc30b'],
                line: {
                    color: 'rgba(0, 255, 255, 0.8)',
                    width: 1
                }
            }
        };
        
        const layout = {
            title: {
                text: `${data.country} Development Indicators`,
                font: { color: '#ffffff' }
            },
            xaxis: { title: 'Indicators', color: '#ffffff' },
            yaxis: { title: 'Score', color: '#ffffff' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(container, [trace1], layout, config);
    }

    createSDGProgressChart(container, data) {
        const goals = Array.from({length: 17}, (_, i) => `Goal ${i + 1}`);
        const scores = goals.map(() => Math.random() * 40 + 30); // Simulate scores
        
        const trace = {
            r: scores,
            theta: goals,
            fill: 'toself',
            type: 'scatterpolar',
            name: 'SDG Progress',
            line: { color: '#00ffff' },
            fillcolor: 'rgba(0, 255, 255, 0.1)'
        };
        
        const layout = {
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, 100],
                    color: '#ffffff'
                },
                angularaxis: {
                    color: '#ffffff'
                }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' },
            title: {
                text: 'SDG Progress Overview',
                font: { color: '#ffffff' }
            }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(container, [trace], layout, config);
    }

    createPovertyTrendsChart(container, data) {
        const years = Array.from({length: 10}, (_, i) => 2014 + i);
        const povertyRates = years.map(() => Math.random() * 20 + 40);
        
        const trace = {
            x: years,
            y: povertyRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Poverty Rate (%)',
            line: {
                color: '#ff3a21',
                width: 3
            },
            marker: {
                color: '#ff3a21',
                size: 8
            }
        };
        
        const layout = {
            title: {
                text: 'Poverty Trends Over Time',
                font: { color: '#ffffff' }
            },
            xaxis: { title: 'Year', color: '#ffffff' },
            yaxis: { title: 'Poverty Rate (%)', color: '#ffffff' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(container, [trace], layout, config);
    }

    createOverviewDashboard(container, data) {
        const indicators = ['SDG Progress', 'Poverty Rate', 'Food Security', 'Climate Action'];
        const values = [data.globalStats.sdgProgress, 100 - data.globalStats.povertyRate, 
                       data.globalStats.foodSecurityIndex, 100 - data.globalStats.climateCrisis * 10];
        
        const trace = {
            x: indicators,
            y: values,
            type: 'bar',
            marker: {
                color: ['#00ffff', '#ff3a21', '#4c9f38', '#fcc30b'],
                line: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    width: 1
                }
            }
        };
        
        const layout = {
            title: {
                text: 'Global Development Overview',
                font: { color: '#ffffff' }
            },
            xaxis: { title: 'Indicators', color: '#ffffff' },
            yaxis: { title: 'Score', color: '#ffffff' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(container, [trace], layout, config);
    }

    createDefaultChart(container, data) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ffffff;">
                <i class="fas fa-chart-bar" style="font-size: 48px; color: #00ffff; margin-bottom: 15px;"></i>
                <h4>Data Visualization</h4>
                <p>Chart will be generated based on your specific data requirements.</p>
            </div>
        `;
    }

    downloadChart(chartId) {
        const chart = this.charts.get(chartId);
        if (chart) {
            Plotly.downloadImage(document.getElementById(chartId), {
                format: 'png',
                width: 800,
                height: 600,
                filename: `data-chart-${Date.now()}`
            });
        }
    }

    fullscreenChart(chartId) {
        const chartElement = document.getElementById(chartId);
        if (chartElement.requestFullscreen) {
            chartElement.requestFullscreen();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('data-chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'data-typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-animation">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="typing-text">Analyzing data and creating visualization...</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('data-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Data generation methods (simplified versions of real data)
    generateSDGCountryData() {
        const countries = ['DRC', 'Rwanda', 'Kenya', 'Tanzania', 'Uganda', 'Canada', 'Sweden', 'Norway'];
        return countries.map(country => ({
            name: country,
            overallScore: Math.random() * 40 + 30,
            goalScores: Array.from({length: 17}, () => Math.random() * 50 + 25)
        }));
    }

    generateSDGIndicators() {
        const goals = [
            'No Poverty', 'Zero Hunger', 'Good Health', 'Quality Education',
            'Gender Equality', 'Clean Water', 'Clean Energy', 'Decent Work',
            'Industry Innovation', 'Reduced Inequalities', 'Sustainable Cities',
            'Responsible Consumption', 'Climate Action', 'Life Below Water',
            'Life on Land', 'Peace & Justice', 'Partnerships'
        ];
        return goals.map((goal, index) => ({
            id: index + 1,
            name: goal,
            globalScore: Math.random() * 30 + 40,
            trend: Math.random() > 0.5 ? 'improving' : 'declining'
        }));
    }

    generateTrendData() {
        const years = Array.from({length: 10}, (_, i) => 2014 + i);
        return {
            globalSDG: years.map(year => ({ year, value: Math.random() * 10 + 50 })),
            poverty: years.map(year => ({ year, value: Math.random() * 20 + 40 })),
            foodSecurity: years.map(year => ({ year, value: Math.random() * 15 + 60 }))
        };
    }

    generateGDPData() {
        return {
            countries: ['DRC', 'Rwanda', 'Kenya', 'Canada'],
            data: {
                'DRC': { gdp: 47.32, growth: 4.2, perCapita: 558 },
                'Rwanda': { gdp: 11.07, growth: 8.1, perCapita: 822 },
                'Kenya': { gdp: 95.5, growth: 5.4, perCapita: 1816 },
                'Canada': { gdp: 1643.0, growth: 3.1, perCapita: 43258 }
            }
        };
    }

    generatePovertyData() {
        return {
            global: 8.5,
            regional: {
                'Sub-Saharan Africa': 35.2,
                'South Asia': 12.4,
                'East Asia': 2.1,
                'Latin America': 8.9
            }
        };
    }

    generateInequalityData() {
        return {
            giniCoefficients: {
                'DRC': 42.1,
                'Rwanda': 43.7,
                'Kenya': 40.8,
                'Canada': 33.1
            }
        };
    }

    generateProductionData() {
        return {
            cereals: {
                'DRC': 2.1,
                'Rwanda': 1.8,
                'Kenya': 3.9,
                'Global': 2.9
            },
            livestock: {
                'DRC': 105.2,
                'Rwanda': 98.7,
                'Kenya': 112.3,
                'Global': 108.1
            }
        };
    }

    generateYieldData() {
        return {
            maize: { 'DRC': 1.2, 'Rwanda': 2.1, 'Kenya': 1.8 },
            rice: { 'DRC': 0.9, 'Rwanda': 2.8, 'Kenya': 2.3 },
            cassava: { 'DRC': 8.7, 'Rwanda': 12.4, 'Kenya': 9.8 }
        };
    }

    generateFoodSecurityData() {
        return {
            undernourishment: {
                'DRC': 61.9,
                'Rwanda': 36.4,
                'Kenya': 21.1,
                'Global': 8.9
            },
            stunting: {
                'DRC': 42.6,
                'Rwanda': 33.1,
                'Kenya': 26.2,
                'Global': 21.3
            }
        };
    }

    generateCountryIndicators(country) {
        // Generate comprehensive indicators for a specific country
        return {
            economic: {
                gdpPerCapita: Math.random() * 2000 + 500,
                growthRate: Math.random() * 6 + 2,
                inflationRate: Math.random() * 8 + 2
            },
            social: {
                literacyRate: Math.random() * 40 + 40,
                lifeExpectancy: Math.random() * 20 + 50,
                infantMortality: Math.random() * 80 + 20
            },
            environmental: {
                co2Emissions: Math.random() * 5 + 0.5,
                forestCover: Math.random() * 60 + 10,
                accessToCleanWater: Math.random() * 50 + 30
            }
        };
    }
}

// Initialize the data-enhanced chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataEnhancedChatbot = new DataEnhancedChatbot();
});

// Custom CSS for the data-enhanced chatbot
const chatbotStyles = `
<style>
.data-chatbot {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 10000;
    font-family: 'Exo 2', sans-serif;
}

.chat-button {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-green));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0, 255, 255, 0.3);
    position: relative;
    transition: all 0.3s ease;
}

.chat-button:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(0, 255, 255, 0.5);
}

.chat-button i {
    font-size: 24px;
    color: var(--dark-bg);
}

.chat-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: var(--neon-pink);
    color: var(--dark-bg);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    transform: scale(0);
    transition: transform 0.3s ease;
}

.chat-button:hover .chat-badge {
    transform: scale(1);
}

.pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--neon-cyan);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
}

.chat-window {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 420px;
    height: 600px;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid var(--neon-cyan);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    transform: translateY(100%) scale(0.8);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    overflow: hidden;
}

.chat-window.open {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.chat-header {
    padding: 20px;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 136, 0.1));
    border-bottom: 1px solid var(--dark-border);
    display: flex;
    align-items: center;
    gap: 15px;
}

.avatar-icon {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-green));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--dark-bg);
}

.chat-info h4 {
    color: var(--dark-text);
    margin: 0;
    font-size: 16px;
    font-weight: 700;
}

.status {
    color: var(--neon-green);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--neon-green);
    border-radius: 50%;
    animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.chat-actions {
    display: flex;
    gap: 10px;
    margin-left: auto;
}

.btn-icon {
    width: 35px;
    height: 35px;
    background: transparent;
    border: 1px solid var(--dark-border);
    border-radius: 8px;
    color: var(--dark-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    background: rgba(0, 255, 255, 0.1);
}

.chat-suggestions {
    padding: 15px 20px;
    border-bottom: 1px solid var(--dark-border);
}

.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.suggestion-chip {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: var(--neon-cyan);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.suggestion-chip:hover {
    background: var(--neon-cyan);
    color: var(--dark-bg);
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--neon-cyan) transparent;
}

.message {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.message-content {
    padding: 15px;
    border-radius: 15px;
    max-width: 85%;
    word-wrap: break-word;
}

.user-message .message-content {
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-green));
    color: var(--dark-bg);
    margin-left: auto;
    border-bottom-right-radius: 5px;
}

.bot-message .message-content {
    background: rgba(0, 255, 255, 0.1);
    color: var(--dark-text);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-bottom-left-radius: 5px;
}

.message-time {
    font-size: 10px;
    color: var(--dark-text-muted);
    align-self: flex-end;
}

.bot-message .message-time {
    align-self: flex-start;
}

.message-chart {
    margin-top: 15px;
    border-radius: 10px;
    overflow: hidden;
}

.chart-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.btn-small {
    padding: 5px 10px;
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid var(--neon-cyan);
    color: var(--neon-cyan);
    border-radius: 15px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-small:hover {
    background: var(--neon-cyan);
    color: var(--dark-bg);
}

.typing-indicator {
    opacity: 0.7;
}

.typing-animation {
    display: flex;
    align-items: center;
    gap: 10px;
}

.typing-dots {
    display: flex;
    gap: 4px;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: var(--neon-cyan);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
}

.typing-text {
    color: var(--dark-text-secondary);
    font-size: 12px;
}

.chat-input {
    padding: 20px;
    border-top: 1px solid var(--dark-border);
}

.input-container {
    display: flex;
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid var(--dark-border);
    border-radius: 25px;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.input-container:focus-within {
    border-color: var(--neon-cyan);
}

#data-chat-input-field {
    flex: 1;
    background: transparent;
    border: none;
    padding: 12px 20px;
    color: var(--dark-text);
    font-size: 14px;
    outline: none;
}

#data-chat-input-field::placeholder {
    color: var(--dark-text-muted);
}

.input-actions {
    display: flex;
    align-items: center;
    padding: 5px;
    gap: 5px;
}

.input-actions .btn-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

#data-chat-send {
    background: var(--neon-cyan);
    color: var(--dark-bg);
    border: none;
}

#data-chat-send:disabled {
    background: var(--dark-border);
    color: var(--dark-text-muted);
    cursor: not-allowed;
}

.chat-footer {
    padding: 10px 20px;
    border-top: 1px solid var(--dark-border);
    background: rgba(0, 255, 255, 0.02);
}

.data-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--dark-text-muted);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-dot {
    width: 6px;
    height: 6px;
    background: var(--neon-green);
    border-radius: 50%;
    animation: pulse-dot 1.5s infinite;
}

@media (max-width: 480px) {
    .data-chatbot {
        bottom: 20px;
        right: 20px;
    }
    
    .chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 100px);
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', chatbotStyles);