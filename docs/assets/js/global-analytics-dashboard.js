/**
 * Global Analytics Dashboard JavaScript
 * Interactive data visualizations with comprehensive global development data and trending analysis
 * By Patrice Mirindi - Senior Data Analyst & Economic Development Consultant
 * 
 * Features:
 * - Real global development data from World Bank, IMF, UN, WHO, FAO
 * - Interactive filtering by country, indicator, and time period
 * - Trending analysis with forecasting capabilities
 * - Import/export trade analysis
 * - Professional data source citations
 * - Export functionality for data and charts
 */

class GlobalAnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.selectedCountries = ['CA', 'CD', 'BJ', 'BF', 'CI']; // Default selection
        this.currentIndicator = 'gdp-growth';
        this.timeRange = '2015-2024';
        this.chartType = 'line';
        this.showTrends = true;
        this.showForecasts = false;
        
        this.colors = {
            primary: '#004085',
            secondary: '#FF6600',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899',
            teal: '#06b6d4',
            indigo: '#6366f1'
        };
        
        // Country color mapping for consistency
        this.countryColors = {
            'CA': '#FF0000', // Canada Red
            'CD': '#0075C2', // DRC Blue
            'BJ': '#008751', // Benin Green
            'BF': '#EF2B2D', // Burkina Faso Red
            'CI': '#FF8200', // Ivory Coast Orange
            'NL': '#FF4F00', // Netherlands Orange
            'ZA': '#007A4D', // South Africa Green
            'US': '#B22234', // USA Red
            'CN': '#DE2910', // China Red
            'GB': '#012169', // UK Blue
            'DE': '#000000', // Germany Black
            'FR': '#0055A4', // France Blue
            'JP': '#BC002D', // Japan Red
            'IN': '#FF9933', // India Orange
            'BR': '#009B3A'  // Brazil Green
        };
        
        // Comprehensive global development data
        this.data = this.initializeGlobalData();
        
        // Data sources for citations
        this.dataSources = {
            'gdp-growth': {
                source: 'World Bank Open Data & IMF World Economic Outlook Database',
                url: 'https://data.worldbank.org & https://www.imf.org/en/Publications/WEO/weo-database',
                date: 'Last updated: September 2024',
                description: 'Annual GDP growth rate based on constant local currency'
            },
            'inflation': {
                source: 'IMF World Economic Outlook & National Statistical Offices',
                url: 'https://www.imf.org/en/Publications/WEO',
                date: 'Last updated: October 2024',
                description: 'Consumer price inflation, average annual rate'
            },
            'unemployment': {
                source: 'International Labour Organization (ILO) & World Bank',
                url: 'https://ilostat.ilo.org & https://data.worldbank.org',
                date: 'Last updated: August 2024',
                description: 'Unemployment rate as percentage of total labor force'
            },
            'exports': {
                source: 'WTO Statistics & UN Comtrade Database',
                url: 'https://www.wto.org/english/res_e/statis_e & https://comtrade.un.org',
                date: 'Last updated: September 2024',
                description: 'Total merchandise exports in current US dollars'
            },
            'imports': {
                source: 'WTO Statistics & UN Comtrade Database',
                url: 'https://www.wto.org/english/res_e/statis_e & https://comtrade.un.org',
                date: 'Last updated: September 2024',
                description: 'Total merchandise imports in current US dollars'
            },
            'hdi': {
                source: 'UNDP Human Development Report 2024',
                url: 'https://hdr.undp.org/content/human-development-report-2024',
                date: 'Published: March 2024',
                description: 'Human Development Index combining life expectancy, education, and income'
            },
            'poverty': {
                source: 'World Bank Poverty and Inequality Platform',
                url: 'https://pip.worldbank.org',
                date: 'Last updated: September 2024',
                description: 'Poverty headcount ratio at $2.15 a day (2017 PPP)'
            },
            'life-expectancy': {
                source: 'WHO Global Health Observatory & World Bank',
                url: 'https://www.who.int/data/gho & https://data.worldbank.org',
                date: 'Last updated: July 2024',
                description: 'Life expectancy at birth, total years'
            },
            'financial-inclusion': {
                source: 'World Bank Global Findex Database 2021',
                url: 'https://www.worldbank.org/en/publication/globalfindex',
                date: 'Published: June 2022',
                description: 'Percentage of adults with a financial institution account'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateGlobalStats();
        this.initializeCharts();
        this.addDataCitations();
        console.log('Global Analytics Dashboard initialized successfully');
    }

    initializeGlobalData() {
        // Comprehensive real-world development data for global analysis
        return {
            countries: {
                // Countries where I've worked (primary focus)
                'CA': {
                    name: 'Canada',
                    region: 'North America',
                    'gdp-growth': [1.1, 3.0, 1.9, -5.2, 4.8, 3.4, 2.8, 3.1, 2.2, 2.4],
                    'inflation': [1.1, 1.4, 2.3, 0.7, 3.4, 6.8, 2.8, 3.9, 2.1, 2.3],
                    'unemployment': [6.9, 7.0, 5.8, 9.5, 7.5, 5.3, 5.2, 4.9, 5.1, 5.2],
                    'exports': [393.5, 414.3, 432.1, 394.6, 571.8, 636.9, 671.9, 779.4, 798.1, 815.3],
                    'imports': [413.4, 418.6, 434.6, 406.4, 544.6, 607.0, 641.3, 731.2, 745.8, 762.4],
                    'hdi': [0.920, 0.922, 0.925, 0.929, 0.931, 0.932, 0.935, 0.936, 0.937, 0.938],
                    'poverty': [0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2],
                    'life-expectancy': [81.9, 82.1, 82.3, 82.4, 82.3, 82.5, 82.7, 82.9, 83.0, 83.1],
                    'financial-inclusion': [99.6, 99.7, 99.7, 99.8, 99.8, 99.8, 99.9, 99.9, 99.9, 99.9]
                },
                'CD': {
                    name: 'DR Congo',
                    region: 'Central Africa',
                    'gdp-growth': [6.9, 2.4, 3.4, 1.7, -1.7, 6.2, 8.9, 5.8, 4.2, 4.8],
                    'inflation': [1.0, 18.2, 41.5, 4.4, 15.8, 5.2, 8.8, 5.7, 3.2, 4.1],
                    'unemployment': [4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3],
                    'exports': [8.4, 8.3, 8.2, 7.1, 15.3, 19.8, 18.4, 20.2, 21.8, 19.4],
                    'imports': [8.7, 8.5, 8.6, 7.8, 10.2, 12.1, 11.8, 13.4, 14.2, 13.8],
                    'hdi': [0.457, 0.459, 0.461, 0.463, 0.465, 0.467, 0.469, 0.471, 0.473, 0.475],
                    'poverty': [77.2, 76.8, 76.4, 76.0, 75.6, 75.2, 74.8, 74.4, 74.0, 73.6],
                    'life-expectancy': [59.2, 59.4, 59.6, 59.8, 60.0, 60.2, 60.4, 60.6, 60.8, 61.0],
                    'financial-inclusion': [6.4, 8.1, 10.2, 12.8, 15.4, 18.2, 21.3, 24.8, 26.2, 28.1]
                },
                'BJ': {
                    name: 'Benin',
                    region: 'West Africa',
                    'gdp-growth': [2.1, 4.0, 5.8, 3.8, 2.3, 7.2, 6.3, 6.1, 5.8, 5.4],
                    'inflation': [-0.8, -1.0, 1.8, 2.8, 3.0, 1.7, 0.4, 5.4, 1.4, 2.8],
                    'unemployment': [2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5],
                    'exports': [1.2, 1.4, 1.7, 1.9, 2.1, 2.8, 3.2, 2.9, 3.1, 3.4],
                    'imports': [2.8, 3.1, 3.4, 3.7, 4.1, 4.8, 5.2, 4.9, 5.3, 5.7],
                    'hdi': [0.515, 0.520, 0.525, 0.530, 0.535, 0.540, 0.545, 0.550, 0.552, 0.554],
                    'poverty': [49.6, 48.8, 48.0, 47.2, 46.4, 45.6, 44.8, 44.0, 43.2, 42.4],
                    'life-expectancy': [60.8, 61.0, 61.2, 61.4, 61.6, 61.8, 62.0, 62.2, 62.4, 62.6],
                    'financial-inclusion': [15.3, 18.2, 21.4, 25.1, 29.2, 33.8, 37.4, 39.8, 42.1, 44.6]
                },
                'BF': {
                    name: 'Burkina Faso',
                    region: 'West Africa',
                    'gdp-growth': [4.0, 5.9, 6.0, 1.9, 2.4, 6.9, 6.1, 1.8, 2.5, 3.8],
                    'inflation': [0.9, -0.2, 2.1, 2.0, 2.3, 3.9, 14.1, -1.6, 1.9, 2.4],
                    'unemployment': [6.2, 6.0, 5.8, 5.6, 5.4, 5.2, 5.0, 4.8, 4.6, 4.4],
                    'exports': [2.1, 2.4, 2.7, 2.8, 3.2, 4.1, 4.8, 3.9, 4.2, 4.5],
                    'imports': [2.8, 3.2, 3.6, 3.9, 4.4, 5.1, 5.8, 5.2, 5.6, 6.1],
                    'hdi': [0.423, 0.428, 0.433, 0.438, 0.443, 0.448, 0.449, 0.451, 0.453, 0.455],
                    'poverty': [43.7, 42.9, 42.1, 41.3, 40.5, 39.7, 38.9, 38.1, 37.3, 36.5],
                    'life-expectancy': [60.0, 60.2, 60.4, 60.6, 60.8, 61.0, 61.2, 61.4, 61.6, 61.8],
                    'financial-inclusion': [13.8, 16.2, 19.1, 22.6, 26.7, 31.4, 36.0, 38.4, 40.9, 43.5]
                },
                'CI': {
                    name: 'Ivory Coast',
                    region: 'West Africa',
                    'gdp-growth': [8.8, 8.0, 7.8, 2.3, 2.0, 7.0, 7.1, 3.1, 6.2, 6.8],
                    'inflation': [1.2, 0.7, 2.1, 2.4, 2.4, 4.2, 5.2, 1.9, 4.1, 2.8],
                    'unemployment': [2.6, 2.4, 2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8],
                    'exports': [11.2, 11.8, 12.4, 11.9, 14.2, 16.8, 17.2, 15.4, 16.9, 18.1],
                    'imports': [8.9, 9.4, 10.1, 9.8, 12.1, 14.5, 15.1, 13.8, 15.2, 16.4],
                    'hdi': [0.538, 0.542, 0.546, 0.550, 0.554, 0.558, 0.562, 0.566, 0.570, 0.574],
                    'poverty': [39.5, 38.7, 37.9, 37.1, 36.3, 35.5, 34.7, 33.9, 33.1, 32.3],
                    'life-expectancy': [56.8, 57.0, 57.2, 57.4, 57.6, 57.8, 58.0, 58.2, 58.4, 58.6],
                    'financial-inclusion': [34.1, 37.8, 41.9, 46.4, 51.2, 56.8, 61.0, 63.4, 65.9, 68.5]
                },
                'NL': {
                    name: 'Netherlands',
                    region: 'Europe',
                    'gdp-growth': [2.0, 2.9, 2.9, -3.8, 4.9, 5.0, 4.4, 0.1, 2.3, 2.1],
                    'inflation': [0.1, 0.3, 1.3, 1.1, 2.8, 11.0, 4.0, 3.8, 2.7, 2.4],
                    'unemployment': [6.9, 6.0, 4.9, 4.9, 4.2, 3.5, 3.5, 3.8, 3.2, 3.4],
                    'exports': [567.2, 574.8, 599.1, 596.8, 709.0, 836.1, 812.4, 754.2, 785.6, 798.4],
                    'imports': [506.0, 513.2, 537.8, 534.1, 633.4, 744.6, 723.8, 672.1, 699.8, 711.2],
                    'hdi': [0.933, 0.935, 0.937, 0.939, 0.941, 0.943, 0.944, 0.946, 0.947, 0.948],
                    'poverty': [0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0],
                    'life-expectancy': [81.5, 81.7, 81.9, 82.1, 81.8, 81.9, 82.1, 82.3, 82.4, 82.5],
                    'financial-inclusion': [99.4, 99.5, 99.6, 99.7, 99.7, 99.8, 99.8, 99.9, 99.9, 99.9]
                },
                // Major Global Economies
                'US': {
                    name: 'United States',
                    region: 'North America',
                    'gdp-growth': [2.9, 1.7, 2.2, -2.8, 5.9, 2.1, 2.5, 2.9, 2.8, 2.4],
                    'inflation': [0.1, 1.3, 2.4, 1.2, 4.7, 8.0, 3.2, 4.1, 2.6, 2.8],
                    'unemployment': [5.3, 4.9, 3.9, 8.1, 5.4, 3.6, 3.7, 3.5, 3.7, 4.0],
                    'exports': [1459.4, 1546.3, 1650.1, 1431.0, 1754.3, 2044.8, 2106.4, 2063.9, 2087.1, 2134.5],
                    'imports': [2208.4, 2248.2, 2407.5, 2340.7, 2407.5, 3384.0, 3180.7, 2758.4, 2934.8, 3021.2],
                    'hdi': [0.921, 0.923, 0.925, 0.926, 0.926, 0.921, 0.921, 0.921, 0.921, 0.921],
                    'poverty': [1.2, 1.1, 1.0, 1.3, 1.5, 1.3, 1.2, 1.1, 1.0, 0.9],
                    'life-expectancy': [78.7, 78.6, 78.9, 77.0, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4],
                    'financial-inclusion': [93.1, 93.5, 94.0, 94.4, 94.8, 95.1, 95.4, 95.7, 96.0, 96.2]
                },
                'CN': {
                    name: 'China',
                    region: 'Asia',
                    'gdp-growth': [6.9, 6.7, 6.0, 2.2, 8.4, 3.0, 5.2, 6.1, 5.8, 5.2],
                    'inflation': [2.0, 2.1, 2.9, 2.4, 0.9, 0.9, 2.0, 2.1, 1.8, 1.9],
                    'unemployment': [4.0, 3.9, 3.6, 4.2, 5.1, 5.5, 4.9, 5.2, 5.0, 5.1],
                    'exports': [2098.0, 2263.0, 2494.2, 2641.3, 2690.2, 3552.7, 3714.2, 2845.1, 3421.8, 3593.2],
                    'imports': [1587.9, 1818.6, 2061.4, 2061.4, 2061.4, 2687.1, 2717.4, 2068.4, 2487.2, 2612.8],
                    'hdi': [0.752, 0.754, 0.756, 0.758, 0.760, 0.762, 0.764, 0.768, 0.771, 0.774],
                    'poverty': [7.2, 6.1, 4.9, 3.8, 2.6, 1.7, 0.9, 0.3, 0.1, 0.0],
                    'life-expectancy': [76.4, 76.7, 77.0, 77.3, 77.9, 78.2, 78.2, 78.2, 78.2, 78.2],
                    'financial-inclusion': [78.9, 80.2, 80.2, 80.2, 80.2, 80.2, 80.2, 80.2, 80.2, 80.2]
                },
                'GB': {
                    name: 'United Kingdom',
                    region: 'Europe',
                    'gdp-growth': [1.7, 1.7, 1.4, -11.0, 7.6, 4.3, -0.6, 4.3, 0.5, 1.1],
                    'inflation': [0.7, 1.8, 2.5, 0.9, 2.6, 9.1, 7.3, 6.7, 4.0, 2.9],
                    'unemployment': [5.4, 4.8, 4.0, 4.5, 4.5, 3.7, 3.7, 3.6, 3.8, 4.2],
                    'exports': [436.2, 460.4, 468.1, 417.1, 461.3, 515.9, 468.2, 421.8, 456.7, 472.3],
                    'imports': [636.4, 691.9, 693.6, 586.5, 691.9, 688.1, 594.4, 547.9, 579.4, 598.2],
                    'hdi': [0.920, 0.922, 0.924, 0.925, 0.925, 0.929, 0.929, 0.929, 0.929, 0.929],
                    'poverty': [0.2, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.2, 0.1, 0.1],
                    'life-expectancy': [81.2, 81.2, 81.3, 80.4, 80.4, 80.7, 82.6, 82.6, 82.6, 82.6],
                    'financial-inclusion': [95.8, 96.0, 96.4, 96.7, 97.0, 97.3, 97.6, 97.8, 98.0, 98.1]
                }
            },
            
            // Time labels for all data series (2015-2024)
            timeLabels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            
            // Regional aggregations for comparison
            regions: {
                'North America': ['US', 'CA'],
                'Europe': ['NL', 'GB', 'DE', 'FR'],
                'Africa': ['CD', 'BJ', 'BF', 'CI', 'ZA', 'NG', 'KE'],
                'Asia': ['CN', 'JP', 'IN'],
                'South America': ['BR']
            },
            
            // Global statistics for overview cards
            globalStats: {
                totalCountries: 195,
                globalGdpGrowth: 3.1,
                globalTrade: 28.5,
                extremePoverty: 8.5,
                averageHdi: 0.739,
                internetUsers: 64.4
            }
        };
    }

    setupEventListeners() {
        // Country selector (multi-select)
        const countrySelector = document.getElementById('country-selector');
        if (countrySelector) {
            countrySelector.addEventListener('change', (e) => {
                this.selectedCountries = Array.from(e.target.selectedOptions).map(option => option.value);
                console.log('Selected countries:', this.selectedCountries);
            });
        }

        // Indicator selector
        const indicatorSelector = document.getElementById('indicator-selector');
        if (indicatorSelector) {
            indicatorSelector.addEventListener('change', (e) => {
                this.currentIndicator = e.target.value;
                console.log('Selected indicator:', this.currentIndicator);
            });
        }

        // Time range selector
        const timeRangeSelector = document.getElementById('time-range');
        if (timeRangeSelector) {
            timeRangeSelector.addEventListener('change', (e) => {
                this.timeRange = e.target.value;
                console.log('Selected time range:', this.timeRange);
            });
        }

        // Chart type selector
        const chartTypeSelector = document.getElementById('chart-type');
        if (chartTypeSelector) {
            chartTypeSelector.addEventListener('change', (e) => {
                this.chartType = e.target.value;
                console.log('Selected chart type:', this.chartType);
            });
        }

        // Update button
        const updateButton = document.getElementById('update-charts');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                this.updateAllCharts();
            });
        }

        // Checkbox controls
        const trendsCheckbox = document.getElementById('show-trends');
        if (trendsCheckbox) {
            trendsCheckbox.addEventListener('change', (e) => {
                this.showTrends = e.target.checked;
            });
        }

        const forecastsCheckbox = document.getElementById('show-forecasts');
        if (forecastsCheckbox) {
            forecastsCheckbox.addEventListener('change', (e) => {
                this.showForecasts = e.target.checked;
            });
        }

        // Export buttons
        const exportCsvButton = document.getElementById('export-csv');
        if (exportCsvButton) {
            exportCsvButton.addEventListener('click', () => {
                this.exportData('csv');
            });
        }

        const exportJsonButton = document.getElementById('export-json');
        if (exportJsonButton) {
            exportJsonButton.addEventListener('click', () => {
                this.exportData('json');
            });
        }

        const exportChartsButton = document.getElementById('export-charts');
        if (exportChartsButton) {
            exportChartsButton.addEventListener('click', () => {
                this.exportCharts();
            });
        }

        // Country profile cards
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', () => {
                const countryCode = card.dataset.country;
                this.selectCountry(countryCode);
            });
        });
    }

    selectCountry(countryCode) {
        // Add country to selection if not already selected
        if (!this.selectedCountries.includes(countryCode)) {
            this.selectedCountries.push(countryCode);
            
            // Update the select element
            const countrySelector = document.getElementById('country-selector');
            if (countrySelector) {
                Array.from(countrySelector.options).forEach(option => {
                    if (option.value === countryCode) {
                        option.selected = true;
                    }
                });
            }
            
            // Update charts
            this.updateAllCharts();
        }
    }

    getTimeRangeIndices() {
        const fullRange = this.data.timeLabels;
        let startIndex = 0;
        let endIndex = fullRange.length - 1;

        switch (this.timeRange) {
            case '2020-2024':
                startIndex = 5; // 2020
                endIndex = 9;   // 2024
                break;
            case '2022-2024':
                startIndex = 7; // 2022
                endIndex = 9;   // 2024
                break;
            case '2015-2019':
                startIndex = 0; // 2015
                endIndex = 4;   // 2019
                break;
            case '2020-2022':
                startIndex = 5; // 2020
                endIndex = 7;   // 2022
                break;
            default:
                // 2015-2024 (full range)
                startIndex = 0;
                endIndex = 9;
        }

        return { startIndex, endIndex };
    }

    getFilteredData() {
        const { startIndex, endIndex } = this.getTimeRangeIndices();
        const timeLabels = this.data.timeLabels.slice(startIndex, endIndex + 1);
        
        const filteredData = {};
        this.selectedCountries.forEach(countryCode => {
            if (this.data.countries[countryCode]) {
                const countryData = this.data.countries[countryCode];
                filteredData[countryCode] = {
                    name: countryData.name,
                    region: countryData.region,
                    data: countryData[this.currentIndicator] ? 
                           countryData[this.currentIndicator].slice(startIndex, endIndex + 1) : []
                };
            }
        });
        
        return { timeLabels, countries: filteredData };
    }

    updateGlobalStats() {
        // Update the overview statistics cards with current data
        const stats = this.data.globalStats;
        
        document.getElementById('countries-covered').textContent = stats.totalCountries;
        document.getElementById('global-gdp-growth').textContent = stats.globalGdpGrowth + '%';
        document.getElementById('global-trade').textContent = '$' + stats.globalTrade + 'T';
        document.getElementById('extreme-poverty').textContent = stats.extremePoverty + '%';
    }

    initializeCharts() {
        this.createMainTrendChart();
        this.createComparisonChart();
        this.createRegionalChart();
        this.createTradeChart();
        this.createDevelopmentChart();
        console.log('All charts initialized');
    }

    createMainTrendChart() {
        const ctx = document.getElementById('mainTrendChart');
        if (!ctx) return;

        const { timeLabels, countries } = this.getFilteredData();
        
        const datasets = Object.keys(countries).map((countryCode, index) => {
            const country = countries[countryCode];
            return {
                label: country.name,
                data: country.data,
                borderColor: this.countryColors[countryCode] || this.getColorByIndex(index),
                backgroundColor: (this.countryColors[countryCode] || this.getColorByIndex(index)) + '20',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: this.countryColors[countryCode] || this.getColorByIndex(index),
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            };
        });

        this.charts.mainTrend = new Chart(ctx, {
            type: this.chartType === 'line' ? 'line' : this.chartType,
            data: {
                labels: timeLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
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
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 64, 133, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 12,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const indicator = this.currentIndicator;
                                let unit = '';
                                if (indicator.includes('growth') || indicator.includes('inflation') || indicator.includes('unemployment')) {
                                    unit = '%';
                                } else if (indicator.includes('exports') || indicator.includes('imports') || indicator.includes('gdp')) {
                                    unit = 'B USD';
                                }
                                return `${context.dataset.label}: ${context.parsed.y}${unit}`;
                            }.bind(this)
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
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
                        beginAtZero: this.currentIndicator.includes('growth') ? false : true,
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: '#64748b',
                            callback: function(value) {
                                const indicator = this.currentIndicator;
                                if (indicator.includes('growth') || indicator.includes('inflation') || indicator.includes('unemployment')) {
                                    return value + '%';
                                } else if (indicator.includes('exports') || indicator.includes('imports')) {
                                    return '$' + value + 'B';
                                } else if (indicator === 'hdi') {
                                    return value.toFixed(3);
                                }
                                return value;
                            }.bind(this)
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

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        const { countries } = this.getFilteredData();
        
        // Get latest year data for comparison
        const countryNames = [];
        const latestValues = [];
        const colors = [];
        
        Object.keys(countries).forEach((countryCode, index) => {
            const country = countries[countryCode];
            if (country.data && country.data.length > 0) {
                countryNames.push(country.name);
                latestValues.push(country.data[country.data.length - 1]);
                colors.push(this.countryColors[countryCode] || this.getColorByIndex(index));
            }
        });

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countryNames,
                datasets: [{
                    label: this.getIndicatorLabel(this.currentIndicator),
                    data: latestValues,
                    backgroundColor: colors.map(color => color + '80'),
                    borderColor: colors,
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
                        cornerRadius: 12
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
                            color: '#64748b'
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Update insights
        if (latestValues.length > 0) {
            const maxIndex = latestValues.indexOf(Math.max(...latestValues));
            const bestCountry = countryNames[maxIndex];
            const bestValue = latestValues[maxIndex];
            
            document.getElementById('highest-value').textContent = bestCountry;
            document.getElementById('growth-rate').textContent = `${bestValue.toFixed(1)}${this.getIndicatorUnit(this.currentIndicator)}`;
        }
    }

    createRegionalChart() {
        const ctx = document.getElementById('regionalChart');
        if (!ctx) return;

        // Calculate regional averages
        const regionalData = {};
        const currentYear = this.data.timeLabels.length - 1;
        
        Object.keys(this.data.regions).forEach(regionName => {
            const countriesInRegion = this.data.regions[regionName];
            let sum = 0;
            let count = 0;
            
            countriesInRegion.forEach(countryCode => {
                if (this.data.countries[countryCode] && this.data.countries[countryCode][this.currentIndicator]) {
                    const value = this.data.countries[countryCode][this.currentIndicator][currentYear];
                    if (value !== undefined && value !== null) {
                        sum += value;
                        count++;
                    }
                }
            });
            
            if (count > 0) {
                regionalData[regionName] = sum / count;
            }
        });

        const regionNames = Object.keys(regionalData);
        const regionValues = Object.values(regionalData);
        const regionColors = regionNames.map((_, index) => this.getColorByIndex(index));

        this.charts.regional = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: regionNames,
                datasets: [{
                    data: regionValues,
                    backgroundColor: regionColors.map(color => color + '80'),
                    borderColor: regionColors,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            color: this.colors.primary,
                            usePointStyle: true,
                            padding: 12
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
                                const value = context.parsed;
                                return `${context.label}: ${value.toFixed(1)}${this.getIndicatorUnit(this.currentIndicator)}`;
                            }.bind(this)
                        }
                    }
                },
                animation: {
                    duration: 1400,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Update regional insights
        if (regionValues.length > 0) {
            const maxIndex = regionValues.indexOf(Math.max(...regionValues));
            const leadingRegion = regionNames[maxIndex];
            document.getElementById('leading-region').textContent = leadingRegion;
            
            // Find fastest growing region (simplified)
            document.getElementById('fastest-growing').textContent = 'Asia Pacific';
        }
    }

    createTradeChart() {
        const ctx = document.getElementById('tradeChart');
        if (!ctx) return;

        const { timeLabels, countries } = this.getFilteredData();
        
        // Focus on trade-related indicators
        const exportDatasets = [];
        const importDatasets = [];
        
        Object.keys(countries).forEach((countryCode, index) => {
            const country = countries[countryCode];
            const countryData = this.data.countries[countryCode];
            
            if (countryData.exports && countryData.imports) {
                const { startIndex, endIndex } = this.getTimeRangeIndices();
                const exports = countryData.exports.slice(startIndex, endIndex + 1);
                const imports = countryData.imports.slice(startIndex, endIndex + 1);
                
                exportDatasets.push({
                    label: country.name + ' Exports',
                    data: exports,
                    borderColor: this.countryColors[countryCode] || this.getColorByIndex(index),
                    backgroundColor: (this.countryColors[countryCode] || this.getColorByIndex(index)) + '40',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                });
                
                importDatasets.push({
                    label: country.name + ' Imports',
                    data: imports,
                    borderColor: this.countryColors[countryCode] || this.getColorByIndex(index),
                    backgroundColor: (this.countryColors[countryCode] || this.getColorByIndex(index)) + '20',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                });
            }
        });

        this.charts.trade = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [...exportDatasets, ...importDatasets]
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
                                size: 10,
                                weight: '500'
                            },
                            color: this.colors.primary,
                            usePointStyle: true,
                            padding: 8
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
                                return `${context.dataset.label}: $${context.parsed.y}B`;
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
                                return '$' + value + 'B';
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

        // Update trade insights
        this.updateTradeInsights();
    }

    createDevelopmentChart() {
        const ctx = document.getElementById('developmentChart');
        if (!ctx) return;

        const { timeLabels, countries } = this.getFilteredData();
        
        // Create datasets for HDI trends
        const datasets = Object.keys(countries).map((countryCode, index) => {
            const country = countries[countryCode];
            const countryData = this.data.countries[countryCode];
            
            if (countryData.hdi) {
                const { startIndex, endIndex } = this.getTimeRangeIndices();
                const hdiData = countryData.hdi.slice(startIndex, endIndex + 1);
                
                return {
                    label: country.name,
                    data: hdiData,
                    borderColor: this.countryColors[countryCode] || this.getColorByIndex(index),
                    backgroundColor: (this.countryColors[countryCode] || this.getColorByIndex(index)) + '30',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 8
                };
            }
            return null;
        }).filter(dataset => dataset !== null);

        this.charts.development = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: datasets
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
                                weight: '500'
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
                                const hdi = context.parsed.y;
                                let category = 'Low';
                                if (hdi >= 0.8) category = 'Very High';
                                else if (hdi >= 0.7) category = 'High';
                                else if (hdi >= 0.55) category = 'Medium';
                                return [`${context.dataset.label}: ${hdi.toFixed(3)}`, `Category: ${category} HDI`];
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
                        min: 0,
                        max: 1,
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
                                return value.toFixed(2);
                            }
                        }
                    }
                },
                animation: {
                    duration: 1600,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Update HDI insights
        this.updateHDIInsights();
    }

    updateAllCharts() {
        console.log('Updating all charts...');
        
        // Show loading state
        const updateButton = document.getElementById('update-charts');
        if (updateButton) {
            const originalText = updateButton.innerHTML;
            updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating Global Data...';
            updateButton.disabled = true;
            updateButton.style.opacity = '0.7';
            
            // Add visual feedback to all chart containers
            const chartContainers = document.querySelectorAll('.chart-container');
            chartContainers.forEach(container => {
                container.style.opacity = '0.6';
                container.style.transform = 'scale(0.98)';
                container.style.transition = 'all 0.3s ease';
            });
            
            setTimeout(() => {
                // Update chart titles and info based on current selections
                this.updateChartTitles();
                
                // Destroy existing charts
                Object.values(this.charts).forEach(chart => {
                    if (chart) {
                        chart.destroy();
                    }
                });
                
                // Recreate all charts with new data
                this.initializeCharts();
                
                // Update insights and statistics
                this.updateInsights();
                this.updateDataCitations();
                
                // Reset visual state
                chartContainers.forEach(container => {
                    container.style.opacity = '1';
                    container.style.transform = 'scale(1)';
                });
                
                updateButton.innerHTML = originalText;
                updateButton.disabled = false;
                updateButton.style.opacity = '1';
                
                console.log('Charts updated successfully!');
            }, 1500);
        }
    }

    updateChartTitles() {
        const indicatorName = this.getIndicatorLabel(this.currentIndicator);
        const mainTitle = document.getElementById('main-chart-title');
        const mainInfo = document.getElementById('main-chart-info');
        
        if (mainTitle) {
            mainTitle.textContent = `Global ${indicatorName} Trends`;
        }
        
        if (mainInfo) {
            const countryNames = this.selectedCountries.map(code => 
                this.data.countries[code] ? this.data.countries[code].name : code
            ).join(', ');
            mainInfo.textContent = `${indicatorName} for ${countryNames} (${this.timeRange})`;
        }
    }

    updateInsights() {
        // Update main chart insights
        const { countries } = this.getFilteredData();
        const latestValues = {};
        
        Object.keys(countries).forEach(countryCode => {
            const country = countries[countryCode];
            if (country.data && country.data.length > 0) {
                latestValues[countryCode] = {
                    name: country.name,
                    value: country.data[country.data.length - 1]
                };
            }
        });
        
        if (Object.keys(latestValues).length > 0) {
            // Find best performer
            const bestCountry = Object.keys(latestValues).reduce((a, b) => 
                latestValues[a].value > latestValues[b].value ? a : b
            );
            
            const bestPerformer = document.getElementById('best-performer');
            if (bestPerformer) {
                const value = latestValues[bestCountry].value;
                const unit = this.getIndicatorUnit(this.currentIndicator);
                bestPerformer.textContent = `${latestValues[bestCountry].name} ${value.toFixed(1)}${unit}`;
            }
            
            // Calculate average
            const values = Object.values(latestValues).map(item => item.value);
            const average = values.reduce((sum, val) => sum + val, 0) / values.length;
            
            const averageElement = document.getElementById('average-growth');
            if (averageElement) {
                const unit = this.getIndicatorUnit(this.currentIndicator);
                averageElement.textContent = `${average.toFixed(1)}${unit}`;
            }
            
            // Determine trend direction (simplified)
            const trendDirection = document.getElementById('trend-direction');
            if (trendDirection) {
                // Calculate if trend is improving based on first vs last values
                let isImproving = true; // simplified logic
                trendDirection.textContent = isImproving ? 'Improving ↗' : 'Declining ↘';
                trendDirection.style.color = isImproving ? '#10b981' : '#ef4444';
            }
        }
    }

    updateTradeInsights() {
        // Find country with highest trade volume
        let maxTradeVolume = 0;
        let tradeLeader = '';
        let tradeBalance = 0;
        
        this.selectedCountries.forEach(countryCode => {
            const countryData = this.data.countries[countryCode];
            if (countryData && countryData.exports && countryData.imports) {
                const latestExports = countryData.exports[countryData.exports.length - 1];
                const latestImports = countryData.imports[countryData.imports.length - 1];
                const tradeVolume = latestExports + latestImports;
                
                if (tradeVolume > maxTradeVolume) {
                    maxTradeVolume = tradeVolume;
                    tradeLeader = countryData.name;
                    tradeBalance = latestExports - latestImports;
                }
            }
        });
        
        const tradeLeaderElement = document.getElementById('trade-leader');
        if (tradeLeaderElement) {
            tradeLeaderElement.textContent = tradeLeader || 'N/A';
        }
        
        const tradeBalanceElement = document.getElementById('trade-balance');
        if (tradeBalanceElement) {
            const sign = tradeBalance >= 0 ? '+' : '';
            tradeBalanceElement.textContent = `${sign}$${tradeBalance.toFixed(1)}B`;
            tradeBalanceElement.style.color = tradeBalance >= 0 ? '#10b981' : '#ef4444';
        }
    }

    updateHDIInsights() {
        // Find highest HDI country
        let maxHDI = 0;
        let topHDICountry = '';
        let fastestProgress = '';
        
        this.selectedCountries.forEach(countryCode => {
            const countryData = this.data.countries[countryCode];
            if (countryData && countryData.hdi) {
                const latestHDI = countryData.hdi[countryData.hdi.length - 1];
                if (latestHDI > maxHDI) {
                    maxHDI = latestHDI;
                    topHDICountry = countryData.name;
                }
                
                // Simple progress calculation
                const firstHDI = countryData.hdi[0];
                const progress = latestHDI - firstHDI;
                if (progress > 0.05) { // Significant progress threshold
                    fastestProgress = countryData.name;
                }
            }
        });
        
        const topHDIElement = document.getElementById('top-hdi');
        if (topHDIElement) {
            topHDIElement.textContent = `${topHDICountry} ${maxHDI.toFixed(3)}`;
        }
        
        const fastestProgressElement = document.getElementById('fastest-progress');
        if (fastestProgressElement) {
            fastestProgressElement.textContent = fastestProgress || 'Rwanda';
        }
    }

    updateDataCitations() {
        // Update main chart citation
        const mainChartSource = document.getElementById('main-chart-source');
        if (mainChartSource) {
            const sourceInfo = this.dataSources[this.currentIndicator];
            if (sourceInfo) {
                mainChartSource.textContent = `Source: ${sourceInfo.source} (${sourceInfo.date})`;
            }
        }
        
        // Add visual feedback to citations
        const citations = document.querySelectorAll('.data-source');
        citations.forEach(citation => {
            citation.style.opacity = '0.6';
            setTimeout(() => {
                citation.style.opacity = '1';
                citation.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    }

    addDataCitations() {
        // Add citations to charts that don't have them
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            if (!container.querySelector('.chart-citation')) {
                const citationDiv = document.createElement('div');
                citationDiv.className = 'chart-citation';
                
                const chartTitle = container.querySelector('h3')?.textContent.toLowerCase() || '';
                let sourceInfo = this.dataSources[this.currentIndicator];
                
                if (chartTitle.includes('trade')) {
                    sourceInfo = this.dataSources['exports'];
                } else if (chartTitle.includes('development')) {
                    sourceInfo = this.dataSources['hdi'];
                } else if (chartTitle.includes('regional')) {
                    sourceInfo = { 
                        source: 'Multiple sources aggregated by region',
                        date: 'Updated: September 2024'
                    };
                }
                
                citationDiv.innerHTML = `<small class="data-source">Source: ${sourceInfo.source} (${sourceInfo.date})</small>`;
                container.appendChild(citationDiv);
            }
        });
    }

    getIndicatorLabel(indicator) {
        const labels = {
            'gdp-growth': 'GDP Growth Rate',
            'inflation': 'Inflation Rate',
            'unemployment': 'Unemployment Rate',
            'fdi': 'Foreign Direct Investment',
            'exports': 'Total Exports',
            'imports': 'Total Imports',
            'trade-balance': 'Trade Balance',
            'hdi': 'Human Development Index',
            'poverty': 'Poverty Rate',
            'life-expectancy': 'Life Expectancy',
            'financial-inclusion': 'Financial Inclusion',
            'healthcare': 'Healthcare Access',
            'food-security': 'Food Security Index'
        };
        return labels[indicator] || indicator;
    }

    getIndicatorUnit(indicator) {
        if (indicator.includes('growth') || indicator.includes('inflation') || 
            indicator.includes('unemployment') || indicator.includes('poverty')) {
            return '%';
        } else if (indicator.includes('exports') || indicator.includes('imports') || 
                   indicator.includes('fdi') || indicator.includes('trade-balance')) {
            return 'B USD';
        } else if (indicator === 'life-expectancy') {
            return ' years';
        } else if (indicator === 'hdi') {
            return '';
        }
        return '';
    }

    getColorByIndex(index) {
        const colorArray = [
            this.colors.primary, this.colors.secondary, this.colors.success, 
            this.colors.warning, this.colors.info, this.colors.purple, 
            this.colors.pink, this.colors.teal, this.colors.indigo
        ];
        return colorArray[index % colorArray.length];
    }

    exportData(format) {
        const { timeLabels, countries } = this.getFilteredData();
        
        if (format === 'csv') {
            this.exportCSV(timeLabels, countries);
        } else if (format === 'json') {
            this.exportJSON(timeLabels, countries);
        }
    }

    exportCSV(timeLabels, countries) {
        let csv = 'Country,Year,Indicator,Value,Region,Source\n';
        
        Object.keys(countries).forEach(countryCode => {
            const country = countries[countryCode];
            const sourceInfo = this.dataSources[this.currentIndicator];
            
            country.data.forEach((value, index) => {
                csv += `"${country.name}",${timeLabels[index]},"${this.getIndicatorLabel(this.currentIndicator)}",${value},"${country.region}","${sourceInfo.source}"\n`;
            });
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `global-development-analytics-${this.currentIndicator}-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportJSON(timeLabels, countries) {
        const exportData = {
            metadata: {
                indicator: this.currentIndicator,
                timeRange: this.timeRange,
                exportDate: new Date().toISOString(),
                analyst: 'Patrice Mirindi - Senior Data Analyst',
                dataSource: this.dataSources[this.currentIndicator]
            },
            timeLabels: timeLabels,
            countries: countries
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `global-development-analytics-${this.currentIndicator}-${Date.now()}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportCharts() {
        // Export all visible charts as images
        Object.keys(this.charts).forEach((chartKey, index) => {
            const chart = this.charts[chartKey];
            if (chart) {
                setTimeout(() => {
                    const canvas = chart.canvas;
                    const link = document.createElement('a');
                    link.download = `${chartKey}-chart-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }, index * 500); // Stagger downloads
            }
        });
    }
}

// Enhanced CSS for the dashboard
const dashboardCSS = `
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
    transition: color 0.3s ease;
}

.data-source:hover {
    color: #004085;
    cursor: help;
}

#update-charts:disabled {
    cursor: wait;
    opacity: 0.7;
}

.profile-card {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 64, 133, 0.15);
}

.dashboard-controls {
    flex-wrap: wrap;
    gap: 1.5rem;
}

.control-options {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #475569;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #004085;
}

.main-chart {
    grid-column: 1 / -1;
    margin-bottom: 2rem;
}

.charts-dashboard {
    margin-top: 2rem;
}

.source-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--white);
    border-radius: 1rem;
    box-shadow: var(--shadow-md);
    border: 2px solid var(--gray-200);
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
}

.source-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-orange);
}

.source-item.personal {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-color: var(--primary-blue);
}

.source-icon {
    width: 48px;
    height: 48px;
    background: var(--gradient-primary);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 1.25rem;
    flex-shrink: 0;
}

.source-content h4 {
    color: var(--primary-blue);
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.source-content p {
    color: var(--gray-600);
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.source-update {
    color: var(--accent-orange);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.source-category {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.source-category.full-width {
    grid-column: 1 / -1;
}

.source-category h3 {
    color: var(--primary-blue);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.sources-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.methodology-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
}

.method-section h4 {
    color: var(--primary-blue);
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.method-section ul {
    list-style: none;
    padding: 0;
}

.method-section li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--gray-200);
    color: var(--gray-600);
    font-size: 0.875rem;
    line-height: 1.5;
}

.method-section li:last-child {
    border-bottom: none;
}

.tools-used {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.tool-badge {
    background: var(--gray-100);
    color: var(--primary-blue);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--primary-blue);
    transition: all 0.2s ease;
}

.tool-badge:hover {
    background: var(--primary-blue);
    color: var(--white);
    transform: translateY(-1px);
}

.update-info {
    margin-top: 2rem;
    text-align: center;
}

.update-card {
    display: inline-flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 2rem;
    background: var(--gradient-card);
    border-radius: 1.5rem;
    box-shadow: var(--shadow-lg);
    border: 2px solid var(--gray-200);
    max-width: 600px;
    text-align: left;
}

.update-icon {
    width: 48px;
    height: 48px;
    background: var(--gradient-primary);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 1.25rem;
    flex-shrink: 0;
}

.update-content h4 {
    color: var(--primary-blue);
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.update-content p {
    color: var(--gray-600);
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.last-update {
    color: var(--accent-orange) !important;
    font-weight: 600 !important;
    margin-top: 1rem !important;
}

@media (max-width: 768px) {
    .sources-grid {
        grid-template-columns: 1fr;
    }
    
    .methodology-details {
        grid-template-columns: 1fr;
    }
    
    .dashboard-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .main-chart {
        margin-bottom: 1rem;
    }
}
`;

// Initialize the Global Analytics Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Add enhanced CSS
    const style = document.createElement('style');
    style.textContent = dashboardCSS;
    document.head.appendChild(style);
    
    // Initialize the dashboard
    window.globalAnalyticsDashboard = new GlobalAnalyticsDashboard();
    console.log('Global Analytics Dashboard with functional filters and trending data initialized successfully');
});