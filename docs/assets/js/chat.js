
// ==========================================================================
//           CHAT WIDGET FOR PATRICE MIRINDI PORTFOLIO
// ==========================================================================

class ChatWidget {
    constructor(options = {}) {
        this.options = {
            questionsFile: options.questionsFile || 'assets/data/chatbot_PatMir_questions_keywords_answers.csv',
            maxMessages: options.maxMessages || 50,
            typingDelay: options.typingDelay || 1000,
            ...options
        };
        
        this.chatData = [];
        this.conversationHistory = [];
        this.isTyping = false;
        
        this.init();
    }
    
    async init() {
        await this.loadChatData();
        this.bindEvents();
        this.showWelcomeMessage();
    }
    
    async loadChatData() {
        try {
            const response = await fetch(this.options.questionsFile);
            const csvText = await response.text();
            this.chatData = this.parseCSV(csvText);
            console.log('Chat data loaded:', this.chatData.length, 'entries');
        } catch (error) {
            console.error('Error loading chat data:', error);
            this.chatData = this.getFallbackData();
        }
    }
    
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCSVLine(lines[i]);
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header] = values[index] || '';
                });
                data.push(entry);
            }
        }
        
        return data;
    }
    
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && nextChar === '"') {
                current += '"';
                i++; // Skip next quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }
    
    bindEvents() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatSend = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');
        
        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }
        
        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }
        
        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Quick reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.getAttribute('data-message');
                this.handleUserMessage(message);
            }
        });
    }
    
    toggleChat() {
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.classList.toggle('active');
            
            if (chatPanel.classList.contains('active')) {
                this.focusChatInput();
                this.trackEvent('chat_opened');
            } else {
                this.trackEvent('chat_closed');
            }
        }
    }
    
    closeChat() {
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.classList.remove('active');
            this.trackEvent('chat_closed');
        }
    }
    
    focusChatInput() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            setTimeout(() => {
                chatInput.focus();
            }, 300);
        }
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        this.handleUserMessage(message);
        chatInput.value = '';
    }
    
    handleUserMessage(message) {
        this.addMessage(message, 'user');
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        this.showTyping();
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
            this.conversationHistory.push({ role: 'bot', content: response });
        }, this.options.typingDelay);
        
        this.trackEvent('message_sent', { message_length: message.length });
    }
    
    generateResponse(userMessage) {
        const normalizedMessage = userMessage.toLowerCase().trim();
        
        // Find best match from CSV data
        let bestMatch = null;
        let bestScore = 0;
        
        this.chatData.forEach(entry => {
            const keywords = entry.keywords ? entry.keywords.toLowerCase().split(',') : [];
            const question = entry.question ? entry.question.toLowerCase() : '';
            
            let score = 0;
            
            // Check keywords
            keywords.forEach(keyword => {
                if (normalizedMessage.includes(keyword.trim())) {
                    score += 3;
                }
            });
            
            // Check question similarity
            const questionWords = question.split(' ');
            const messageWords = normalizedMessage.split(' ');
            
            questionWords.forEach(word => {
                if (messageWords.includes(word) && word.length > 3) {
                    score += 1;
                }
            });
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = entry;
            }
        });
        
        if (bestMatch && bestScore > 0) {
            return this.formatResponse(bestMatch.answer);
        }
        
        return this.getFallbackResponse(normalizedMessage);
    }
    
    formatResponse(response) {
        // Add personality and formatting to responses
        const responses = response.split('|');
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return randomResponse.trim();
    }
    
    getFallbackResponse(message) {
        const fallbacks = [
            "That's an interesting question! You can find more detailed information about my background and services throughout the website, or feel free to contact me directly at patricemirindi@gmail.com.",
            "I'd be happy to help with that! For specific inquiries about my services or experience, please check out the relevant sections of my portfolio or reach out to me directly.",
            "Thanks for your question! While I have information about my general background and services, for detailed discussions, I'd recommend using the contact form or emailing me at patricemirindi@gmail.com.",
            "Great question! You can explore my work experience, skills, and projects throughout this website. For personalized consultations, let's connect via the contact page!",
            "I appreciate your interest! For comprehensive information about my expertise in data analytics and economic consulting, please browse the different sections of my portfolio."
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    addMessage(content, sender, showAvatar = true) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        let avatarHTML = '';
        if (showAvatar && sender === 'bot') {
            avatarHTML = '<div class="message-avatar"><img src="assets/img/patricemirindi.jpg" alt="Patrice" width="30" height="30"></div>';
        }
        
        messageDiv.innerHTML = `
            ${avatarHTML}
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Animate message
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = sender === 'user' ? 'translateX(20px)' : 'translateX(-20px)';
        
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        }, 50);
        
        this.scrollToBottom();
        
        // Limit message history
        if (chatMessages.children.length > this.options.maxMessages) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }
    
    showTyping() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/img/patricemirindi.jpg" alt="Patrice" width="30" height="30">
            </div>
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessages = [
                "Hello! I'm here to answer questions about my background, experience, and services. How can I help you today?",
                "Welcome! Feel free to ask me about my data analytics expertise, project experience, or consulting services.",
                "Hi there! I can help you learn more about my work in economic development, data analytics, and project management."
            ];
            
            const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            this.addMessage(randomWelcome, 'bot');
            
            // Add quick reply buttons
            setTimeout(() => {
                this.addQuickReplies();
            }, 1000);
        }, 2000);
    }
    
    addQuickReplies() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies-container';
        quickRepliesDiv.innerHTML = `
            <div class="quick-replies">
                <button class="quick-reply" data-message="Tell me about your experience">Experience</button>
                <button class="quick-reply" data-message="What services do you offer?">Services</button>
                <button class="quick-reply" data-message="Show me your key projects">Projects</button>
                <button class="quick-reply" data-message="What are your technical skills?">Skills</button>
            </div>
        `;
        
        chatMessages.appendChild(quickRepliesDiv);
        this.scrollToBottom();
    }
    
    getFallbackData() {
        return [
            {
                question: "What is your experience?",
                keywords: "experience, background, work, career, years",
                answer: "I have 8+ years of experience in data analytics and economic development, working with organizations like the World Bank, GIZ, and Financial Resilience Institute."
            },
            {
                question: "What services do you offer?",
                keywords: "services, offer, consulting, help, work",
                answer: "I offer data analytics consulting, economic development advisory services, financial resilience frameworks, and project management for international development initiatives."
            },
            {
                question: "What are your technical skills?",
                keywords: "skills, technical, programming, tools, software",
                answer: "I'm proficient in R programming, Python, Stata, SPSS, Power BI, Tableau, and advanced Excel. I specialize in statistical analysis, econometric modeling, and data visualization."
            },
            {
                question: "Tell me about your projects",
                keywords: "projects, work, portfolio, examples, case studies",
                answer: "I've led projects like the Financial Resilience Framework in Canada, multi-country agricultural development initiatives, and EU trade facilitation programs. You can see detailed examples in my portfolio."
            },
            {
                question: "How can I contact you?",
                keywords: "contact, reach, email, phone, connect",
                answer: "You can reach me at patricemirindi@gmail.com or through the contact form on this website. I'm based in Winnipeg, Canada and available for remote and on-site consulting."
            }
        ];
    }
    
    trackEvent(eventName, properties = {}) {
        // Integrate with analytics (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'chat_widget',
                ...properties
            });
        }
        
        console.log('Chat event:', eventName, properties);
    }
}

// Initialize chat widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chat-widget')) {
        window.chatWidget = new ChatWidget({
            questionsFile: 'assets/data/chatbot_PatMir_questions_keywords_answers.csv'
        });
    }
});

// Add CSS for typing indicator if not already present
if (!document.querySelector('#chat-typing-styles')) {
    const style = document.createElement('style');
    style.id = 'chat-typing-styles';
    style.textContent = `
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 1rem;
            gap: 0.25rem;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--text-light);
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
        
        .quick-replies-container {
            padding: 1rem;
            border-top: 1px solid var(--border-light);
        }
        
        .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .quick-reply {
            padding: 0.5rem 1rem;
            background: var(--background-light);
            border: 1px solid var(--border-light);
            border-radius: 20px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-normal);
        }
        
        .quick-reply:hover {
            background: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }
        
        .message-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .message-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .message-content {
            flex: 1;
        }
        
        .message-time {
            font-size: 0.75rem;
            color: var(--text-light);
            margin-top: 0.25rem;
            display: block;
        }
        
        .bot-message {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .user-message {
            text-align: right;
            margin-left: 2rem;
            margin-bottom: 1rem;
        }
        
        .user-message .message-content {
            background: var(--primary-color);
            color: var(--white);
            padding: 0.75rem 1rem;
            border-radius: 18px 18px 4px 18px;
            display: inline-block;
        }
        
        .bot-message .message-content {
            background: var(--background-light);
            padding: 0.75rem 1rem;
            border-radius: 18px 18px 18px 4px;
        }
    `;
    document.head.appendChild(style);
}
