// ==========================================================================
// CHAT WIDGET
// ==========================================================================

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.aboutData = null;
        this.workExperienceData = [];
        this.skillsData = null;
        this.projectsData = [];
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
            // Load About data
            const aboutResponse = await fetch('/data/about.json');
            if (aboutResponse.ok) {
                this.aboutData = await aboutResponse.json();
            }

            // Load Work Experience data
            const workResponse = await fetch('/data/work_experience.json');
            if (workResponse.ok) {
                this.workExperienceData = await workResponse.json();
            }

            // Load Skills data
            const skillsResponse = await fetch('/data/skills_expertise.json');
            if (skillsResponse.ok) {
                this.skillsData = await skillsResponse.json();
            }

            // Load Projects data
            const projectsResponse = await fetch('/data/key_projects.json');
            if (projectsResponse.ok) {
                this.projectsData = await projectsResponse.json();
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
            'Hello! I\'m here to answer questions about my background, work experience, skills, and projects. How can I help you today?',
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

        switch (intent) {
            case 'ABOUT':
                matches = this.searchAbout(message);
                sources = matches.map(match => `About: ${match.key}`);
                break;
            case 'WORK':
                matches = this.searchWorkExperience(message);
                sources = matches.map(match => `Work: ${match.title}`);
                break;
            case 'SKILLS':
                matches = this.searchSkills(message);
                sources = matches.map(match => `Skills: ${match.category}`);
                break;
            case 'PROJECTS':
                matches = this.searchProjects(message);
                sources = matches.map(match => `Project: ${match.title}`);
                break;
            default:
                return {
                    answer: "I can only answer questions about my background, work experience, skills, and projects. Please try rephrasing or use the Contact page for other inquiries.",
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
            answer: bestMatch.answer || bestMatch.value || bestMatch.description,
            sources: sources.slice(0, 3)
        };
    }

    classifyIntent(message) {
        const lowerMessage = message.toLowerCase();

        // About indicators
        const aboutKeywords = [
            'about you', 'bio', 'tell me', 'personal', 'yourself',
            'who are you', 'your story', 'background', 'from', 'languages',
            'location', 'education', 'journey'
        ];

        // Work experience indicators
        const workKeywords = [
            'work', 'experience', 'job', 'career', 'position', 'role',
            'employer', 'company', 'responsibilities', 'achievements'
        ];

        // Skills indicators
        const skillsKeywords = [
            'skills', 'expertise', 'tools', 'technologies', 'programming',
            'languages', 'certifications', 'capabilities', 'proficient'
        ];

        // Projects indicators
        const projectsKeywords = [
            'projects', 'work samples', 'portfolio', 'case studies',
            'what have you built', 'examples', 'deliverables'
        ];

        let aboutScore = this.calculateKeywordScore(lowerMessage, aboutKeywords);
        let workScore = this.calculateKeywordScore(lowerMessage, workKeywords);
        let skillsScore = this.calculateKeywordScore(lowerMessage, skillsKeywords);
        let projectsScore = this.calculateKeywordScore(lowerMessage, projectsKeywords);

        // Return the intent with the highest score
        const maxScore = Math.max(aboutScore, workScore, skillsScore, projectsScore);

        if (maxScore === 0) return 'OTHER';
        if (maxScore === aboutScore) return 'ABOUT';
        if (maxScore === workScore) return 'WORK';
        if (maxScore === skillsScore) return 'SKILLS';
        if (maxScore === projectsScore) return 'PROJECTS';

        return 'OTHER';
    }

    calculateKeywordScore(message, keywords) {
        return keywords.reduce((score, keyword) => {
            return message.includes(keyword) ? score + 1 : score;
        }, 0);
    }

    searchAbout(message) {
        if (!this.aboutData) return [];

        const lowerMessage = message.toLowerCase();
        const matches = [];

        const searchableFields = {
            'name': this.aboutData.name,
            'title': this.aboutData.title,
            'tagline': this.aboutData.tagline,
            'summary': this.aboutData.summary,
            'location': this.aboutData.location,
            'languages': this.aboutData.languages.join(', '),
            'personal_info': JSON.stringify(this.aboutData.personal_info)
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

    searchWorkExperience(message) {
        if (!this.workExperienceData || this.workExperienceData.length === 0) return [];

        const lowerMessage = message.toLowerCase();
        const matches = [];

        this.workExperienceData.forEach(job => {
            let score = 0;

            // Check title and company
            const searchText = `${job.title} ${job.company} ${job.description} ${job.achievements.join(' ')}`.toLowerCase();
            const words = searchText.split(/\s+/);
            const messageWords = lowerMessage.split(/\s+/);

            messageWords.forEach(msgWord => {
                if (msgWord.length > 3 && words.some(word => word.includes(msgWord))) {
                    score += 1;
                }
            });

            if (score > 0) {
                matches.push({
                    title: job.title,
                    company: job.company,
                    answer: `${job.title} at ${job.company} (${job.period}): ${job.description}`,
                    score: score
                });
            }
        });

        return matches.sort((a, b) => b.score - a.score).slice(0, 3);
    }

    searchSkills(message) {
        if (!this.skillsData) return [];

        const lowerMessage = message.toLowerCase();
        const matches = [];

        // Search technical skills
        Object.entries(this.skillsData.technical_skills || {}).forEach(([category, data]) => {
            const skills = data.skills || [];
            skills.forEach(skill => {
                if (lowerMessage.includes(skill.name.toLowerCase())) {
                    matches.push({
                        category: data.category,
                        skill: skill.name,
                        answer: `I have ${skill.level.toLowerCase()} level expertise in ${skill.name} with ${skill.years} years of experience.`,
                        score: 2
                    });
                }
            });
        });

        // Search domain expertise
        Object.entries(this.skillsData.domain_expertise || {}).forEach(([domain, data]) => {
            const areas = data.areas || [];
            areas.forEach(area => {
                const words = area.toLowerCase().split(/\s+/);
                const messageWords = lowerMessage.split(/\s+/);

                let score = 0;
                messageWords.forEach(msgWord => {
                    if (msgWord.length > 3 && words.some(word => word.includes(msgWord))) {
                        score += 1;
                    }
                });

                if (score > 0) {
                    matches.push({
                        category: data.category,
                        area: area,
                        answer: `I specialize in ${area} as part of my expertise in ${data.category}.`,
                        score: score
                    });
                }
            });
        });

        return matches.sort((a, b) => b.score - a.score).slice(0, 3);
    }

    searchProjects(message) {
        if (!this.projectsData || this.projectsData.length === 0) return [];

        const lowerMessage = message.toLowerCase();
        const matches = [];

        this.projectsData.forEach(project => {
            let score = 0;

            // Check project details
            const searchText = `${project.title} ${project.client} ${project.category} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
            const words = searchText.split(/\s+/);
            const messageWords = lowerMessage.split(/\s+/);

            messageWords.forEach(msgWord => {
                if (msgWord.length > 3 && words.some(word => word.includes(msgWord))) {
                    score += 1;
                }
            });

            if (score > 0) {
                matches.push({
                    title: project.title,
                    client: project.client,
                    answer: `${project.title} for ${project.client}: ${project.description}`,
                    score: score
                });
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