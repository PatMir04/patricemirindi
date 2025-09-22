/**
 * Enhanced Analytics Dashboard JavaScript
 * Interactive data visualizations with comprehensive African country data
 * By Patrice Mirindi - Senior Data Analyst & Economic Development Consultant
 */

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentRegion = 'africa';
        this.currentIndicator = 'poverty';
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
        
        // Comprehensive African country data
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
                        data: [48.4, 46.8, 43.2, 40.1, 38.7]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
                }
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.updateMetrics();
    }

    setupEventListeners() {
        const regionSelector = document.getElementById('region-selector');
        const indicatorSelector = document.getElementById('indicator-selector');
        const updateButton = document.getElementById('update-charts');

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
    }

    initializeCharts() {
        this.createAfricanPovertyChart();
        this.createAfricanFoodSecurityChart();
        this.createAfricanFinancialInclusionChart();
        this.createAfricanAgriculturalChart();
        this.createEconomicGrowthChart();
        this.createHumanDevelopmentChart();
    }

    createAfricanPovertyChart() {
        const ctx = document.getElementById('povertyChart');
        if (!ctx) return;

        const data = this.data.poverty.africa;
        
        this.charts.poverty = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.countries.slice(0, 15), // Show top 15 countries
                datasets: [{
                    label: 'Poverty Rate (%)',
                    data: data.rates2023.slice(0, 15),
                    backgroundColor: data.rates2023.slice(0, 15).map(rate => 
                        rate > 50 ? this.colors.danger + '80' : 
                        rate > 30 ? this.colors.warning + '80' : 
                        this.colors.success + '80'
                    ),
                    borderColor: data.rates2023.slice(0, 15).map(rate => 
                        rate > 50 ? this.colors.danger : 
                        rate > 30 ? this.colors.warning : 
                        this.colors.success
                    ),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
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
                                const rate = context.parsed.y;
                                if (rate > 50) return 'Status: Critical';
                                if (rate > 30) return 'Status: High';
                                return 'Status: Moderate';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 10,
                                weight: '500'
                            },
                            color: '#64748b',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 80,
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
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createAfricanFoodSecurityChart() {
        const ctx = document.getElementById('foodSecurityChart');
        if (!ctx) return;

        const data = this.data.foodSecurity.africa;
        
        this.charts.foodSecurity = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'African Countries Food Security',
                    data: data.countries.slice(0, 15).map((country, index) => ({
                        x: data.moderateInsecurity[index],
                        y: data.severeInsecurity[index],
                        country: country
                    })),
                    backgroundColor: this.colors.secondary + '60',
                    borderColor: this.colors.secondary,
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 12
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
                        callbacks: {
                            title: function(context) {
                                return context[0].raw.country;
                            },
                            label: function(context) {
                                return [
                                    `Moderate Insecurity: ${context.parsed.x}%`,
                                    `Severe Insecurity: ${context.parsed.y}%`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Moderate Food Insecurity (%)',
                            color: this.colors.primary,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '600'
                            }
                        },
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
                        title: {
                            display: true,
                            text: 'Severe Food Insecurity (%)',
                            color: this.colors.primary,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '600'
                            }
                        },
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
                            color: '#64748b'
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

    createAfricanFinancialInclusionChart() {
        const ctx = document.getElementById('financialInclusionChart');
        if (!ctx) return;

        const data = this.data.financialInclusion.africa;
        
        this.charts.financialInclusion = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.countries.slice(0, 12),
                datasets: [
                    {
                        label: 'Financial Institution Access',
                        data: data.inclusion2021.slice(0, 12),
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 3
                    },
                    {
                        label: 'Mobile Money Access',
                        data: data.mobile2021.slice(0, 12),
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary + '20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: this.colors.secondary,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 3
                    }
                ]
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
                            color: this.colors.primary,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
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
                                size: 10,
                                weight: '500'
                            },
                            color: '#64748b',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
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
                    duration: 1300,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createAfricanAgriculturalChart() {
        const ctx = document.getElementById('agriculturalChart');
        if (!ctx) return;

        const data = this.data.agricultural.africa;
        
        this.charts.agricultural = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.countries.slice(0, 8),
                datasets: [{
                    label: 'Cereal Yield (kg/hectare)',
                    data: data.cerealYield.slice(0, 8).map(yield => yield / 100), // Scale down for visualization
                    backgroundColor: this.colors.success + '30',
                    borderColor: this.colors.success,
                    borderWidth: 3,
                    pointBackgroundColor: this.colors.success,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
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
                        callbacks: {
                            label: function(context) {
                                const actualYield = data.cerealYield[context.dataIndex];
                                return `Yield: ${actualYield.toLocaleString()} kg/ha`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        angleLines: {
                            color: '#e2e8f0'
                        },
                        pointLabels: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: this.colors.primary
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1400,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createEconomicGrowthChart() {
        // Add to the charts grid in HTML first, then create this chart
        const chartHtml = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>African Economic Growth</h3>
                    <span class="chart-info">GDP Growth Rate (%) - 2023</span>
                </div>
                <div class="chart-wrapper">
                    <canvas id="economicGrowthChart"></canvas>
                </div>
                <div class="chart-insights">
                    <div class="insight-item">
                        <span class="insight-label">Highest Growth:</span>
                        <span class="insight-value" style="color: #10b981;">Rwanda 7.2%</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-label">Average Growth:</span>
                        <span class="insight-value" style="color: #004085;">4.1%</span>
                    </div>
                </div>
            </div>
        `;
        
        const chartsGrid = document.querySelector('.charts-grid');
        if (chartsGrid && !document.getElementById('economicGrowthChart')) {
            chartsGrid.insertAdjacentHTML('beforeend', chartHtml);
        }
        
        const ctx = document.getElementById('economicGrowthChart');
        if (!ctx) return;

        const data = this.data.economicGrowth.africa;
        
        this.charts.economicGrowth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.countries.slice(0, 12),
                datasets: [{
                    label: '2023 GDP Growth (%)',
                    data: data.gdpGrowth2023.slice(0, 12),
                    backgroundColor: data.gdpGrowth2023.slice(0, 12).map(growth => 
                        growth > 5 ? this.colors.success + '80' : 
                        growth > 3 ? this.colors.info + '80' : 
                        this.colors.warning + '80'
                    ),
                    borderColor: data.gdpGrowth2023.slice(0, 12).map(growth => 
                        growth > 5 ? this.colors.success : 
                        growth > 3 ? this.colors.info : 
                        this.colors.warning
                    ),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                            label: function(context) {
                                return `GDP Growth: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 10,
                                weight: '500'
                            },
                            color: '#64748b',
                            maxRotation: 45
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
                    duration: 1100,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createHumanDevelopmentChart() {
        const chartHtml = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>Human Development Index</h3>
                    <span class="chart-info">HDI Scores for African Countries (2023)</span>
                </div>
                <div class="chart-wrapper">
                    <canvas id="humanDevelopmentChart"></canvas>
                </div>
                <div class="chart-insights">
                    <div class="insight-item">
                        <span class="insight-label">Highest HDI:</span>
                        <span class="insight-value" style="color: #10b981;">Mauritius 0.802</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-label">Regional Average:</span>
                        <span class="insight-value" style="color: #004085;">0.547</span>
                    </div>
                </div>
            </div>
        `;
        
        const chartsGrid = document.querySelector('.charts-grid');
        if (chartsGrid && !document.getElementById('humanDevelopmentChart')) {
            chartsGrid.insertAdjacentHTML('beforeend', chartHtml);
        }
        
        const ctx = document.getElementById('humanDevelopmentChart');
        if (!ctx) return;

        const data = this.data.humanDevelopment.africa;
        
        this.charts.humanDevelopment = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.countries.slice(0, 15),
                datasets: [{
                    label: 'Human Development Index',
                    data: data.hdi2023.slice(0, 15),
                    backgroundColor: data.hdi2023.slice(0, 15).map(hdi => 
                        hdi > 0.7 ? this.colors.success + '80' : 
                        hdi > 0.5 ? this.colors.info + '80' : 
                        this.colors.warning + '80'
                    ),
                    borderColor: data.hdi2023.slice(0, 15).map(hdi => 
                        hdi > 0.7 ? this.colors.success : 
                        hdi > 0.5 ? this.colors.info : 
                        this.colors.warning
                    ),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                            label: function(context) {
                                const hdi = context.parsed.x;
                                let category = 'Low';
                                if (hdi > 0.8) category = 'Very High';
                                else if (hdi > 0.7) category = 'High';
                                else if (hdi > 0.55) category = 'Medium';
                                return [`HDI: ${hdi}`, `Category: ${category}`];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 1.0,
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
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 10,
                                weight: '500'
                            },
                            color: '#64748b'
                        }
                    }
                },
                animation: {
                    duration: 1600,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateCharts() {
        console.log(`Updating charts for region: ${this.currentRegion}, indicator: ${this.currentIndicator}`);
        
        // Animate chart updates with African focus
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update('active');
            }
        });
        
        this.updateMetrics();
        
        // Show loading state
        const updateButton = document.getElementById('update-charts');
        if (updateButton) {
            const originalText = updateButton.innerHTML;
            updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating African Data...';
            updateButton.disabled = true;
            
            setTimeout(() => {
                updateButton.innerHTML = originalText;
                updateButton.disabled = false;
            }, 1500);
        }
    }

    updateMetrics() {
        // Update metric values with African focus
        const metrics = document.querySelectorAll('.metric-value, .insight-value');
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

    // Export functionality for African data
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
        let csv = 'Country,Indicator,Value,Year\n';
        
        // Add poverty data
        data.poverty.countries.forEach((country, index) => {
            csv += `${country},Poverty Rate,${data.poverty.rates2023[index]},2023\n`;
        });
        
        // Add other indicators...
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'african_development_indicators.csv';
        link.click();
    }

    exportJSON(data) {
        const jsonData = JSON.stringify(data, null, 2);
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
    window.analyticsDashboard = new AnalyticsDashboard();
    console.log('Enhanced African Analytics Dashboard initialized successfully');
});