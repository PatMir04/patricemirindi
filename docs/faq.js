// ==========================================================================
// FAQ PAGE FUNCTIONALITY
// ==========================================================================

class FAQManager {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.currentCategory = 'all';
        this.searchTerm = '';

        this.init();
    }

    async init() {
        await this.loadFAQData();
        this.setupEventListeners();
        this.renderFAQs();
    }

    async loadFAQData() {
        try {
            const response = await fetch('/data/faq.json');
            if (response.ok) {
                this.faqData = await response.json();
                this.filteredData = [...this.faqData];
            } else {
                throw new Error('Failed to load FAQ data');
            }
        } catch (error) {
            console.error('Error loading FAQ data:', error);
            this.showError('Failed to load FAQ data. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('faq-search-input');
        const searchBtn = document.getElementById('faq-search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', PatriceUtils.debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.filterAndRender();
            }, 300));

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchTerm = e.target.value.toLowerCase().trim();
                    this.filterAndRender();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    this.searchTerm = searchInput.value.toLowerCase().trim();
                    this.filterAndRender();
                }
            });
        }

        // Category filters
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                categoryButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update current category
                this.currentCategory = e.target.dataset.category;
                this.filterAndRender();
            });
        });
    }

    filterAndRender() {
        this.filteredData = this.faqData.filter(item => {
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || 
                                item.category === this.currentCategory;

            // Search filter
            const searchMatch = !this.searchTerm || 
                               item.question.toLowerCase().includes(this.searchTerm) ||
                               item.answer.toLowerCase().includes(this.searchTerm) ||
                               item.keywords.some(keyword => 
                                   keyword.toLowerCase().includes(this.searchTerm)
                               );

            return categoryMatch && searchMatch;
        });

        this.renderFAQs();
    }

    renderFAQs() {
        const container = document.getElementById('faq-container');
        const noResults = document.getElementById('no-results');

        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        if (this.filteredData.length === 0) {
            container.style.display = 'none';
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        container.style.display = 'grid';
        if (noResults) {
            noResults.style.display = 'none';
        }

        // Group FAQs by category for better organization
        const groupedFAQs = this.groupByCategory(this.filteredData);

        Object.entries(groupedFAQs).forEach(([category, items]) => {
            if (this.currentCategory === 'all' && Object.keys(groupedFAQs).length > 1) {
                // Add category header if showing all categories
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'faq-category-header';
                categoryHeader.innerHTML = `<h3>${this.getCategoryDisplayName(category)}</h3>`;
                container.appendChild(categoryHeader);
            }

            items.forEach(item => {
                const faqElement = this.createFAQElement(item);
                container.appendChild(faqElement);
            });
        });

        // Add scroll animation
        container.classList.add('fade-in');
    }

    groupByCategory(faqs) {
        const grouped = {};
        faqs.forEach(faq => {
            const category = faq.category || 'general';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(faq);
        });
        return grouped;
    }

    getCategoryDisplayName(category) {
        const displayNames = {
            'about': 'About Patrice',
            'services': 'Services & Consulting',
            'experience': 'Experience & Projects',
            'technical': 'Technical Skills',
            'personal': 'Personal Information',
            'work': 'Work & Career',
            'education': 'Education',
            'contact': 'Contact Information',
            'greeting': 'General',
            'general': 'General Questions'
        };
        return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    createFAQElement(faq) {
        const faqDiv = document.createElement('div');
        faqDiv.className = 'faq-item';

        // Highlight search terms in question and answer
        const highlightedQuestion = this.highlightSearchTerm(faq.question);
        const highlightedAnswer = this.highlightSearchTerm(faq.answer);

        faqDiv.innerHTML = `
            <div class="faq-question" role="button" tabindex="0" aria-expanded="false">
                <h3>${highlightedQuestion}</h3>
                <button class="faq-toggle" aria-label="Toggle answer">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="faq-answer" aria-hidden="true">
                <div class="faq-answer-content">
                    <p>${highlightedAnswer}</p>
                    ${faq.keywords.length > 0 ? `
                        <div class="faq-tags">
                            <small><strong>Related:</strong> ${faq.keywords.slice(0, 5).join(', ')}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add click event for expand/collapse
        const questionDiv = faqDiv.querySelector('.faq-question');
        const answerDiv = faqDiv.querySelector('.faq-answer');
        const toggleBtn = faqDiv.querySelector('.faq-toggle');

        const toggleFAQ = () => {
            const isOpen = answerDiv.classList.contains('active');

            if (isOpen) {
                answerDiv.classList.remove('active');
                toggleBtn.classList.remove('active');
                questionDiv.setAttribute('aria-expanded', 'false');
                answerDiv.setAttribute('aria-hidden', 'true');
            } else {
                answerDiv.classList.add('active');
                toggleBtn.classList.add('active');
                questionDiv.setAttribute('aria-expanded', 'true');
                answerDiv.setAttribute('aria-hidden', 'false');
            }
        };

        questionDiv.addEventListener('click', toggleFAQ);
        questionDiv.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ();
            }
        });

        return faqDiv;
    }

    highlightSearchTerm(text) {
        if (!this.searchTerm || this.searchTerm.length < 2) {
            return text;
        }

        const regex = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showError(message) {
        const container = document.getElementById('faq-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading FAQ</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }
}

// Initialize FAQ manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('faq-container')) {
        window.faqManager = new FAQManager();
    }
});

// Add some CSS for FAQ-specific styling
const faqStyles = `
<style>
.faq-category-header {
    grid-column: 1 / -1;
    margin: 2rem 0 1rem 0;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
}

.faq-category-header h3 {
    color: var(--primary-color);
    margin: 0;
}

.faq-tags {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
    color: var(--text-light);
}

.faq-answer-content p {
    margin-bottom: 0;
}

mark {
    background: var(--accent-color);
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
}

.error-message {
    text-align: center;
    padding: 3rem;
    grid-column: 1 / -1;
}

.error-message i {
    font-size: 3rem;
    color: var(--danger);
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .faq-category-header {
        margin: 1rem 0 0.5rem 0;
    }

    .faq-item {
        margin-bottom: 1rem;
    }
}
</style>
`;

// Inject FAQ styles
document.head.insertAdjacentHTML('beforeend', faqStyles);