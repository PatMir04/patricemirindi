/**
 * Analytics Dashboard JavaScript
 * Interactive data visualizations for economic development indicators
 * By Patrice Mirindi - Senior Data Analyst & Economic Development Consultant
 */

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentRegion = 'global';
        this.currentIndicator = 'poverty';
        this.colors = {
            primary: '#004085',
            secondary: '#FF6600',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4'
        };
        
        this.data = {
            poverty: {
                global: {
                    labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
                    data: [29.4, 23.6, 16.3, 10.2, 9.2, 8.5],
                    title: 'Global Extreme Poverty Rate'
                },
                africa: {
                    labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
                    data: [55.7, 48.9, 42.3, 35.2, 36.8, 35.2],
                    title: 'Sub-Saharan Africa Poverty Rate'
                }
            },
            foodSecurity: {
                regions: ['Global', 'Africa', 'Asia', 'Latin America', 'Europe'],
                moderateOrSevere: [29.3, 57.9, 24.8, 27.4, 8.2],
                severe: [11.3, 22.8, 8.4, 9.7, 1.8]
            },
            financialInclusion: {
                global: {
                    labels: ['2011', '2014', '2017', '2021'],
                    adults: [51, 62, 69, 76],
                    women: [47, 58, 65, 71],
                    men: [55, 65, 72, 78]
                }
            },
            agricultural: {
                regions: ['World', 'Sub-Saharan Africa', 'South Asia', 'East Asia', 'Europe', 'North America'],
                yield: [4050, 1350, 3100, 6800, 5200, 7800],
                growth: [2.1, 1.8, 2.8, 1.5, 1.2, 0.8]
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
        // Dashboard controls
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
        this.createPovertyChart();
        this.createFoodSecurityChart();
        this.createFinancialInclusionChart();
        this.createAgriculturalChart();
    }

    createPovertyChart() {
        const ctx = document.getElementById('povertyChart');
        if (!ctx) return;

        const data = this.data.poverty.global;
        
        this.charts.poverty = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Extreme Poverty Rate (%)',
                    data: data.data,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
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
                                family: 'Avenir, sans-serif',
                                size: 12,
                                weight: '600'
                            },
                            color: this.colors.primary
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Poverty Rate: ${context.parsed.y}%`;
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
                                family: 'Avenir, sans-serif',
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
                                family: 'Avenir, sans-serif',
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
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createFoodSecurityChart() {
        const ctx = document.getElementById('foodSecurityChart');
        if (!ctx) return;

        const data = this.data.foodSecurity;
        
        this.charts.foodSecurity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.regions,
                datasets: [
                    {
                        label: 'Moderate or Severe (%)',
                        data: data.moderateOrSevere,
                        backgroundColor: this.colors.secondary + '80',
                        borderColor: this.colors.secondary,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    },
                    {
                        label: 'Severe Only (%)',
                        data: data.severe,
                        backgroundColor: this.colors.danger + '80',
                        borderColor: this.colors.danger,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
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
                                family: 'Avenir, sans-serif',
                                size: 12,
                                weight: '600'
                            },
                            color: this.colors.primary,
                            usePointStyle: true,
                            pointStyle: 'rectRounded'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
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
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Avenir, sans-serif',
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
                                family: 'Avenir, sans-serif',
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

    createFinancialInclusionChart() {
        const ctx = document.getElementById('financialInclusionChart');
        if (!ctx) return;

        const data = this.data.financialInclusion.global;
        
        this.charts.financialInclusion = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'All Adults',
                        data: data.adults,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Women',
                        data: data.women,
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary + '20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Men',
                        data: data.men,
                        borderColor: this.colors.success,
                        backgroundColor: this.colors.success + '20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
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
                                family: 'Avenir, sans-serif',
                                size: 12,
                                weight: '600'
                            },
                            color: this.colors.primary,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
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
                                family: 'Avenir, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: '#64748b'
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
                                family: 'Avenir, sans-serif',
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
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createAgriculturalChart() {
        const ctx = document.getElementById('agriculturalChart');
        if (!ctx) return;

        const data = this.data.agricultural;
        
        this.charts.agricultural = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.regions,
                datasets: [{
                    data: data.yield,
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.success,
                        this.colors.warning,
                        this.colors.info,
                        this.colors.danger
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Avenir, sans-serif',
                                size: 11,
                                weight: '600'
                            },
                            color: this.colors.primary,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.toLocaleString()} kg/ha`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateCharts() {
        // Update charts based on selected region and indicator
        console.log(`Updating charts for region: ${this.currentRegion}, indicator: ${this.currentIndicator}`);
        
        // Animate chart updates
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
            updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            updateButton.disabled = true;
            
            setTimeout(() => {
                updateButton.innerHTML = originalText;
                updateButton.disabled = false;
            }, 1000);
        }
    }

    updateMetrics() {
        // Animate metric values
        const metrics = document.querySelectorAll('.metric-value, .insight-value');
        metrics.forEach(metric => {
            const finalValue = metric.textContent;
            metric.style.transform = 'scale(0.8)';
            metric.style.opacity = '0.5';
            
            setTimeout(() => {
                metric.style.transform = 'scale(1)';
                metric.style.opacity = '1';
                metric.style.transition = 'all 0.3s ease';
            }, 200);
        });
    }

    // Export functionality
    exportChart(chartName, format = 'png') {
        const chart = this.charts[chartName];
        if (!chart) return;

        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `${chartName}_chart.${format}`;
        link.href = url;
        link.click();
    }

    // Data export
    exportData(format = 'csv') {
        if (format === 'csv') {
            this.exportCSV();
        } else if (format === 'json') {
            this.exportJSON();
        }
    }

    exportCSV() {
        const csvData = this.convertToCSV(this.data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'development_indicators_data.csv';
        link.click();
    }

    exportJSON() {
        const jsonData = JSON.stringify(this.data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'development_indicators_data.json';
        link.click();
    }

    convertToCSV(data) {
        let csv = 'Indicator,Region,Year,Value\n';
        
        // Convert poverty data
        Object.keys(data.poverty).forEach(region => {
            const regionData = data.poverty[region];
            regionData.labels.forEach((year, index) => {
                csv += `Poverty Rate,${region},${year},${regionData.data[index]}\n`;
            });
        });
        
        return csv;
    }
}

// Enhanced chart styles
const chartStyles = `
<style>
/* Dashboard Styles */
.dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 20px;
    border: 2px solid #F4F7FC;
}

.dashboard-header h2 {
    color: #004085;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: bold;
}

.dashboard-header p {
    color: #6C757D;
    font-size: 1.125rem;
    margin-bottom: 2rem;
}

.dashboard-controls {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    align-items: end;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.control-group label {
    font-weight: 600;
    color: #004085;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.dashboard-select {
    padding: 0.75rem 1rem;
    border: 2px solid #004085;
    border-radius: 8px;
    font-family: 'Avenir', sans-serif;
    font-weight: 500;
    color: #004085;
    background: white;
    min-width: 150px;
    transition: all 0.3s ease;
}

.dashboard-select:focus {
    outline: none;
    border-color: #FF6600;
    box-shadow: 0 0 8px rgba(255, 102, 0, 0.3);
}

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 3rem 0;
}

.chart-container {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.1);
    border: 2px solid #F4F7FC;
    transition: all 0.3s ease;
}

.chart-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 64, 133, 0.15);
    border-color: #FF6600;
}

.chart-header {
    margin-bottom: 1.5rem;
    text-align: center;
}

.chart-header h3 {
    color: #004085;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
}

.chart-info {
    color: #6C757D;
    font-size: 0.9rem;
    font-style: italic;
}

.chart-wrapper {
    height: 300px;
    margin-bottom: 1.5rem;
}

.chart-insights {
    display: flex;
    justify-content: space-around;
    padding-top: 1rem;
    border-top: 2px solid #F4F7FC;
}

.insight-item {
    text-align: center;
}

.insight-label {
    display: block;
    font-size: 0.8rem;
    color: #6C757D;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
}

.insight-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #004085;
}

/* Metrics Summary */
.metrics-summary {
    margin: 4rem 0;
    text-align: center;
}

.metrics-summary h3 {
    color: #004085;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

.metric-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.1);
    border: 2px solid #F4F7FC;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #004085, #FF6600);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px rgba(0, 64, 133, 0.2);
    border-color: #FF6600;
}

.metric-card:hover::before {
    transform: scaleX(1);
}

.metric-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #004085, #FF6600);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    margin: 0 auto 1.5rem;
    box-shadow: 0 8px 20px rgba(0, 64, 133, 0.3);
}

.metric-content {
    position: relative;
    z-index: 1;
}

.metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #004085;
    margin-bottom: 0.5rem;
    display: block;
}

.metric-label {
    font-size: 1rem;
    color: #6C757D;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.metric-source {
    font-size: 0.8rem;
    color: #94a3b8;
    font-style: italic;
}

/* Tools Grid */
.tools-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

.tool-category {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.1);
    border: 2px solid #F4F7FC;
    transition: all 0.3s ease;
}

.tool-category:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 64, 133, 0.15);
}

.tool-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #F4F7FC;
}

.tool-header i {
    font-size: 1.5rem;
    color: #FF6600;
}

.tool-header h3 {
    color: #004085;
    margin: 0;
    font-size: 1.25rem;
    font-weight: bold;
}

.tools-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.tool-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.tool-name {
    font-weight: 600;
    color: #004085;
    font-size: 0.9rem;
    min-width: 100px;
}

.tool-proficiency {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.proficiency-bar {
    flex: 1;
    height: 8px;
    background: #F4F7FC;
    border-radius: 4px;
    overflow: hidden;
}

.proficiency-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s ease-in-out;
}

.proficiency-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6C757D;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 60px;
}

/* Sources Grid */
.sources-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    margin-top: 3rem;
}

.source-category h3 {
    color: #004085;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 3px solid #FF6600;
}

.sources-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.source-item {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 64, 133, 0.1);
    border: 2px solid #F4F7FC;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    display: flex;
    gap: 1rem;
}

.source-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 64, 133, 0.15);
    border-color: #FF6600;
    text-decoration: none;
    color: inherit;
}

.source-item.personal {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-color: #004085;
}

.source-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #004085, #FF6600);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    flex-shrink: 0;
}

.source-content h4 {
    color: #004085;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
}

.source-content p {
    color: #6C757D;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .tools-grid,
    .sources-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .dashboard-controls {
        flex-direction: column;
        align-items: center;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .chart-insights {
        flex-direction: column;
        gap: 1rem;
    }
    
    .tool-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .tool-proficiency {
        width: 100%;
    }
}
</style>
`;

// Add styles to document head
document.head.insertAdjacentHTML('beforeend', chartStyles);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.analyticsDashboard = new AnalyticsDashboard();
    console.log('Analytics Dashboard initialized successfully');
});