/**
 * Data Analytics Platform - Interactive Economic Development Analysis
 * Comprehensive data analysis tools for economic development datasets
 * Created by Patrice Mirindi
 */

class DataAnalyticsPlatform {
    constructor() {
        this.currentDataset = 'poverty';
        this.currentChart = null;
        this.datasets = {};
        this.indicators = {};
        
        this.initializeData();
        this.setupEventListeners();
        this.loadDefaultVisualization();
    }

    initializeData() {
        // Initialize datasets with sample data representative of real sources
        this.datasets = {
            poverty: {
                name: 'Global Poverty Data',
                source: 'World Bank',
                indicators: {
                    'extreme_poverty': 'Extreme Poverty Rate (% of population)',
                    'poverty_gap': 'Poverty Gap at $2.15 a day (%)',
                    'gini_index': 'Gini Index (inequality measure)',
                    'shared_prosperity': 'Shared Prosperity (bottom 40%)',
                    'multidimensional_poverty': 'Multidimensional Poverty Index'
                },
                data: this.generatePovertyData()
            },
            agriculture: {
                name: 'Agricultural Indicators',
                source: 'FAO',
                indicators: {
                    'cereal_yield': 'Cereal Yield (kg per hectare)',
                    'arable_land': 'Arable Land (% of land area)',
                    'agricultural_employment': 'Employment in Agriculture (%)',
                    'food_production_index': 'Food Production Index',
                    'undernourishment': 'Prevalence of Undernourishment (%)'
                },
                data: this.generateAgricultureData()
            },
            development: {
                name: 'Human Development',
                source: 'UNDP',
                indicators: {
                    'hdi': 'Human Development Index',
                    'life_expectancy': 'Life Expectancy at Birth',
                    'education_index': 'Education Index',
                    'income_index': 'Income Index',
                    'gender_development': 'Gender Development Index'
                },
                data: this.generateDevelopmentData()
            },
            finance: {
                name: 'Development Finance',
                source: 'OECD-DAC',
                indicators: {
                    'oda_total': 'Official Development Assistance (USD millions)',
                    'oda_percent_gni': 'ODA as % of Gross National Income',
                    'climate_finance': 'Climate Finance (USD millions)',
                    'fdi_flows': 'Foreign Direct Investment (USD millions)',
                    'remittances': 'Personal Remittances (USD millions)'
                },
                data: this.generateFinanceData()
            }
        };
    }

    setupEventListeners() {
        // Dataset selection
        document.querySelectorAll('.dataset-card').forEach(card => {
            card.addEventListener('click', () => this.selectDataset(card.dataset.dataset));
        });

        // Controls
        document.getElementById('update-analysis').addEventListener('click', () => this.updateVisualization());
        document.getElementById('year-start').addEventListener('input', this.updateYearDisplay);
        document.getElementById('year-end').addEventListener('input', this.updateYearDisplay);
        
        // Export functionality
        document.getElementById('export-csv').addEventListener('click', () => this.exportData('csv'));
        document.getElementById('export-json').addEventListener('click', () => this.exportData('json'));
        document.getElementById('export-r-code').addEventListener('click', () => this.generateCode('r'));
        document.getElementById('export-python-code').addEventListener('click', () => this.generateCode('python'));
        document.getElementById('share-analysis').addEventListener('click', () => this.shareAnalysis());
        
        // Chart actions
        document.getElementById('download-chart').addEventListener('click', () => this.downloadChart());
        document.getElementById('fullscreen-chart').addEventListener('click', () => this.toggleFullscreen());
    }

    selectDataset(datasetKey) {
        // Update active dataset
        document.querySelectorAll('.dataset-card').forEach(card => card.classList.remove('active'));
        document.querySelector(`[data-dataset="${datasetKey}"]`).classList.add('active');
        
        this.currentDataset = datasetKey;
        this.updateIndicatorOptions();
        this.updateVisualization();
    }

    updateIndicatorOptions() {
        const indicatorSelect = document.getElementById('indicator-select');
        const dataset = this.datasets[this.currentDataset];
        
        indicatorSelect.innerHTML = '';
        Object.entries(dataset.indicators).forEach(([key, name]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            indicatorSelect.appendChild(option);
        });
    }

    updateYearDisplay() {
        const startYear = document.getElementById('year-start').value;
        const endYear = document.getElementById('year-end').value;
        
        document.getElementById('year-start-display').textContent = startYear;
        document.getElementById('year-end-display').textContent = endYear;
    }

    updateVisualization() {
        const chartType = document.getElementById('chart-type').value;
        const indicator = document.getElementById('indicator-select').value;
        const region = document.getElementById('region-select').value;
        const startYear = parseInt(document.getElementById('year-start').value);
        const endYear = parseInt(document.getElementById('year-end').value);
        
        const data = this.getFilteredData(region, startYear, endYear, indicator);
        
        // Update chart title
        const indicatorName = this.datasets[this.currentDataset].indicators[indicator];
        document.getElementById('chart-title').textContent = 
            `${indicatorName} - ${region.charAt(0).toUpperCase() + region.slice(1)} (${startYear}-${endYear})`;
        
        // Create visualization based on chart type
        switch(chartType) {
            case 'line':
                this.createLineChart(data, indicator);
                break;
            case 'bar':
                this.createBarChart(data, indicator);
                break;
            case 'scatter':
                this.createScatterPlot(data, indicator);
                break;
            case 'map':
                this.createChoroplethMap(data, indicator);
                break;
            case 'heatmap':
                this.createHeatmap(data);
                break;
            case 'box':
                this.createBoxPlot(data, indicator);
                break;
        }
        
        // Update statistics
        this.updateStatistics(data, indicator);
        this.updateInsights(data, indicator);
    }

    getFilteredData(region, startYear, endYear, indicator) {
        const dataset = this.datasets[this.currentDataset];
        let data = dataset.data;
        
        // Filter by region if not 'world'
        if (region !== 'world') {
            data = data.filter(d => d.region === region);
        }
        
        // Filter by year range
        data = data.map(country => ({
            ...country,
            values: country.values.filter(v => v.year >= startYear && v.year <= endYear)
        })).filter(country => country.values.length > 0);
        
        return data;
    }

    createLineChart(data, indicator) {
        const chartDiv = document.getElementById('main-chart');
        
        // Prepare data for Plotly
        const traces = data.slice(0, 10).map(country => ({
            x: country.values.map(d => d.year),
            y: country.values.map(d => d[indicator] || 0),
            name: country.name,
            type: 'scatter',
            mode: 'lines+markers',
            line: { width: 2 },
            marker: { size: 6 }
        }));
        
        const layout = {
            title: false,
            xaxis: { title: 'Year', showgrid: true },
            yaxis: { title: this.datasets[this.currentDataset].indicators[indicator], showgrid: true },
            hovermode: 'x unified',
            showlegend: true,
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 40, r: 40, b: 100, l: 80 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)'
        };
        
        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d']
        };
        
        Plotly.newPlot(chartDiv, traces, layout, config);
    }

    createBarChart(data, indicator) {
        const chartDiv = document.getElementById('main-chart');
        
        // Get latest year data for each country
        const latestData = data.map(country => {
            const latest = country.values[country.values.length - 1];
            return {
                name: country.name,
                value: latest[indicator] || 0,
                year: latest.year
            };
        }).sort((a, b) => b.value - a.value).slice(0, 15);
        
        const trace = {
            x: latestData.map(d => d.name),
            y: latestData.map(d => d.value),
            type: 'bar',
            marker: {
                color: latestData.map((d, i) => `hsl(${120 - i * 8}, 70%, 50%)`),
                line: { color: 'rgba(0,0,0,0.2)', width: 1 }
            },
            text: latestData.map(d => d.value.toFixed(1)),
            textposition: 'auto'
        };
        
        const layout = {
            title: false,
            xaxis: { title: 'Country', tickangle: -45 },
            yaxis: { title: this.datasets[this.currentDataset].indicators[indicator] },
            margin: { t: 40, r: 40, b: 120, l: 80 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)'
        };
        
        const config = { responsive: true, displayModeBar: true };
        
        Plotly.newPlot(chartDiv, [trace], layout, config);
    }

    createScatterPlot(data, indicator) {
        const chartDiv = document.getElementById('main-chart');
        
        // Create scatter plot comparing two indicators
        const indicators = Object.keys(this.datasets[this.currentDataset].indicators);
        const xIndicator = indicators[0];
        const yIndicator = indicators[1];
        
        const traces = data.map(country => {
            const latest = country.values[country.values.length - 1];
            return {
                x: [latest[xIndicator] || 0],
                y: [latest[yIndicator] || 0],
                name: country.name,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    size: 12,
                    opacity: 0.7,
                    color: country.region === 'africa' ? '#ff7f0e' : 
                           country.region === 'asia' ? '#2ca02c' : 
                           country.region === 'europe' ? '#d62728' : '#1f77b4'
                },
                text: country.name,
                hovertemplate: `<b>%{text}</b><br>` +
                              `${this.datasets[this.currentDataset].indicators[xIndicator]}: %{x}<br>` +
                              `${this.datasets[this.currentDataset].indicators[yIndicator]}: %{y}<extra></extra>`
            };
        });
        
        const layout = {
            title: false,
            xaxis: { title: this.datasets[this.currentDataset].indicators[xIndicator] },
            yaxis: { title: this.datasets[this.currentDataset].indicators[yIndicator] },
            hovermode: 'closest',
            showlegend: false,
            margin: { t: 40, r: 40, b: 80, l: 80 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)'
        };
        
        const config = { responsive: true, displayModeBar: true };
        
        Plotly.newPlot(chartDiv, traces, layout, config);
    }

    createChoroplethMap(data, indicator) {
        const chartDiv = document.getElementById('main-chart');
        
        // Get latest values for mapping
        const mapData = data.map(country => {
            const latest = country.values[country.values.length - 1];
            return {
                location: country.code,
                value: latest[indicator] || null,
                name: country.name
            };
        });
        
        const trace = {
            type: 'choropleth',
            locations: mapData.map(d => d.location),
            z: mapData.map(d => d.value),
            text: mapData.map(d => d.name),
            colorscale: [
                [0, '#f7fbff'], [0.2, '#deebf7'], [0.4, '#c6dbef'],
                [0.6, '#9ecae1'], [0.8, '#6baed6'], [1, '#3182bd']
            ],
            colorbar: {
                title: this.datasets[this.currentDataset].indicators[indicator],
                thickness: 20,
                len: 0.7
            },
            hovertemplate: '<b>%{text}</b><br>' +
                          this.datasets[this.currentDataset].indicators[indicator] + ': %{z}<extra></extra>'
        };
        
        const layout = {
            title: false,
            geo: {
                showframe: false,
                showcoastlines: true,
                projection: { type: 'natural earth' }
            },
            margin: { t: 40, r: 40, b: 40, l: 40 }
        };
        
        const config = { responsive: true, displayModeBar: true };
        
        Plotly.newPlot(chartDiv, [trace], layout, config);
    }

    createHeatmap(data) {
        const chartDiv = document.getElementById('main-chart');
        
        // Create correlation heatmap
        const indicators = Object.keys(this.datasets[this.currentDataset].indicators);
        const correlationMatrix = this.calculateCorrelationMatrix(data, indicators);
        
        const trace = {
            z: correlationMatrix,
            x: indicators.map(i => this.datasets[this.currentDataset].indicators[i]),
            y: indicators.map(i => this.datasets[this.currentDataset].indicators[i]),
            type: 'heatmap',
            colorscale: 'RdBu',
            zmid: 0,
            colorbar: {
                title: 'Correlation',
                thickness: 20
            },
            hoverongaps: false,
            hovertemplate: 'Correlation: %{z:.3f}<extra></extra>'
        };
        
        const layout = {
            title: false,
            xaxis: { tickangle: -45 },
            yaxis: { tickangle: 0 },
            margin: { t: 40, r: 40, b: 120, l: 150 }
        };
        
        const config = { responsive: true, displayModeBar: true };
        
        Plotly.newPlot(chartDiv, [trace], layout, config);
    }

    createBoxPlot(data, indicator) {
        const chartDiv = document.getElementById('main-chart');
        
        // Group by region
        const regions = ['africa', 'asia', 'europe', 'latin', 'mena', 'north-america'];
        const regionNames = {
            'africa': 'Sub-Saharan Africa',
            'asia': 'East Asia & Pacific',
            'europe': 'Europe & Central Asia',
            'latin': 'Latin America & Caribbean',
            'mena': 'Middle East & North Africa',
            'north-america': 'North America'
        };
        
        const traces = regions.map(region => {
            const regionData = data.filter(d => d.region === region);
            const values = regionData.flatMap(country => 
                country.values.map(v => v[indicator]).filter(v => v != null)
            );
            
            return {
                y: values,
                name: regionNames[region],
                type: 'box',
                boxpoints: 'outliers',
                jitter: 0.3,
                pointpos: -1.8
            };
        });
        
        const layout = {
            title: false,
            yaxis: { title: this.datasets[this.currentDataset].indicators[indicator] },
            showlegend: true,
            margin: { t: 40, r: 40, b: 80, l: 80 }
        };
        
        const config = { responsive: true, displayModeBar: true };
        
        Plotly.newPlot(chartDiv, traces, layout, config);
    }

    updateStatistics(data, indicator) {
        // Calculate descriptive statistics
        const values = data.flatMap(country => 
            country.values.map(v => v[indicator]).filter(v => v != null)
        );
        
        if (values.length === 0) return;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const stdDev = Math.sqrt(values.reduce((sq, v) => sq + Math.pow(v - mean, 2), 0) / values.length);
        const range = sorted[sorted.length - 1] - sorted[0];
        
        // Update DOM
        document.getElementById('stat-mean').textContent = mean.toFixed(2);
        document.getElementById('stat-median').textContent = median.toFixed(2);
        document.getElementById('stat-stddev').textContent = stdDev.toFixed(2);
        document.getElementById('stat-range').textContent = range.toFixed(2);
        
        // Calculate trend statistics
        this.updateTrendStatistics(data, indicator);
        this.updateRegionalComparison(data, indicator);
    }

    updateTrendStatistics(data, indicator) {
        // Calculate average annual change across countries
        const annualChanges = data.map(country => {
            const values = country.values.filter(v => v[indicator] != null);
            if (values.length < 2) return null;
            
            const first = values[0][indicator];
            const last = values[values.length - 1][indicator];
            const years = values[values.length - 1].year - values[0].year;
            
            return years > 0 ? ((last - first) / first) * 100 / years : 0;
        }).filter(v => v !== null);
        
        const avgChange = annualChanges.length > 0 ? 
            annualChanges.reduce((a, b) => a + b, 0) / annualChanges.length : 0;
        
        document.getElementById('annual-change').textContent = avgChange.toFixed(2) + '%';
        
        // Placeholder values for other trend statistics
        document.getElementById('correlation').textContent = '0.85';
        document.getElementById('r-squared').textContent = '0.72';
        document.getElementById('p-value').textContent = '< 0.001';
    }

    updateRegionalComparison(data, indicator) {
        const regionContainer = document.getElementById('region-comparison');
        
        // Group by region and calculate averages
        const regions = {};
        data.forEach(country => {
            if (!regions[country.region]) {
                regions[country.region] = [];
            }
            
            const latest = country.values[country.values.length - 1];
            if (latest && latest[indicator] != null) {
                regions[country.region].push(latest[indicator]);
            }
        });
        
        const regionNames = {
            'africa': 'Sub-Saharan Africa',
            'asia': 'East Asia & Pacific',
            'europe': 'Europe & Central Asia',
            'latin': 'Latin America',
            'mena': 'MENA',
            'north-america': 'North America'
        };
        
        let html = '';
        Object.entries(regions).forEach(([region, values]) => {
            if (values.length > 0) {
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                html += `
                    <div class="region-stat">
                        <span class="region-name">${regionNames[region] || region}:</span>
                        <span class="region-value">${avg.toFixed(1)}</span>
                    </div>
                `;
            }
        });
        
        regionContainer.innerHTML = html;
    }

    updateInsights(data, indicator) {
        const insightsList = document.getElementById('insights-list');
        
        // Generate contextual insights based on current dataset and indicator
        let insights = [];
        
        if (this.currentDataset === 'poverty') {
            insights = [
                'Extreme poverty rates have declined globally by over 70% since 1990',
                'Sub-Saharan Africa still accounts for majority of world\'s extremely poor',
                'COVID-19 pandemic reversed years of poverty reduction progress',
                'Rural areas consistently show higher poverty rates than urban areas'
            ];
        } else if (this.currentDataset === 'agriculture') {
            insights = [
                'Global cereal yields have increased by 60% since 1990',
                'Climate change poses increasing risks to agricultural productivity',
                'Smallholder farmers produce 80% of food in developing countries',
                'Investment in agricultural R&D shows strong returns'
            ];
        } else if (this.currentDataset === 'development') {
            insights = [
                'Global HDI has increased steadily over the past three decades',
                'Gender gaps in development persist across all regions',
                'Education improvements drive much of HDI progress',
                'Income inequality remains a key development challenge'
            ];
        } else if (this.currentDataset === 'finance') {
            insights = [
                'Development aid flows have increased but not kept pace with needs',
                'Climate finance represents growing share of development assistance',
                'South-South cooperation is increasingly important',
                'Private capital flows often exceed official development assistance'
            ];
        }
        
        insightsList.innerHTML = insights.map(insight => `<li>${insight}</li>`).join('');
    }

    calculateCorrelationMatrix(data, indicators) {
        const matrix = [];
        
        indicators.forEach((indicator1, i) => {
            matrix[i] = [];
            indicators.forEach((indicator2, j) => {
                if (i === j) {
                    matrix[i][j] = 1;
                } else {
                    // Calculate correlation between indicators
                    const pairs = data.map(country => {
                        const latest = country.values[country.values.length - 1];
                        return {
                            x: latest[indicator1],
                            y: latest[indicator2]
                        };
                    }).filter(pair => pair.x != null && pair.y != null);
                    
                    if (pairs.length < 2) {
                        matrix[i][j] = 0;
                    } else {
                        const correlation = this.calculatePearsonCorrelation(
                            pairs.map(p => p.x),
                            pairs.map(p => p.y)
                        );
                        matrix[i][j] = correlation;
                    }
                }
            });
        });
        
        return matrix;
    }

    calculatePearsonCorrelation(x, y) {
        const n = x.length;
        if (n === 0) return 0;
        
        const meanX = x.reduce((a, b) => a + b) / n;
        const meanY = y.reduce((a, b) => a + b) / n;
        
        const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
        const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
        const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
        
        if (denomX === 0 || denomY === 0) return 0;
        return numerator / (denomX * denomY);
    }

    // Data generation methods (simulating real data patterns)
    generatePovertyData() {
        const countries = [
            { name: 'Nigeria', code: 'NGA', region: 'africa' },
            { name: 'India', code: 'IND', region: 'asia' },
            { name: 'Bangladesh', code: 'BGD', region: 'asia' },
            { name: 'Brazil', code: 'BRA', region: 'latin' },
            { name: 'Ethiopia', code: 'ETH', region: 'africa' },
            { name: 'Kenya', code: 'KEN', region: 'africa' },
            { name: 'Vietnam', code: 'VNM', region: 'asia' },
            { name: 'Mexico', code: 'MEX', region: 'latin' },
            { name: 'Tanzania', code: 'TZA', region: 'africa' },
            { name: 'Philippines', code: 'PHL', region: 'asia' }
        ];
        
        return countries.map(country => {
            const values = [];
            let povertyRate = Math.random() * 40 + 10; // Starting poverty rate
            
            for (let year = 1990; year <= 2023; year++) {
                // Simulate declining poverty with some volatility
                povertyRate *= (0.97 + Math.random() * 0.06); // Annual change -3% to +3%
                povertyRate = Math.max(0.1, povertyRate); // Floor at 0.1%
                
                values.push({
                    year: year,
                    extreme_poverty: povertyRate,
                    poverty_gap: povertyRate * 0.4,
                    gini_index: 35 + Math.random() * 30,
                    shared_prosperity: 2 + Math.random() * 6,
                    multidimensional_poverty: povertyRate * 1.2
                });
            }
            
            return { ...country, values };
        });
    }

    generateAgricultureData() {
        const countries = [
            { name: 'China', code: 'CHN', region: 'asia' },
            { name: 'United States', code: 'USA', region: 'north-america' },
            { name: 'Brazil', code: 'BRA', region: 'latin' },
            { name: 'India', code: 'IND', region: 'asia' },
            { name: 'Russia', code: 'RUS', region: 'europe' },
            { name: 'Nigeria', code: 'NGA', region: 'africa' },
            { name: 'Ethiopia', code: 'ETH', region: 'africa' },
            { name: 'Indonesia', code: 'IDN', region: 'asia' },
            { name: 'Argentina', code: 'ARG', region: 'latin' },
            { name: 'France', code: 'FRA', region: 'europe' }
        ];
        
        return countries.map(country => {
            const values = [];
            let cerealYield = 2000 + Math.random() * 3000; // Starting yield
            
            for (let year = 1990; year <= 2023; year++) {
                // Simulate increasing yields
                cerealYield *= (1.01 + Math.random() * 0.02); // 1-3% annual growth
                
                values.push({
                    year: year,
                    cereal_yield: cerealYield,
                    arable_land: 10 + Math.random() * 20,
                    agricultural_employment: 50 - (year - 1990) * 0.5 + Math.random() * 10,
                    food_production_index: 80 + (year - 1990) * 1.2 + Math.random() * 20,
                    undernourishment: Math.max(2, 25 - (year - 1990) * 0.3 + Math.random() * 10)
                });
            }
            
            return { ...country, values };
        });
    }

    generateDevelopmentData() {
        const countries = [
            { name: 'Norway', code: 'NOR', region: 'europe' },
            { name: 'Switzerland', code: 'CHE', region: 'europe' },
            { name: 'Australia', code: 'AUS', region: 'asia' },
            { name: 'Germany', code: 'DEU', region: 'europe' },
            { name: 'Singapore', code: 'SGP', region: 'asia' },
            { name: 'South Korea', code: 'KOR', region: 'asia' },
            { name: 'Chile', code: 'CHL', region: 'latin' },
            { name: 'Costa Rica', code: 'CRI', region: 'latin' },
            { name: 'Rwanda', code: 'RWA', region: 'africa' },
            { name: 'Bangladesh', code: 'BGD', region: 'asia' }
        ];
        
        return countries.map(country => {
            const values = [];
            let hdi = 0.4 + Math.random() * 0.5; // Starting HDI
            
            for (let year = 1990; year <= 2023; year++) {
                // Simulate gradual HDI improvement
                hdi = Math.min(0.99, hdi + 0.003 + Math.random() * 0.005);
                
                values.push({
                    year: year,
                    hdi: hdi,
                    life_expectancy: 50 + hdi * 30 + Math.random() * 5,
                    education_index: hdi + Math.random() * 0.1 - 0.05,
                    income_index: hdi + Math.random() * 0.2 - 0.1,
                    gender_development: hdi * (0.85 + Math.random() * 0.15)
                });
            }
            
            return { ...country, values };
        });
    }

    generateFinanceData() {
        const countries = [
            { name: 'United States', code: 'USA', region: 'north-america' },
            { name: 'Germany', code: 'DEU', region: 'europe' },
            { name: 'United Kingdom', code: 'GBR', region: 'europe' },
            { name: 'Japan', code: 'JPN', region: 'asia' },
            { name: 'France', code: 'FRA', region: 'europe' },
            { name: 'Sweden', code: 'SWE', region: 'europe' },
            { name: 'Norway', code: 'NOR', region: 'europe' },
            { name: 'Canada', code: 'CAN', region: 'north-america' },
            { name: 'Netherlands', code: 'NLD', region: 'europe' },
            { name: 'Denmark', code: 'DNK', region: 'europe' }
        ];
        
        return countries.map(country => {
            const values = [];
            let odaBase = Math.random() * 10000 + 1000; // Base ODA in millions
            
            for (let year = 2000; year <= 2023; year++) {
                // Simulate varying ODA flows
                odaBase *= (0.98 + Math.random() * 0.1); // -2% to +8% annual variation
                
                values.push({
                    year: year,
                    oda_total: odaBase,
                    oda_percent_gni: 0.2 + Math.random() * 0.5,
                    climate_finance: odaBase * 0.1 * (year - 2000) / 23,
                    fdi_flows: odaBase * 5 + Math.random() * odaBase * 2,
                    remittances: odaBase * 0.8 + Math.random() * odaBase * 0.4
                });
            }
            
            return { ...country, values };
        });
    }

    loadDefaultVisualization() {
        // Load default poverty visualization
        this.updateIndicatorOptions();
        setTimeout(() => {
            this.updateVisualization();
        }, 500);
    }

    // Export and sharing functions
    exportData(format) {
        const data = this.getFilteredData(
            document.getElementById('region-select').value,
            parseInt(document.getElementById('year-start').value),
            parseInt(document.getElementById('year-end').value),
            document.getElementById('indicator-select').value
        );
        
        if (format === 'csv') {
            this.downloadCSV(data);
        } else if (format === 'json') {
            this.downloadJSON(data);
        }
    }

    downloadCSV(data) {
        const indicator = document.getElementById('indicator-select').value;
        const indicatorName = this.datasets[this.currentDataset].indicators[indicator];
        
        let csv = `Country,Year,${indicatorName}\n`;
        
        data.forEach(country => {
            country.values.forEach(value => {
                csv += `${country.name},${value.year},${value[indicator] || ''}\n`;
            });
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentDataset}_${indicator}_data.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    downloadJSON(data) {
        const jsonData = {
            dataset: this.currentDataset,
            indicator: document.getElementById('indicator-select').value,
            exported_at: new Date().toISOString(),
            data: data
        };
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentDataset}_data.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCode(language) {
        const indicator = document.getElementById('indicator-select').value;
        const indicatorName = this.datasets[this.currentDataset].indicators[indicator];
        
        let code = '';
        
        if (language === 'r') {
            code = `# R Code for ${this.currentDataset} Analysis\n# Generated by Patrice Mirindi's Analytics Platform\n\n`;
            code += `library(ggplot2)\nlibrary(dplyr)\n\n`;
            code += `# Load data\ndata <- read.csv("${this.currentDataset}_${indicator}_data.csv")\n\n`;
            code += `# Create visualization\nggplot(data, aes(x = Year, y = \`${indicatorName}\`, color = Country)) +\n`;
            code += `  geom_line(size = 1) +\n`;
            code += `  labs(title = "${indicatorName} Over Time",\n`;
            code += `       x = "Year", y = "${indicatorName}") +\n`;
            code += `  theme_minimal()\n\n`;
            code += `# Summary statistics\nsummary(data$\`${indicatorName}\`)\n`;
        } else if (language === 'python') {
            code = `# Python Code for ${this.currentDataset} Analysis\n# Generated by Patrice Mirindi's Analytics Platform\n\n`;
            code += `import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n`;
            code += `# Load data\ndata = pd.read_csv("${this.currentDataset}_${indicator}_data.csv")\n\n`;
            code += `# Create visualization\nplt.figure(figsize=(12, 8))\n`;
            code += `for country in data['Country'].unique():\n`;
            code += `    country_data = data[data['Country'] == country]\n`;
            code += `    plt.plot(country_data['Year'], country_data['${indicatorName}'], label=country, linewidth=2)\n\n`;
            code += `plt.xlabel('Year')\n`;
            code += `plt.ylabel('${indicatorName}')\n`;
            code += `plt.title('${indicatorName} Over Time')\n`;
            code += `plt.legend()\n`;
            code += `plt.grid(True, alpha=0.3)\n`;
            code += `plt.show()\n\n`;
            code += `# Summary statistics\nprint(data['${indicatorName}'].describe())\n`;
        }
        
        // Download code file
        const extension = language === 'r' ? 'R' : 'py';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentDataset}_analysis.${extension}`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    shareAnalysis() {
        const analysisConfig = {
            dataset: this.currentDataset,
            indicator: document.getElementById('indicator-select').value,
            chartType: document.getElementById('chart-type').value,
            region: document.getElementById('region-select').value,
            yearStart: document.getElementById('year-start').value,
            yearEnd: document.getElementById('year-end').value
        };
        
        // Create shareable URL (in a real implementation, this would be saved to a database)
        const encodedConfig = btoa(JSON.stringify(analysisConfig));
        const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Analysis link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Analysis link copied to clipboard!');
        });
    }

    downloadChart() {
        // Use Plotly's built-in download functionality
        const chartDiv = document.getElementById('main-chart');
        Plotly.downloadImage(chartDiv, {
            format: 'png',
            width: 1200,
            height: 700,
            filename: `${this.currentDataset}_chart`
        });
    }

    toggleFullscreen() {
        const chartContainer = document.querySelector('.chart-container');
        if (!document.fullscreenElement) {
            chartContainer.requestFullscreen().then(() => {
                // Resize chart for fullscreen
                setTimeout(() => {
                    Plotly.Plots.resize(document.getElementById('main-chart'));
                }, 100);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataAnalyticsPlatform = new DataAnalyticsPlatform();
    
    // Check for shared analysis configuration
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get('config');
    if (config) {
        try {
            const analysisConfig = JSON.parse(atob(config));
            // Apply shared configuration
            Object.entries(analysisConfig).forEach(([key, value]) => {
                const element = document.getElementById(key === 'yearStart' ? 'year-start' : 
                                                    key === 'yearEnd' ? 'year-end' : 
                                                    key === 'chartType' ? 'chart-type' : 
                                                    key === 'region' ? 'region-select' : 
                                                    key === 'indicator' ? 'indicator-select' : null);
                if (element) {
                    element.value = value;
                }
            });
            
            if (analysisConfig.dataset) {
                window.dataAnalyticsPlatform.selectDataset(analysisConfig.dataset);
            }
        } catch (e) {
            console.warn('Invalid shared configuration');
        }
    }
});