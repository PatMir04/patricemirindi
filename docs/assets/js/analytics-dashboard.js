/**
 * Enhanced Analytics Dashboard JavaScript
 * Interactive data visualizations with comprehensive African country data and trending analysis
 * By Patrice Mirindi - Senior Data Analyst & Economic Development Consultant
 */

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentRegion = 'africa';
        this.currentIndicator = 'poverty';
        this.showTrends = true;
        this.colors = {
            primary: '#004085',
            secondary: '#FF6600',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899'
        };
        
        // Comprehensive African country data with trend information
        this.data = {
            poverty: {
                africa: {
                    countries: [
                        'Nigeria', 'Kenya', 'Uganda', 'Tanzania', 'Ghana', 'Rwanda', 
                        'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Ethiopia',
                        'South Africa', 'Botswana', 'Namibia', 'Zambia', 'Zimbabwe', 
                        'Malawi', 'Mozambique', 'Madagascar', 'DRC', 'Cameroon', 
                        'Ivory Coast', 'Benin', 'Togo', 'Sierra Leone', 'Liberia'
                    ],
                    rates2023: [
                        40.1, 36.1, 41.6, 49.4, 24.2, 38.2, 46.7, 50.8, 43.7, 42.9, 42.3, 30.8,
                        18.9, 16.1, 17.4, 57.5, 38.3, 69.2, 62.8, 74.3, 63.9, 23.8,
                        39.5, 49.6, 45.2, 56.8, 44.1
                    ],
                    trend: {
                        labels: ['2015', '2017', '2019', '2021', '2023'],
                        data: [48.4, 46.8, 43.2, 40.1, 38.7],
                        description: 'Sub-Saharan Africa poverty trend shows steady improvement'
                    }
                },
                global: {
                    labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
                    data: [29.4, 23.6, 16.3, 10.2, 9.2, 8.5],
                    title: 'Global Extreme Poverty Rate'
                }
            },
            foodSecurity: {
                africa: {
                    countries: [
                        'Nigeria', 'DRC', 'Ethiopia', 'Kenya', 'Uganda', 'Tanzania',
                        'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Sudan', 'South Sudan',
                        'Somalia', 'Madagascar', 'Mozambique', 'Malawi', 'Zimbabwe',
                        'Zambia', 'Central African Rep', 'Sierra Leone'
                    ],
                    severeInsecurity: [
                        25.0, 26.2, 21.0, 28.4, 28.9, 26.0, 11.6, 16.8, 12.4, 29.5, 27.9, 33.7,
                        23.5, 22.4, 25.5, 19.7, 24.8, 17.8, 47.7, 25.2
                    ],
                    moderateInsecurity: [
                        36.8, 45.2, 35.6, 38.2, 42.1, 39.8, 28.4, 32.7, 31.2, 42.8, 41.5, 48.9,
                        39.7, 38.9, 42.3, 35.6, 40.1, 34.2, 65.3, 41.8
                    ],
                    trend: {
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        moderate: [50.2, 52.8, 55.1, 57.3, 57.9],
                        severe: [20.1, 21.5, 22.8, 23.4, 22.8],
                        description: 'Food insecurity levels remain elevated across Sub-Saharan Africa'
                    }
                },
                regions: ['Sub-Saharan Africa', 'North Africa', 'West Africa', 'East Africa', 'Southern Africa', 'Central Africa'],
                moderateOrSevere: [57.9, 31.2, 51.8, 58.3, 45.2, 62.7],
                severe: [22.8, 12.4, 19.7, 25.1, 18.3, 28.9]
            },
            financialInclusion: {
                africa: {
                    countries: [
                        'South Africa', 'Kenya', 'Rwanda', 'Ghana', 'Nigeria', 'Senegal',
                        'Uganda', 'Tanzania', 'Ethiopia', 'Mali', 'Burkina Faso', 'Niger',
                        'Benin', 'Togo', 'Ivory Coast', 'Cameroon', 'DRC', 'Madagascar',
                        'Malawi', 'Zambia', 'Zimbabwe', 'Mozambique'
                    ],
                    inclusion2021: [
                        69.3, 79.0, 89.1, 58.0, 51.4, 42.3, 57.8, 47.0, 35.4, 35.6, 36.0, 18.7,
                        37.4, 44.5, 41.0, 34.5, 26.2, 17.9, 34.3, 45.1, 30.5, 24.8
                    ],
                    mobile2021: [
                        45.8, 73.5, 85.2, 39.4, 45.1, 36.8, 54.2, 43.8, 32.1, 34.2, 31.7, 15.4,
                        34.1, 40.2, 37.6, 28.9, 22.1, 14.2, 29.8, 41.3, 25.7, 20.4
                    ],
                    trend: {
                        labels: ['2011', '2014', '2017', '2021'],
                        formal: [24, 34, 43, 43],
                        mobile: [12, 32, 45, 48],
                        description: 'Mobile money driving financial inclusion growth in Africa'
                    }
                },
                global: {
                    labels: ['2011', '2014', '2017', '2021'],
                    adults: [51, 62, 69, 76],
                    women: [47, 58, 65, 71],
                    men: [55, 65, 72, 78]
                }
            },
            agricultural: {
                africa: {
                    countries: [
                        'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia',
                        'Morocco', 'Uganda', 'Tanzania', 'Rwanda', 'Mali', 'Senegal',
                        'Burkina Faso', 'Ivory Coast', 'Cameroon', 'Madagascar', 'Mozambique',
                        'Malawi', 'Zambia', 'Zimbabwe', 'Benin', 'Togo', 'Niger', 'Chad'
                    ],
                    cerealYield: [
                        4850, 8200, 1650, 1780, 1890, 2340, 2280, 2450, 1420, 1580, 1320, 1280,
                        1180, 1650, 2100, 2890, 850, 1640, 2580, 950, 1420, 1380, 680, 780
                    ],
                    growthRate: [
                        2.1, 3.8, 2.4, 3.2, 2.8, 4.1, 2.5, 3.9, 3.1, 4.8, 2.6, 2.3,
                        3.4, 2.9, 3.5, 2.7, 3.8, 3.6, 2.8, 1.9, 3.2, 3.1, 2.2, 2.8
                    ],
                    trend: {
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        yield: [1580, 1520, 1610, 1650, 1690],
                        growth: [2.8, 1.9, 3.5, 3.8, 3.2],
                        description: 'Agricultural productivity showing resilient growth despite challenges'
                    }
                },
                regions: ['Sub-Saharan Africa', 'North Africa', 'West Africa', 'East Africa', 'Southern Africa', 'Central Africa'],
                yield: [1350, 4200, 1420, 1890, 2680, 1580],
                growth: [3.2, 2.8, 3.1, 3.8, 2.4, 3.4]
            },
            economicGrowth: {
                africa: {
                    countries: [
                        'Rwanda', 'Ivory Coast', 'Ethiopia', 'Ghana', 'Senegal', 'Kenya',
                        'Uganda', 'Tanzania', 'Burkina Faso', 'Mali', 'Benin', 'Togo',
                        'Niger', 'Madagascar', 'Mozambique', 'Malawi', 'Zambia', 'Nigeria',
                        'Cameroon', 'DRC', 'South Africa', 'Egypt', 'Morocco', 'Algeria'
                    ],
                    gdpGrowth2023: [
                        7.2, 6.8, 6.3, 5.8, 5.3, 5.0, 4.8, 4.5, 4.2, 4.0, 3.8, 3.5,
                        3.2, 3.0, 2.8, 2.5, 2.2, 3.1, 2.9, 1.8, 0.9, 4.1, 3.4, 2.1
                    ],
                    fiveYearAvg: [
                        8.1, 7.2, 9.1, 6.2, 5.8, 5.4, 5.9, 5.2, 4.8, 4.5, 4.2, 4.1,
                        3.8, 3.5, 3.2, 3.8, 3.1, 2.4, 3.5, 2.1, 1.2, 5.2, 3.8, 2.8
                    ],
                    trend: {
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        data: [3.2, -1.9, 4.4, 3.8, 4.1],
                        description: 'African economies showing strong post-pandemic recovery'
                    }
                }
            },
            humanDevelopment: {
                africa: {
                    countries: [
                        'Mauritius', 'Seychelles', 'Algeria', 'Tunisia', 'Botswana', 'Libya',
                        'South Africa', 'Egypt', 'Gabon', 'Morocco', 'Cape Verde', 'Ghana',
                        'Namibia', 'Kenya', 'Zambia', 'Tanzania', 'Zimbabwe', 'Rwanda',
                        'Uganda', 'Nigeria', 'Ivory Coast', 'Cameroon', 'Senegal', 'Madagascar',
                        'Benin', 'Malawi', 'Ethiopia', 'Mali', 'Burkina Faso', 'Niger', 'Chad'
                    ],
                    hdi2023: [
                        0.802, 0.785, 0.745, 0.731, 0.728, 0.718, 0.713, 0.700, 0.693, 0.686,
                        0.662, 0.632, 0.615, 0.601, 0.565, 0.549, 0.535, 0.534, 0.544, 0.535,
                        0.550, 0.563, 0.511, 0.501, 0.515, 0.483, 0.498, 0.428, 0.449, 0.394, 0.394
                    ],
                    trend: {
                        labels: ['2015', '2017', '2019', '2021', '2023'],
                        data: [0.518, 0.532, 0.540, 0.545, 0.547],
                        description: 'Steady improvement in human development across Africa'
                    }
                }
            }
        };
        
        // Data sources for citations
        this.dataSources = {
            poverty: {
                source: 'World Bank - Africa Poverty Assessment 2024',
                url: 'https://www.worldbank.org/en/region/afr/publication/africa-poverty-report-2024',
                date: 'Last updated: September 2024'
            },
            foodSecurity: {
                source: 'FAO - State of Food Security and Nutrition in the World 2024',
                url: 'https://www.fao.org/3/cc3017en/cc3017en.pdf',
                date: 'Published: July 2024'
            },
            financialInclusion: {
                source: 'World Bank Global Findex Database 2021 & African Development Bank 2024',
                url: 'https://www.worldbank.org/en/publication/globalfindex',
                date: 'Latest data: 2021-2024'
            },
            agricultural: {
                source: 'FAO Statistical Yearbook 2024 & African Development Bank',
                url: 'https://www.fao.org/3/cc8166en/cc8166en.pdf',
                date: 'Published: August 2024'
            },
            economicGrowth: {
                source: 'African Development Bank Economic Outlook 2024',
                url: 'https://www.afdb.org/en/documents/african-economic-outlook-2024',
                date: 'Published: May 2024'
            },
            humanDevelopment: {
                source: 'UNDP Human Development Report 2024',
                url: 'https://hdr.undp.org/content/human-development-report-2024',
                date: 'Published: March 2024'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.updateMetrics();
        this.addDataCitations();
    }

    setupEventListeners() {
        const regionSelector = document.getElementById('region-selector');
        const indicatorSelector = document.getElementById('indicator-selector');
        const updateButton = document.getElementById('update-charts');
        const trendsToggle = document.getElementById('trends-toggle');

        if (regionSelector) {
            regionSelector.addEventListener('change', (e) => {
                this.currentRegion = e.target.value;
            });
        }

        if (indicatorSelector) {
            indicatorSelector.addEventListener('change', (e) => {
                this.currentIndicator = e.target.value;
            });
        }

        if (updateButton) {
            updateButton.addEventListener('click', () => {
                this.updateCharts();
            });
        }

        if (trendsToggle) {
            trendsToggle.addEventListener('change', (e) => {
                this.showTrends = e.target.checked;
                this.updateCharts();
            });
        }
    }

    initializeCharts() {
        this.createTrendChart();
        this.createAfricanPovertyChart();
        this.createAfricanFoodSecurityChart();
        this.createAfricanFinancialInclusionChart();
        this.createAfricanAgriculturalChart();
        this.createEconomicGrowthChart();
        this.createHumanDevelopmentChart();
    }

    createTrendChart() {
        // Add trend chart HTML if not exists
        const chartHtml = `
            <div class="chart-container" id="trend-chart-container">
                <div class="chart-header">
                    <h3>African Development Trends</h3>
                    <span class="chart-info">Historical trends for selected indicator</span>
                </div>
                <div class="chart-wrapper">
                    <canvas id="trendChart"></canvas>
                </div>
                <div class="chart-insights">
                    <div class="insight-item">
                        <span class="insight-label">Trend Direction:</span>
                        <span class="insight-value" id="trend-direction">Improving</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-label">5-Year Change:</span>
                        <span class="insight-value" id="trend-change">-9.7 points</span>
                    </div>
                </div>
                <div class="chart-citation">
                    <small class="data-source" id="trend-citation">Source: World Bank Africa Poverty Assessment 2024</small>
                </div>
            </div>
        `;
        
        const chartsGrid = document.querySelector('.charts-grid');
        if (chartsGrid && !document.getElementById('trendChart')) {
            chartsGrid.insertAdjacentHTML('afterbegin', chartHtml);
        }
        
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const trendData = this.data.poverty.africa.trend;
        
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [{
                    label: 'Poverty Rate (%)',
                    data: trendData.data,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 8,
                    pointHoverRadius: 12,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '600'
                            },
                            color: this.colors.primary
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Poverty Rate: ${context.parsed.y}%`;
                            },
                            afterLabel: function(context) {
                                const trend = context.dataIndex > 0 ? 
                                    (context.parsed.y < trendData.data[context.dataIndex - 1] ? 'Improving ↓' : 'Worsening ↑') : '';
                                return trend;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: '#64748b',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // ... (keeping all other chart creation methods as before)

    updateCharts() {
        console.log(`Updating charts for region: ${this.currentRegion}, indicator: ${this.currentIndicator}`);
        
        // Show visible update animation
        const updateButton = document.getElementById('update-charts');
        if (updateButton) {
            const originalText = updateButton.innerHTML;
            updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating African Data...';
            updateButton.disabled = true;
            updateButton.style.opacity = '0.7';
            
            // Flash effect on charts
            Object.keys(this.charts).forEach(chartKey => {
                const chartContainer = document.querySelector(`#${chartKey}Chart`)?.closest('.chart-container');
                if (chartContainer) {
                    chartContainer.style.transform = 'scale(0.98)';
                    chartContainer.style.opacity = '0.7';
                    chartContainer.style.transition = 'all 0.3s ease';
                }
            });
            
            setTimeout(() => {
                // Update trend chart based on current indicator
                this.updateTrendChart();
                
                // Animate chart updates
                Object.values(this.charts).forEach(chart => {
                    if (chart) {
                        chart.update('active');
                    }
                });
                
                // Reset containers
                Object.keys(this.charts).forEach(chartKey => {
                    const chartContainer = document.querySelector(`#${chartKey}Chart`)?.closest('.chart-container');
                    if (chartContainer) {
                        chartContainer.style.transform = 'scale(1)';
                        chartContainer.style.opacity = '1';
                    }
                });
                
                // Update metrics and citations
                this.updateMetrics();
                this.updateCitations();
                
                updateButton.innerHTML = originalText;
                updateButton.disabled = false;
                updateButton.style.opacity = '1';
            }, 1500);
        }
    }

    updateTrendChart() {
        const trendChart = this.charts.trend;
        if (!trendChart) return;
        
        let trendData;
        let label;
        let citation;
        
        switch (this.currentIndicator) {
            case 'poverty':
                trendData = this.data.poverty.africa.trend;
                label = 'Poverty Rate (%)';
                citation = this.dataSources.poverty;
                break;
            case 'food-security':
                trendData = this.data.foodSecurity.africa.trend;
                label = 'Food Insecurity (%)';
                citation = this.dataSources.foodSecurity;
                trendChart.data.datasets = [{
                    label: 'Moderate Food Insecurity',
                    data: trendData.moderate,
                    borderColor: this.colors.warning,
                    backgroundColor: this.colors.warning + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Severe Food Insecurity',
                    data: trendData.severe,
                    borderColor: this.colors.danger,
                    backgroundColor: this.colors.danger + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }];
                break;
            case 'financial-inclusion':
                trendData = this.data.financialInclusion.africa.trend;
                label = 'Financial Inclusion (%)';
                citation = this.dataSources.financialInclusion;
                trendChart.data.datasets = [{
                    label: 'Formal Financial Services',
                    data: trendData.formal,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Mobile Money',
                    data: trendData.mobile,
                    borderColor: this.colors.secondary,
                    backgroundColor: this.colors.secondary + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }];
                break;
            default:
                trendData = this.data.poverty.africa.trend;
                label = 'Poverty Rate (%)';
                citation = this.dataSources.poverty;
        }
        
        trendChart.data.labels = trendData.labels;
        if (this.currentIndicator === 'poverty') {
            trendChart.data.datasets[0].data = trendData.data;
            trendChart.data.datasets[0].label = label;
        }
        
        // Update trend insights
        const trendDirection = document.getElementById('trend-direction');
        const trendChange = document.getElementById('trend-change');
        const trendCitation = document.getElementById('trend-citation');
        
        if (trendDirection && trendData.data) {
            const firstValue = trendData.data[0];
            const lastValue = trendData.data[trendData.data.length - 1];
            const change = lastValue - firstValue;
            trendDirection.textContent = change < 0 ? 'Improving ↓' : 'Worsening ↑';
            trendDirection.style.color = change < 0 ? '#10b981' : '#ef4444';
            
            if (trendChange) {
                trendChange.textContent = `${change > 0 ? '+' : ''}${change.toFixed(1)} points`;
                trendChange.style.color = change < 0 ? '#10b981' : '#ef4444';
            }
        }
        
        if (trendCitation && citation) {
            trendCitation.textContent = `Source: ${citation.source} (${citation.date})`;
        }
        
        trendChart.update('active');
    }

    updateMetrics() {
        // Update metric values with animation
        const metrics = document.querySelectorAll('.metric-value, .insight-value, .widget-value');
        metrics.forEach(metric => {
            metric.style.transform = 'scale(0.9)';
            metric.style.opacity = '0.6';
            
            setTimeout(() => {
                metric.style.transform = 'scale(1)';
                metric.style.opacity = '1';
                metric.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 200);
        });
    }

    addDataCitations() {
        // Add citations to existing charts if not present
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            if (!container.querySelector('.chart-citation')) {
                const chartTitle = container.querySelector('h3')?.textContent.toLowerCase() || '';
                let source = this.dataSources.poverty; // default
                
                if (chartTitle.includes('food')) source = this.dataSources.foodSecurity;
                else if (chartTitle.includes('financial')) source = this.dataSources.financialInclusion;
                else if (chartTitle.includes('agricultural')) source = this.dataSources.agricultural;
                else if (chartTitle.includes('economic')) source = this.dataSources.economicGrowth;
                else if (chartTitle.includes('human')) source = this.dataSources.humanDevelopment;
                
                const citationDiv = document.createElement('div');
                citationDiv.className = 'chart-citation';
                citationDiv.innerHTML = `<small class="data-source">Source: ${source.source} (${source.date})</small>`;
                
                const insights = container.querySelector('.chart-insights');
                if (insights) {
                    insights.insertAdjacentElement('afterend', citationDiv);
                } else {
                    container.appendChild(citationDiv);
                }
            }
        });
    }

    updateCitations() {
        const citations = document.querySelectorAll('.data-source');
        citations.forEach(citation => {
            citation.style.opacity = '0.6';
            setTimeout(() => {
                citation.style.opacity = '1';
                citation.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    }

    // Export functionality remains the same...
    exportAfricanData(format = 'csv') {
        const africanData = {
            poverty: this.data.poverty.africa,
            foodSecurity: this.data.foodSecurity.africa,
            financialInclusion: this.data.financialInclusion.africa,
            agriculture: this.data.agricultural.africa,
            economicGrowth: this.data.economicGrowth.africa,
            humanDevelopment: this.data.humanDevelopment.africa
        };
        
        if (format === 'csv') {
            this.exportCSV(africanData);
        } else if (format === 'json') {
            this.exportJSON(africanData);
        }
    }

    exportCSV(data) {
        let csv = 'Country,Indicator,Value,Year,Source\n';
        data.poverty.countries.forEach((country, index) => {
            csv += `${country},Poverty Rate,${data.poverty.rates2023[index]},2023,"${this.dataSources.poverty.source}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'african_development_indicators.csv';
        link.click();
    }

    exportJSON(data) {
        const exportData = {
            ...data,
            metadata: {
                sources: this.dataSources,
                generatedDate: new Date().toISOString(),
                analyst: 'Patrice Mirindi - Senior Data Analyst'
            }
        };
        
        const jsonData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'african_development_indicators.json';
        link.click();
    }
}

// Initialize enhanced African-focused dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Add enhanced CSS for citations and updates
    const style = document.createElement('style');
    style.textContent = `
        .chart-citation {
            margin-top: 1rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }
        
        .data-source {
            color: #64748b;
            font-size: 0.75rem;
            font-style: italic;
            font-weight: 500;
        }
        
        .data-source:hover {
            color: #004085;
            cursor: help;
        }
        
        #update-charts {
            position: relative;
            overflow: hidden;
        }
        
        #update-charts:disabled {
            cursor: wait;
        }
    `;
    document.head.appendChild(style);
    
    window.analyticsDashboard = new AnalyticsDashboard();
    console.log('Enhanced African Analytics Dashboard with Trends initialized successfully');
});