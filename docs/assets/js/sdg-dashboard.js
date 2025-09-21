/**
 * SDG Dashboard - Interactive Sustainable Development Goals Tracking
 * Real-time data visualization and country comparison system
 * Created by Patrice Mirindi
 */

class SDGDashboard {
    constructor() {
        this.sdgData = null;
        this.countryData = null;
        this.selectedCountries = [];
        this.charts = new Map();
        this.updateInterval = null;
        this.activeRegion = 'africa';
        
        this.initializeData();
        this.setupEventListeners();
        this.renderSDGGoals();
        this.populateCountrySelectors();
        this.setupRegionalTabs();
        this.startAutoUpdate();
        this.initializeCharts();
    }

    initializeData() {
        // Generate comprehensive SDG data for demonstration
        this.sdgData = this.generateSDGData();
        this.countryData = this.generateCountryData();
        
        // Update last updated time
        this.updateLastUpdatedTime();
    }

    generateSDGData() {
        const goals = [
            { id: 1, name: 'No Poverty', description: 'End poverty in all its forms everywhere', icon: 'fas fa-hand-holding-heart', color: '#e5243b' },
            { id: 2, name: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition', icon: 'fas fa-seedling', color: '#dda63a' },
            { id: 3, name: 'Good Health', description: 'Ensure healthy lives and promote well-being', icon: 'fas fa-heartbeat', color: '#4c9f38' },
            { id: 4, name: 'Quality Education', description: 'Ensure inclusive and equitable quality education', icon: 'fas fa-graduation-cap', color: '#c5192d' },
            { id: 5, name: 'Gender Equality', description: 'Achieve gender equality and empower women and girls', icon: 'fas fa-venus-mars', color: '#ff3a21' },
            { id: 6, name: 'Clean Water', description: 'Ensure availability and sustainable management of water', icon: 'fas fa-tint', color: '#26bde2' },
            { id: 7, name: 'Clean Energy', description: 'Ensure access to affordable, reliable, sustainable energy', icon: 'fas fa-bolt', color: '#fcc30b' },
            { id: 8, name: 'Decent Work', description: 'Promote sustained, inclusive economic growth and employment', icon: 'fas fa-briefcase', color: '#a21942' },
            { id: 9, name: 'Innovation', description: 'Build resilient infrastructure and foster innovation', icon: 'fas fa-industry', color: '#fd6925' },
            { id: 10, name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries', icon: 'fas fa-balance-scale', color: '#dd1367' },
            { id: 11, name: 'Sustainable Cities', description: 'Make cities and settlements inclusive and sustainable', icon: 'fas fa-city', color: '#fd9d24' },
            { id: 12, name: 'Responsible Consumption', description: 'Ensure sustainable consumption and production', icon: 'fas fa-recycle', color: '#bf8b2e' },
            { id: 13, name: 'Climate Action', description: 'Take urgent action to combat climate change', icon: 'fas fa-globe-americas', color: '#3f7e44' },
            { id: 14, name: 'Life Below Water', description: 'Conserve and sustainably use oceans and marine resources', icon: 'fas fa-fish', color: '#0a97d9' },
            { id: 15, name: 'Life on Land', description: 'Protect, restore and promote sustainable use of ecosystems', icon: 'fas fa-tree', color: '#56c02b' },
            { id: 16, name: 'Peace & Justice', description: 'Promote peaceful and inclusive societies', icon: 'fas fa-dove', color: '#00689d' },
            { id: 17, name: 'Partnerships', description: 'Strengthen means of implementation and partnerships', icon: 'fas fa-handshake', color: '#19486a' }
        ];
        
        return goals.map(goal => ({
            ...goal,
            globalScore: this.generateScore(30, 80),
            trend: Math.random() > 0.4 ? 'improving' : 'declining',
            trendValue: (Math.random() * 4 - 2).toFixed(1), // -2 to +2
            countries: this.generateGoalCountryScores(goal.id)
        }));
    }

    generateCountryData() {
        const countries = [
            { code: 'DRC', name: 'Democratic Republic of Congo', region: 'africa', population: 95.9, flag: '🇨🇩' },
            { code: 'RWA', name: 'Rwanda', region: 'africa', population: 13.3, flag: '🇷🇼' },
            { code: 'KEN', name: 'Kenya', region: 'africa', population: 54.9, flag: '🇰🇪' },
            { code: 'TZA', name: 'Tanzania', region: 'africa', population: 61.5, flag: '🇹🇿' },
            { code: 'UGA', name: 'Uganda', region: 'africa', population: 47.1, flag: '🇺🇬' },
            { code: 'ETH', name: 'Ethiopia', region: 'africa', population: 117.9, flag: '🇪🇹' },
            { code: 'GHA', name: 'Ghana', region: 'africa', population: 32.8, flag: '🇬🇭' },
            { code: 'SEN', name: 'Senegal', region: 'africa', population: 17.2, flag: '🇸🇳' },
            { code: 'CAN', name: 'Canada', region: 'americas', population: 38.2, flag: '🇨🇦' },
            { code: 'SWE', name: 'Sweden', region: 'europe', population: 10.4, flag: '🇸🇪' },
            { code: 'NOR', name: 'Norway', region: 'europe', population: 5.4, flag: '🇳🇴' },
            { code: 'DNK', name: 'Denmark', region: 'europe', population: 5.8, flag: '🇩🇰' },
            { code: 'JPN', name: 'Japan', region: 'asia', population: 125.8, flag: '🇯🇵' },
            { code: 'SGP', name: 'Singapore', region: 'asia', population: 5.9, flag: '🇸🇬' },
            { code: 'KOR', name: 'South Korea', region: 'asia', population: 51.8, flag: '🇰🇷' }
        ];
        
        return countries.map(country => ({
            ...country,
            overallScore: this.generateCountryScore(country.code),
            rank: 0, // Will be calculated
            sdgScores: this.sdgData ? this.sdgData.map(goal => 
                goal.countries.find(c => c.code === country.code)?.score || 0
            ) : [],
            trends: this.generateCountryTrends(),
            keyIndicators: this.generateKeyIndicators(country.code)
        }));
    }

    generateScore(min = 0, max = 100) {
        return Math.round((Math.random() * (max - min) + min) * 10) / 10;
    }

    generateCountryScore(countryCode) {
        // Different score ranges based on development level
        const scoreRanges = {
            'DRC': [25, 45],
            'RWA': [45, 65],
            'KEN': [50, 70],
            'TZA': [35, 55],
            'UGA': [40, 60],
            'ETH': [30, 50],
            'GHA': [55, 75],
            'SEN': [50, 70],
            'CAN': [75, 90],
            'SWE': [80, 95],
            'NOR': [80, 95],
            'DNK': [80, 95],
            'JPN': [70, 85],
            'SGP': [75, 90],
            'KOR': [70, 85]
        };
        
        const [min, max] = scoreRanges[countryCode] || [40, 80];
        return this.generateScore(min, max);
    }

    generateGoalCountryScores(goalId) {
        const countries = ['DRC', 'RWA', 'KEN', 'TZA', 'UGA', 'CAN', 'SWE', 'NOR', 'DNK', 'JPN'];
        return countries.map(code => ({
            code,
            score: this.generateCountryScore(code) + (Math.random() * 20 - 10) // Add goal-specific variation
        }));
    }

    generateCountryTrends() {
        return {
            poverty: { value: this.generateScore(5, 80), change: Math.random() * 6 - 3 },
            education: { value: this.generateScore(20, 95), change: Math.random() * 4 - 2 },
            health: { value: this.generateScore(30, 90), change: Math.random() * 3 - 1.5 },
            economy: { value: this.generateScore(25, 85), change: Math.random() * 8 - 4 }
        };
    }

    generateKeyIndicators(countryCode) {
        return {
            gdpPerCapita: this.generateScore(200, 50000),
            lifeExpectancy: this.generateScore(45, 85),
            literacyRate: this.generateScore(30, 99),
            accessToElectricity: this.generateScore(10, 100),
            internetPenetration: this.generateScore(5, 95)
        };
    }

    renderSDGGoals() {
        const goalsGrid = document.getElementById('sdg-goals-grid');
        if (!goalsGrid || !this.sdgData) return;
        
        goalsGrid.innerHTML = '';
        
        this.sdgData.forEach(goal => {
            const goalCard = document.createElement('div');
            goalCard.className = 'sdg-goal';
            goalCard.dataset.goal = goal.id;
            goalCard.style.setProperty('--sdg-color', goal.color);
            goalCard.style.setProperty('--sdg-color-rgb', this.hexToRgb(goal.color));
            
            const trendIcon = goal.trend === 'improving' ? 'fa-arrow-up' : 'fa-arrow-down';
            const trendClass = goal.trend === 'improving' ? 'trend-up' : 'trend-down';
            
            goalCard.innerHTML = `
                <div class="sdg-icon" style="background: ${goal.color}">
                    <i class="${goal.icon}"></i>
                </div>
                <h3>${goal.name}</h3>
                <p class="goal-description">${goal.description}</p>
                <div class="sdg-progress">
                    <div class="sdg-progress-fill" style="width: ${goal.globalScore}%; background: ${goal.color}"></div>
                </div>
                <div class="goal-meta">
                    <div class="sdg-score">${goal.globalScore}</div>
                    <div class="goal-trend ${trendClass}">
                        <i class="fas ${trendIcon}"></i>
                        <span>${goal.trendValue}%</span>
                    </div>
                </div>
            `;
            
            goalCard.addEventListener('click', () => this.showGoalDetails(goal));
            goalsGrid.appendChild(goalCard);
        });
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 255, 255';
    }

    populateCountrySelectors() {
        const selectors = ['country1', 'country2', 'country3'];
        
        selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            if (!selector || !this.countryData) return;
            
            // Clear existing options except the first one
            selector.innerHTML = '<option value="">Select Country</option>';
            
            // Add countries grouped by region
            const regions = {
                'africa': 'Africa',
                'americas': 'Americas', 
                'asia': 'Asia-Pacific',
                'europe': 'Europe'
            };
            
            Object.entries(regions).forEach(([regionCode, regionName]) => {
                const regionCountries = this.countryData.filter(c => c.region === regionCode);
                if (regionCountries.length > 0) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = regionName;
                    
                    regionCountries.forEach(country => {
                        const option = document.createElement('option');
                        option.value = country.code;
                        option.textContent = `${country.flag} ${country.name}`;
                        optgroup.appendChild(option);
                    });
                    
                    selector.appendChild(optgroup);
                }
            });
        });
    }

    setupEventListeners() {
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.compareCountries());
        }
        
        // Trend timeframe selector
        const trendTimeframe = document.getElementById('trend-timeframe');
        if (trendTimeframe) {
            trendTimeframe.addEventListener('change', () => this.updateTrendsChart());
        }
        
        // Heatmap goal selector
        const heatmapGoal = document.getElementById('heatmap-goal');
        if (heatmapGoal) {
            heatmapGoal.addEventListener('change', () => this.updateGlobalHeatmap());
        }
        
        // Correlation refresh button
        const correlationRefresh = document.getElementById('correlation-refresh');
        if (correlationRefresh) {
            correlationRefresh.addEventListener('click', () => this.updateCorrelationChart());
        }
    }

    setupRegionalTabs() {
        const tabs = document.querySelectorAll('.region-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                // Update active region
                this.activeRegion = tab.dataset.region;
                // Update regional content
                this.updateRegionalContent();
            });
        });
    }

    compareCountries() {
        const country1 = document.getElementById('country1').value;
        const country2 = document.getElementById('country2').value;
        const country3 = document.getElementById('country3').value;
        
        const selectedCountries = [country1, country2, country3].filter(c => c);
        
        if (selectedCountries.length < 2) {
            this.showNotification('Please select at least 2 countries to compare.', 'warning');
            return;
        }
        
        this.selectedCountries = selectedCountries;
        this.renderCountryComparison();
    }

    renderCountryComparison() {
        const cardsContainer = document.getElementById('country-cards');
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = '';
        
        this.selectedCountries.forEach(countryCode => {
            const country = this.countryData.find(c => c.code === countryCode);
            if (!country) return;
            
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card futuristic-card';
            countryCard.dataset.country = countryCode.toLowerCase();
            
            countryCard.innerHTML = `
                <div class="country-header">
                    <div class="country-flag">${country.flag}</div>
                    <div class="country-info">
                        <h4>${country.name}</h4>
                        <p>Population: ${country.population}M</p>
                    </div>
                    <div class="country-score">${country.overallScore}</div>
                </div>
                
                <div class="country-details">
                    <div class="country-indicators">
                        <div class="indicator">
                            <span class="indicator-label">GDP per capita</span>
                            <span class="indicator-value">$${country.keyIndicators.gdpPerCapita.toLocaleString()}</span>
                        </div>
                        <div class="indicator">
                            <span class="indicator-label">Life Expectancy</span>
                            <span class="indicator-value">${country.keyIndicators.lifeExpectancy} years</span>
                        </div>
                        <div class="indicator">
                            <span class="indicator-label">Literacy Rate</span>
                            <span class="indicator-value">${country.keyIndicators.literacyRate}%</span>
                        </div>
                    </div>
                    
                    <div class="sdg-mini-goals">
                        ${this.renderMiniGoals(country.sdgScores)}
                    </div>
                </div>
                
                <div class="country-actions">
                    <button class="btn btn-futuristic btn-secondary" onclick="window.sdgDashboard.showCountryDetails('${countryCode}')">
                        <i class="fas fa-chart-pie"></i> View Details
                    </button>
                </div>
            `;
            
            cardsContainer.appendChild(countryCard);
        });
        
        // Update comparison chart
        this.createComparisonChart();
    }

    renderMiniGoals(scores) {
        if (!scores || scores.length === 0) return '';
        
        return scores.map((score, index) => {
            const goal = this.sdgData[index];
            if (!goal) return '';
            
            return `
                <div class="mini-goal" 
                     style="background: ${goal.color}" 
                     data-score="${Math.round(score)}"
                     title="${goal.name}: ${Math.round(score)}">
                    ${goal.id}
                </div>
            `;
        }).join('');
    }

    createComparisonChart() {
        if (this.selectedCountries.length === 0) return;
        
        setTimeout(() => {
            const chartContainer = document.getElementById('regional-comparison-chart');
            if (!chartContainer) return;
            
            const traces = this.selectedCountries.map(countryCode => {
                const country = this.countryData.find(c => c.code === countryCode);
                if (!country) return null;
                
                const goalNames = this.sdgData.map(g => g.name);
                
                return {
                    r: country.sdgScores,
                    theta: goalNames,
                    fill: 'toself',
                    type: 'scatterpolar',
                    name: country.name,
                    line: { width: 2 },
                    fillcolor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`
                };
            }).filter(trace => trace !== null);
            
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
                    text: 'Country SDG Comparison',
                    font: { color: '#ffffff' }
                },
                showlegend: true,
                legend: {
                    font: { color: '#ffffff' }
                }
            };
            
            const config = { responsive: true, displayModeBar: false };
            Plotly.newPlot(chartContainer, traces, layout, config);
        }, 100);
    }

    initializeCharts() {
        // Initialize all dashboard charts
        setTimeout(() => {
            this.updateTrendsChart();
            this.updateCorrelationChart();
            this.updateGlobalHeatmap();
            this.updateRegionalContent();
        }, 500);
    }

    updateTrendsChart() {
        const chartContainer = document.getElementById('trends-chart');
        if (!chartContainer) return;
        
        const timeframe = parseInt(document.getElementById('trend-timeframe')?.value || '15');
        const years = Array.from({length: timeframe}, (_, i) => 2024 - timeframe + i + 1);
        
        const traces = [
            {
                x: years,
                y: years.map(() => this.generateScore(40, 80)),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Global SDG Progress',
                line: { color: '#00ffff', width: 3 }
            },
            {
                x: years,
                y: years.map(() => this.generateScore(20, 60)),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Sub-Saharan Africa',
                line: { color: '#ff3a21', width: 3 }
            },
            {
                x: years,
                y: years.map(() => this.generateScore(60, 90)),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'High-Income Countries',
                line: { color: '#4c9f38', width: 3 }
            }
        ];
        
        const layout = {
            title: false,
            xaxis: { title: 'Year', color: '#ffffff' },
            yaxis: { title: 'SDG Index Score', color: '#ffffff' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' },
            showlegend: true,
            legend: { font: { color: '#ffffff' } }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(chartContainer, traces, layout, config);
    }

    updateCorrelationChart() {
        const chartContainer = document.getElementById('correlation-chart');
        if (!chartContainer) return;
        
        const goals = this.sdgData.slice(0, 10); // Use first 10 goals for visibility
        const correlationMatrix = this.generateCorrelationMatrix(goals);
        
        const trace = {
            z: correlationMatrix,
            x: goals.map(g => g.name),
            y: goals.map(g => g.name),
            type: 'heatmap',
            colorscale: [
                [0, '#ff3a21'],
                [0.5, '#ffffff'],
                [1, '#4c9f38']
            ],
            zmid: 0,
            colorbar: {
                title: 'Correlation',
                titlefont: { color: '#ffffff' },
                tickfont: { color: '#ffffff' }
            }
        };
        
        const layout = {
            title: false,
            xaxis: { 
                tickangle: -45, 
                color: '#ffffff',
                tickfont: { size: 10 }
            },
            yaxis: { 
                color: '#ffffff',
                tickfont: { size: 10 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' },
            margin: { t: 10, r: 10, b: 100, l: 100 }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(chartContainer, [trace], layout, config);
    }

    updateGlobalHeatmap() {
        const chartContainer = document.getElementById('global-heatmap');
        if (!chartContainer) return;
        
        const selectedGoal = document.getElementById('heatmap-goal')?.value || 'overall';
        
        // Generate sample world map data
        const countries = this.countryData.map(country => ({
            type: 'choropleth',
            locations: [country.code],
            z: [selectedGoal === 'overall' ? country.overallScore : 
                (country.sdgScores[parseInt(selectedGoal) - 1] || country.overallScore)],
            text: [country.name],
            colorscale: [
                [0, '#ff3a21'],
                [0.5, '#fcc30b'],
                [1, '#4c9f38']
            ],
            colorbar: {
                title: selectedGoal === 'overall' ? 'Overall Score' : `SDG ${selectedGoal} Score`,
                titlefont: { color: '#ffffff' },
                tickfont: { color: '#ffffff' }
            }
        }));
        
        // Combine all country data
        const trace = {
            type: 'choropleth',
            locations: this.countryData.map(c => c.code),
            z: this.countryData.map(country => 
                selectedGoal === 'overall' ? country.overallScore : 
                (country.sdgScores[parseInt(selectedGoal) - 1] || country.overallScore)
            ),
            text: this.countryData.map(c => c.name),
            colorscale: [
                [0, '#ff3a21'],
                [0.5, '#fcc30b'],
                [1, '#4c9f38']
            ],
            colorbar: {
                title: selectedGoal === 'overall' ? 'Overall Score' : `SDG ${selectedGoal} Score`,
                titlefont: { color: '#ffffff' },
                tickfont: { color: '#ffffff' }
            }
        };
        
        const layout = {
            title: false,
            geo: {
                showframe: false,
                showcoastlines: true,
                projection: { type: 'natural earth' },
                bgcolor: 'rgba(0,0,0,0)'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(chartContainer, [trace], layout, config);
    }

    updateRegionalContent() {
        const regionData = {
            africa: {
                countries: 54,
                avgScore: 52.3,
                topPerformer: 'Mauritius',
                progress: '+2.1'
            },
            asia: {
                countries: 49,
                avgScore: 65.8,
                topPerformer: 'Singapore',
                progress: '+3.2'
            },
            europe: {
                countries: 47,
                avgScore: 78.9,
                topPerformer: 'Denmark',
                progress: '+1.8'
            },
            americas: {
                countries: 35,
                avgScore: 68.4,
                topPerformer: 'Canada',
                progress: '+2.5'
            },
            mena: {
                countries: 19,
                avgScore: 58.7,
                topPerformer: 'UAE',
                progress: '+1.9'
            }
        };
        
        const data = regionData[this.activeRegion] || regionData.africa;
        
        // Update regional statistics
        document.getElementById('region-countries').textContent = data.countries;
        document.getElementById('region-avg-score').textContent = data.avgScore;
        document.getElementById('region-top-performer').textContent = data.topPerformer;
        document.getElementById('region-progress').textContent = data.progress;
        
        // Update regional chart would go here
        this.updateRegionalChart();
    }

    updateRegionalChart() {
        // This would create region-specific visualizations
        // For now, we'll reuse the comparison chart
        if (this.activeRegion === 'africa') {
            const africanCountries = ['DRC', 'RWA', 'KEN', 'TZA', 'UGA'];
            this.selectedCountries = africanCountries;
            this.createComparisonChart();
        }
    }

    generateCorrelationMatrix(goals) {
        const matrix = [];
        
        goals.forEach((goal1, i) => {
            matrix[i] = [];
            goals.forEach((goal2, j) => {
                if (i === j) {
                    matrix[i][j] = 1;
                } else {
                    // Generate realistic correlation (some goals are naturally correlated)
                    let correlation = Math.random() * 2 - 1; // -1 to 1
                    
                    // Add some realistic correlations
                    if ((goal1.id === 1 && goal2.id === 2) || // Poverty & Hunger
                        (goal1.id === 3 && goal2.id === 4) || // Health & Education
                        (goal1.id === 13 && goal2.id === 15)) { // Climate & Land
                        correlation = Math.abs(correlation) * 0.7 + 0.3; // Positive correlation
                    }
                    
                    matrix[i][j] = correlation;
                }
            });
        });
        
        return matrix;
    }

    showGoalDetails(goal) {
        // Create modal or detailed view for specific SDG goal
        const modal = document.createElement('div');
        modal.className = 'goal-modal futuristic-card';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="goal-icon" style="background: ${goal.color}">
                        <i class="${goal.icon}"></i>
                    </div>
                    <div class="goal-info">
                        <h3>SDG ${goal.id}: ${goal.name}</h3>
                        <p>${goal.description}</p>
                    </div>
                    <button class="modal-close" onclick="this.closest('.goal-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="goal-stats">
                        <div class="stat">
                            <span class="stat-value">${goal.globalScore}</span>
                            <span class="stat-label">Global Score</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${goal.trendValue}%</span>
                            <span class="stat-label">Annual Change</span>
                        </div>
                    </div>
                    
                    <div class="goal-chart" id="goal-chart-${goal.id}"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Create goal-specific chart
        setTimeout(() => {
            this.createGoalChart(goal);
        }, 100);
    }

    showCountryDetails(countryCode) {
        const country = this.countryData.find(c => c.code === countryCode);
        if (!country) return;
        
        // This would open a detailed country view
        console.log('Show details for:', country.name);
        // Implementation would create detailed country dashboard
    }

    createGoalChart(goal) {
        const chartContainer = document.getElementById(`goal-chart-${goal.id}`);
        if (!chartContainer) return;
        
        const trace = {
            x: goal.countries.map(c => c.code),
            y: goal.countries.map(c => c.score),
            type: 'bar',
            marker: {
                color: goal.color,
                line: { color: 'rgba(255,255,255,0.8)', width: 1 }
            }
        };
        
        const layout = {
            title: `${goal.name} - Country Scores`,
            xaxis: { title: 'Countries', color: '#ffffff' },
            yaxis: { title: 'Score', color: '#ffffff' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        const config = { responsive: true, displayModeBar: false };
        Plotly.newPlot(chartContainer, [trace], layout, config);
    }

    updateLastUpdatedTime() {
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate) {
            lastUpdate.textContent = new Date().toLocaleTimeString();
        }
    }

    startAutoUpdate() {
        // Update data every 5 minutes for demo purposes
        this.updateInterval = setInterval(() => {
            this.updateLastUpdatedTime();
            // In a real implementation, this would fetch new data
            console.log('Data auto-updated');
        }, 300000); // 5 minutes
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.closest('.notification').remove()">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(26, 26, 26, 0.95);
            border: 1px solid var(--neon-cyan);
            border-radius: 10px;
            padding: 15px 20px;
            color: var(--dark-text);
            z-index: 10001;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.charts.clear();
    }
}

// Initialize SDG Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sdgDashboard = new SDGDashboard();
});

// Additional CSS for modal and notifications
const additionalStyles = `
<style>
.goal-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid var(--neon-cyan);
    border-radius: 15px;
    padding: 0;
    z-index: 10001;
    overflow: hidden;
}

.modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;
    border-bottom: 1px solid var(--dark-border);
    background: rgba(0, 255, 255, 0.05);
}

.modal-header .goal-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: var(--dark-bg);
}

.goal-info h3 {
    color: var(--dark-text);
    margin: 0 0 10px 0;
    font-family: var(--font-futuristic);
}

.goal-info p {
    color: var(--dark-text-secondary);
    margin: 0;
}

.modal-close {
    margin-left: auto;
    width: 40px;
    height: 40px;
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

.modal-close:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
}

.modal-body {
    flex: 1;
    padding: 25px;
    overflow-y: auto;
}

.goal-stats {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    justify-content: center;
}

.goal-stats .stat {
    text-align: center;
}

.goal-stats .stat-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: var(--neon-cyan);
    font-family: var(--font-futuristic);
    text-shadow: 0 0 10px var(--neon-cyan);
}

.goal-stats .stat-label {
    display: block;
    font-size: 12px;
    color: var(--dark-text-secondary);
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.goal-chart {
    height: 300px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 1px solid var(--dark-border);
}

.trend-up {
    color: var(--neon-green);
}

.trend-down {
    color: #ff3a21;
}

.goal-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.goal-trend {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
}

.status-banner {
    background: rgba(26, 26, 26, 0.8);
    border-radius: 15px;
    padding: 20px 30px;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.status-info {
    display: flex;
    gap: 30px;
    align-items: center;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--neon-green);
    font-weight: 600;
}

.last-updated {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--dark-text-secondary);
    font-size: 14px;
}

.global-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.progress-label {
    color: var(--dark-text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.progress-circle {
    position: relative;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--neon-green);
    font-family: var(--font-futuristic);
    font-weight: 700;
    font-size: 18px;
    text-shadow: 0 0 10px var(--neon-green);
}

.analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 40px;
}

.analytics-card {
    background: rgba(26, 26, 26, 0.8);
    border-radius: 15px;
    padding: 25px;
    border: 1px solid var(--dark-border);
}

.analytics-card.full-width {
    grid-column: span 2;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--dark-border);
}

.card-header h3 {
    color: var(--dark-text);
    font-family: var(--font-futuristic);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-controls {
    display: flex;
    gap: 10px;
}

.chart-container {
    height: 300px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 1px solid var(--dark-border);
}

.region-tabs {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-bottom: 40px;
    background: rgba(26, 26, 26, 0.6);
    padding: 5px;
    border-radius: 25px;
    border: 1px solid var(--dark-border);
}

.region-tab {
    background: transparent;
    border: none;
    color: var(--dark-text-secondary);
    padding: 12px 25px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 14px;
}

.region-tab:hover,
.region-tab.active {
    background: var(--neon-cyan);
    color: var(--dark-bg);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.region-content {
    background: rgba(26, 26, 26, 0.6);
    border-radius: 15px;
    padding: 30px;
    border: 1px solid var(--dark-border);
}

.region-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.region-chart {
    height: 400px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 1px solid var(--dark-border);
}

.country-details {
    margin: 20px 0;
}

.country-indicators {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.indicator {
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid var(--dark-border);
    text-align: center;
}

.indicator-label {
    display: block;
    font-size: 11px;
    color: var(--dark-text-muted);
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.indicator-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--neon-cyan);
    font-family: var(--font-futuristic);
}

.country-actions {
    margin-top: 20px;
    text-align: center;
}

@media (max-width: 768px) {
    .analytics-grid {
        grid-template-columns: 1fr;
    }
    
    .analytics-card.full-width {
        grid-column: span 1;
    }
    
    .region-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .country-indicators {
        grid-template-columns: 1fr;
    }
    
    .goal-modal {
        width: 95%;
        max-height: 90vh;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);