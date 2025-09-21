// ==========================================================================
// CHAT WIDGET
// ==========================================================================

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.faqData = [];
        this.aboutData = null;
        this.apiEndpoint = '/api/chat'; // Will be replaced with actual serverless function URL

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    async loadData() {
        try {
            // Load FAQ data
            const faqResponse = await fetch('/data/faq.json');
            if (faqResponse.ok) {
                this.faqData = await faqResponse.json();
            }

            // Load About data
            const aboutResponse = await fetch('/data/about.json');
            if (aboutResponse.ok) {
                this.aboutData = await aboutResponse.json();
            }
        } catch (error) {
            console.warn('Could not load chat data:', error);
        }
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatSend = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggle());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.close());
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            const chatWidget = document.getElementById('chat-widget');
            if (chatWidget && !chatWidget.contains(e.target) && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.style.display = 'flex';
            this.isOpen = true;

            // Focus on input
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        }
    }

    close() {
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.style.display = 'none';
            this.isOpen = false;
        }
    }

    addWelcomeMessage() {
        this.addMessage(
            'Hello! I\'m here to answer questions about my background, experience, and services. How can I help you today?',
            'bot'
        );
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput || !chatInput.value.trim()) return;

        const userMessage = chatInput.value.trim();
        chatInput.value = '';

        // Add user message to chat
        this.addMessage(userMessage, 'user');

        // Show typing indicator
        this.showTyping();

        try {
            // Try to get response from API first
            const response = await this.getApiResponse(userMessage);
            this.hideTyping();
            this.addMessage(response.answer, 'bot', response.sources);
        } catch (error) {
            console.warn('API unavailable, using fallback:', error);
            this.hideTyping();

            // Fallback to client-side matching
            const fallbackResponse = this.getFallbackResponse(userMessage);
            this.addMessage(
                fallbackResponse.answer + '\n\n_AI service unavailable—showing closest matches._',
                'bot',
                fallbackResponse.sources
            );
        }
    }

    async getApiResponse(message) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                session_id: this.getSessionId()
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    }

    getFallbackResponse(message) {
        const intent = this.classifyIntent(message);
        let matches = [];
        let sources = [];

        if (intent === 'FAQ') {
            matches = this.searchFAQ(message);
            sources = matches.map(match => `FAQ #${match.id}`);
        } else if (intent === 'ABOUT') {
            matches = this.searchAbout(message);
            sources = matches.map(match => `About: ${match.key}`);
        } else {
            return {
                answer: "I can only answer questions from the site FAQ or about Patrice. Please try rephrasing or use the Contact page.",
                sources: []
            };
        }

        if (matches.length === 0) {
            return {
                answer: "I don't have enough information in the site data to answer that question. Please try rephrasing or contact me directly.",
                sources: []
            };
        }

        // Return the best match
        const bestMatch = matches[0];
        return {
            answer: bestMatch.answer || bestMatch.value,
            sources: sources.slice(0, 3) // Limit to top 3 sources
        };
    }

    classifyIntent(message) {
        const lowerMessage = message.toLowerCase();

        // FAQ indicators
        const faqKeywords = [
            'what do you do', 'experience', 'projects', 'tools', 'skills',
            'education', 'background', 'work', 'consulting', 'analytics',
            'languages', 'where from', 'contact', 'services'
        ];

        // About indicators  
        const aboutKeywords = [
            'about you', 'bio', 'tell me', 'personal', 'yourself',
            'who are you', 'your story', 'career', 'journey'
        ];

        const faqScore = faqKeywords.reduce((score, keyword) => {
            return lowerMessage.includes(keyword) ? score + 1 : score;
        }, 0);

        const aboutScore = aboutKeywords.reduce((score, keyword) => {
            return lowerMessage.includes(keyword) ? score + 1 : score;
        }, 0);

        if (faqScore > aboutScore) {
            return 'FAQ';
        } else if (aboutScore > 0) {
            return 'ABOUT';
        } else {
            // Check if any FAQ keywords match
            const hasAnyFaqKeyword = this.faqData.some(item => 
                item.keywords.some(keyword => 
                    lowerMessage.includes(keyword.toLowerCase())
                )
            );
            return hasAnyFaqKeyword ? 'FAQ' : 'OTHER';
        }
    }

    searchFAQ(message) {
        const lowerMessage = message.toLowerCase();
        const matches = [];

        this.faqData.forEach(item => {
            let score = 0;

            // Check keywords
            item.keywords.forEach(keyword => {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    score += 2;
                }
            });

            // Check question similarity
            const questionWords = item.question.toLowerCase().split(/\s+/);
            questionWords.forEach(word => {
                if (word.length > 3 && lowerMessage.includes(word)) {
                    score += 1;
                }
            });

            if (score > 0) {
                matches.push({ ...item, score });
            }
        });

        // Sort by score (highest first) and return top 3
        return matches.sort((a, b) => b.score - a.score).slice(0, 3);
    }

    searchAbout(message) {
        if (!this.aboutData) return [];

        const lowerMessage = message.toLowerCase();
        const matches = [];

        // Search through about data
        const searchableFields = {
            'name': this.aboutData.name,
            'summary': this.aboutData.summary,
            'location': this.aboutData.location,
            'languages': this.aboutData.languages.join(', '),
            'skills': this.aboutData.skills.join(', '),
            'availability': this.aboutData.availability,
            'roles': this.aboutData.roles.join(', ')
        };

        Object.entries(searchableFields).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const words = value.toLowerCase().split(/\s+/);
                const messageWords = lowerMessage.split(/\s+/);

                let score = 0;
                messageWords.forEach(msgWord => {
                    if (msgWord.length > 3 && words.some(word => word.includes(msgWord))) {
                        score += 1;
                    }
                });

                if (score > 0) {
                    matches.push({
                        key: key,
                        value: value,
                        answer: value,
                        score: score
                    });
                }
            }
        });

        return matches.sort((a, b) => b.score - a.score).slice(0, 3);
    }

    addMessage(text, sender, sources = []) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        let messageContent = `<p>${this.escapeHtml(text)}</p>`;

        if (sources && sources.length > 0) {
            messageContent += `<div class="sources"><small><strong>Sources:</strong> ${sources.join(', ')}</small></div>`;
        }

        messageDiv.innerHTML = messageContent;
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to messages array
        this.messages.push({
            text: text,
            sender: sender,
            sources: sources,
            timestamp: new Date()
        });
    }

    showTyping() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Patrice is typing...</p>';

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getSessionId() {
        let sessionId = localStorage.getItem('chat_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_session_id', sessionId);
        }
        return sessionId;
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('chat-widget')) {
        window.chatWidget = new ChatWidget();
    }
});
