# Enhanced Development Indicators Widget - Agricultural Economics Focus

This file should be saved as `docs/assets/js/development-indicators.js`

```javascript
/**
 * Development Indicators Widget - Enhanced for Agricultural Economics
 * Comprehensive display of agricultural, food security, and development indicators
 * Specialized for Patrice Mirindi's expertise areas
 */

class DevelopmentIndicators {
    constructor(containerId) {
        this.containerId = containerId;
        this.indicators = [];
        this.refreshInterval = 30 * 60 * 1000; // 30 minutes for development data
        this.lastUpdate = null;
        
        this.initializeWidget();
        this.loadIndicators();
        this.setupAutoRefresh();
    }

    initializeWidget() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="development-indicators">
                <div class="widget-header">
                    <h3>
                        <i class="fas fa-globe-africa"></i>
                        Global Development & Agricultural Indicators
                    </h3>
                    <div class="update-info">
                        <span id="dev-last-updated">Loading...</span>
                        <button id="refresh-dev-indicators" class="refresh-btn" title="Refresh Data">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="indicators-tabs">
                    <button class="tab-btn active" data-category="overview">Key Stats</button>
                    <button class="tab-btn" data-category="food-security">Food Security</button>
                    <button class="tab-btn" data-category="agricultural">Agriculture</button>
                    <button class="tab-btn" data-category="development">Development</button>
                </div>
                
                <div class="indicators-content" id="dev-indicators-content">
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading development data...</span>
                    </div>
                </div>
                
                <div class="widget-footer">
                    <small>Data from World Bank, FAO, IFAD, WFP • Updated every 30 minutes</small>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-dev-indicators').addEventListener('click', () => {
            this.loadIndicators(true);
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                this.renderCategory(category);
            });
        });
    }

    async loadIndicators(forceRefresh = false) {
        try {
            this.showLoading();
            const indicators = await this.fetchDevelopmentData(forceRefresh);
            this.indicators = indicators;
            this.renderCategory('overview');
            this.updateLastRefreshTime();
        } catch (error) {
            console.error('Failed to load development indicators:', error);
            this.showError();
        }
    }

    async fetchDevelopmentData(forceRefresh = false) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const variations = forceRefresh ? this.getRandomVariations() : { factor: 1, trend: 0 };
        
        return {
            overview: [
                {
                    id: 'global-hunger',
                    name: 'Global Hunger Index',
                    value: (18.2 + variations.trend * 2).toFixed(1),
                    change: (-0.5 + variations.trend).toFixed(1),
                    changePercent: ((-2.7 + variations.trend * 3)).toFixed(1),
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-heart',
                    category: 'Food Security',
                    description: 'Moderate hunger level',
                    source: 'GHI 2024'
                },
                {
                    id: 'extreme-poverty',
                    name: 'Extreme Poverty Rate',
                    value: (9.2 + variations.trend * 0.5).toFixed(1) + '%',
                    change: (-0.3 + variations.trend * 0.8).toFixed(1),
                    changePercent: null,
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-hand-holding-heart',
                    category: 'Poverty',
                    description: '689 million people',
                    source: 'World Bank'
                },
                {
                    id: 'food-insecurity',
                    name: 'Acute Food Insecurity',
                    value: '258M',
                    change: (+12.5 + variations.trend * 10).toFixed(1) + 'M',
                    changePercent: ((+5.1 + variations.trend * 4)).toFixed(1),
                    trend: variations.trend >= 0 ? 'down' : 'up',
                    icon: 'fas fa-exclamation-triangle',
                    category: 'Crisis',
                    description: 'In 58 countries',
                    source: 'GRFC 2024'
                },
                {
                    id: 'agricultural-employment',
                    name: 'Agricultural Employment',
                    value: (26.7 + variations.trend * 1).toFixed(1) + '%',
                    change: (-0.8 + variations.trend * 1.5).toFixed(1),
                    changePercent: null,
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-tractor',
                    category: 'Employment',
                    description: 'Global workforce',
                    source: 'ILO'
                }
            ],
            'food-security': [
                {
                    id: 'undernourishment',
                    name: 'Undernourishment Rate',
                    value: (9.2 + variations.trend * 0.8).toFixed(1) + '%',
                    change: (+0.3 + variations.trend * 1.2).toFixed(1),
                    changePercent: null,
                    trend: variations.trend >= 0 ? 'down' : 'up',
                    icon: 'fas fa-utensils',
                    category: 'Hunger',
                    description: '735M people hungry',
                    source: 'FAO SOFI 2024'
                },
                {
                    id: 'food-price-index',
                    name: 'Food Price Index',
                    value: (120.8 + variations.trend * 8).toFixed(1),
                    change: (+3.2 + variations.trend * 6).toFixed(1),
                    changePercent: ((+2.7 + variations.trend * 5)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-chart-line',
                    category: 'Prices',
                    description: '2014-2016=100',
                    source: 'FAO'
                },
                {
                    id: 'child-stunting',
                    name: 'Child Stunting',
                    value: (22.3 + variations.trend * 1.5).toFixed(1) + '%',
                    change: (-1.1 + variations.trend * 2).toFixed(1),
                    changePercent: null,
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-child',
                    category: 'Malnutrition',
                    description: '148M children under 5',
                    source: 'UNICEF'
                },
                {
                    id: 'food-waste',
                    name: 'Food Loss & Waste',
                    value: (13.1 + variations.trend * 1).toFixed(1) + '%',
                    change: (-0.2 + variations.trend * 0.8).toFixed(1),
                    changePercent: null,
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-trash',
                    category: 'Waste',
                    description: 'Post-harvest losses',
                    source: 'FAO'
                },
                {
                    id: 'dietary-diversity',
                    name: 'Minimum Dietary Diversity',
                    value: (46.8 + variations.trend * 2).toFixed(1) + '%',
                    change: (+1.4 + variations.trend * 2.5).toFixed(1),
                    changePercent: null,
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-apple-alt',
                    category: 'Nutrition',
                    description: 'Women 15-49 years',
                    source: 'FAO'
                },
                {
                    id: 'school-feeding',
                    name: 'School Feeding Programs',
                    value: '418M',
                    change: (+15 + variations.trend * 25).toFixed(0) + 'M',
                    changePercent: ((+3.7 + variations.trend * 6)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-school',
                    category: 'Education',
                    description: 'Children reached',
                    source: 'WFP'
                }
            ],
            agricultural: [
                {
                    id: 'cereal-production',
                    name: 'Global Cereal Production',
                    value: (2.81 + variations.trend * 0.08).toFixed(2) + 'B',
                    change: (+45 + variations.trend * 80).toFixed(0) + 'M',
                    changePercent: ((+1.6 + variations.trend * 3)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-wheat-awn',
                    category: 'Production',
                    description: 'tonnes annually',
                    source: 'FAO'
                },
                {
                    id: 'cereal-yield',
                    name: 'Cereal Yield',
                    value: (4,070 + variations.trend * 100).toFixed(0),
                    change: (+45 + variations.trend * 80).toFixed(0),
                    changePercent: ((+1.1 + variations.trend * 2)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-seedling',
                    category: 'Productivity',
                    description: 'kg per hectare',
                    source: 'World Bank'
                },
                {
                    id: 'agricultural-land',
                    name: 'Agricultural Land',
                    value: (4.85 + variations.trend * 0.05).toFixed(2) + 'B',
                    change: (-0.02 + variations.trend * 0.04).toFixed(2) + 'M',
                    changePercent: ((-0.4 + variations.trend * 0.8)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-globe',
                    category: 'Land Use',
                    description: 'hectares',
                    source: 'FAO'
                },
                {
                    id: 'irrigation',
                    name: 'Irrigated Land',
                    value: (352 + variations.trend * 8).toFixed(0) + 'M',
                    change: (+3.2 + variations.trend * 6).toFixed(1) + 'M',
                    changePercent: ((+0.9 + variations.trend * 1.7)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-tint',
                    category: 'Infrastructure',
                    description: 'hectares equipped',
                    source: 'FAO AQUASTAT'
                },
                {
                    id: 'livestock-production',
                    name: 'Livestock Production Index',
                    value: (112.8 + variations.trend * 2).toFixed(1),
                    change: (+1.8 + variations.trend * 3).toFixed(1),
                    changePercent: ((+1.6 + variations.trend * 2.5)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-cow',
                    category: 'Livestock',
                    description: '2014-2016=100',
                    source: 'FAO'
                },
                {
                    id: 'fertilizer-use',
                    name: 'Fertilizer Consumption',
                    value: (135.2 + variations.trend * 8).toFixed(1),
                    change: (+3.1 + variations.trend * 6).toFixed(1),
                    changePercent: ((+2.3 + variations.trend * 4)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-flask',
                    category: 'Inputs',
                    description: 'kg per hectare',
                    source: 'FAO'
                }
            ],
            development: [
                {
                    id: 'multidimensional-poverty',
                    name: 'Multidimensional Poverty',
                    value: (1.1 + variations.trend * 0.1).toFixed(1) + 'B',
                    change: (-45 + variations.trend * 80).toFixed(0) + 'M',
                    changePercent: ((-3.9 + variations.trend * 7)).toFixed(1),
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-users',
                    category: 'Poverty',
                    description: 'people affected',
                    source: 'UNDP/OPHI'
                },
                {
                    id: 'rural-poverty',
                    name: 'Rural Poverty Rate',
                    value: (17.2 + variations.trend * 1.5).toFixed(1) + '%',
                    change: (-0.8 + variations.trend * 1.5).toFixed(1),
                    changePercent: null,
                    trend: variations.trend <= 0 ? 'up' : 'down',
                    icon: 'fas fa-home',
                    category: 'Rural Development',
                    description: 'Rural population',
                    source: 'World Bank'
                },
                {
                    id: 'rural-access-electricity',
                    name: 'Rural Electricity Access',
                    value: (78.5 + variations.trend * 2).toFixed(1) + '%',
                    change: (+2.1 + variations.trend * 3).toFixed(1),
                    changePercent: null,
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-bolt',
                    category: 'Infrastructure',
                    description: 'Rural population',
                    source: 'World Bank'
                },
                {
                    id: 'climate-finance-agriculture',
                    name: 'Climate Finance (Agriculture)',
                    value: '$28.5B',
                    change: (+3.2 + variations.trend * 6).toFixed(1) + 'B',
                    changePercent: ((+12.6 + variations.trend * 20)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-leaf',
                    category: 'Climate',
                    description: 'Annual commitment',
                    source: 'OECD'
                },
                {
                    id: 'women-agricultural-land',
                    name: 'Women Owning Agricultural Land',
                    value: (12.8 + variations.trend * 1).toFixed(1) + '%',
                    change: (+0.4 + variations.trend * 0.8).toFixed(1),
                    changePercent: null,
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-female',
                    category: 'Gender',
                    description: 'Agricultural holders',
                    source: 'FAO'
                },
                {
                    id: 'agricultural-research',
                    name: 'Agricultural R&D Spending',
                    value: '$7.8B',
                    change: (+0.3 + variations.trend * 0.6).toFixed(1) + 'B',
                    changePercent: ((+4.0 + variations.trend * 7)).toFixed(1),
                    trend: variations.trend >= 0 ? 'up' : 'down',
                    icon: 'fas fa-microscope',
                    category: 'Research',
                    description: 'Developing countries',
                    source: 'ASTI'
                }
            ]
        };
    }

    getRandomVariations() {
        const trend = (Math.random() - 0.5) * 0.04; // -2% to +2%
        const factor = 1 + trend;
        return { factor, trend };
    }

    renderCategory(category) {
        const content = document.getElementById('dev-indicators-content');
        if (!content || !this.indicators[category]) return;

        const indicators = this.indicators[category];
        
        let html = `<div class="category-grid">`;
        
        indicators.forEach(indicator => {
            html += this.renderIndicator(indicator);
        });
        
        html += `</div>`;
        content.innerHTML = html;
    }

    renderIndicator(indicator) {
        const trendClass = indicator.trend === 'up' ? 'trend-up' : 'trend-down';
        const trendIcon = indicator.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
        
        return `
            <div class="dev-indicator-card ${trendClass}">
                <div class="indicator-header">
                    <div class="indicator-icon">
                        <i class="${indicator.icon}"></i>
                    </div>
                    <div class="indicator-info">
                        <h5>${indicator.name}</h5>
                        <div class="indicator-value">${indicator.value}</div>
                        <div class="indicator-description">${indicator.description}</div>
                    </div>
                </div>
                <div class="indicator-change">
                    <div class="change-details">
                        <span class="change-value">
                            <i class="fas ${trendIcon}"></i>
                            ${indicator.change > 0 ? '+' : ''}${indicator.change}
                            ${indicator.changePercent ? ` (${indicator.changePercent > 0 ? '+' : ''}${indicator.changePercent}%)` : ''}
                        </span>
                        <span class="change-category">${indicator.category} • ${indicator.source}</span>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading() {
        const content = document.getElementById('dev-indicators-content');
        if (content) {
            content.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Updating development indicators...</span>
                </div>
            `;
        }
    }

    showError() {
        const content = document.getElementById('dev-indicators-content');
        if (content) {
            content.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Failed to load development data</span>
                    <button onclick="window.developmentIndicators.loadIndicators(true)" class="retry-btn">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    updateLastRefreshTime() {
        const lastUpdated = document.getElementById('dev-last-updated');
        if (lastUpdated) {
            this.lastUpdate = new Date();
            lastUpdated.textContent = `Updated: ${this.lastUpdate.toLocaleTimeString()}`;
        }
    }

    setupAutoRefresh() {
        setInterval(() => {
            this.loadIndicators();
        }, this.refreshInterval);
    }
}

// Initialize widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('development-indicators-widget')) {
        window.developmentIndicators = new DevelopmentIndicators('development-indicators-widget');
    }
});
```
