/**
 * UI Updater for Global Development Analytics Dashboard
 * Updates dropdowns and UI elements with loaded CSV data
 * Integrates seamlessly with existing dashboard design
 */

window.UI_UPDATER = {
    
    populateIndicatorSelector: function() {
        console.log('🔄 Starting indicator population...');
        
        const data = window.__GLOBAL_DATA__ || [];
        console.log('Data available:', data.length, 'rows');
        
        if (data.length === 0) {
            console.log('⚠️ No data available to populate indicators');
            return;
        }
        
        const indicators = Array.from(new Set(data.map(r => r.Indicator))).sort();
        console.log('Indicators found:', indicators);
        
        const indicatorSelector = document.getElementById('indicator-selector');
        if (!indicatorSelector) {
            console.error('❌ Could not find indicator-selector element');
            return;
        }
        
        // Get existing options to avoid duplicates
        const existingOptions = Array.from(indicatorSelector.options).map(opt => opt.value);
        console.log('Existing options:', existingOptions);
        
        // Filter out indicators that already exist
        const newIndicators = indicators.filter(indicator => 
            !existingOptions.includes(indicator) && indicator
        );
        
        console.log('New indicators to add:', newIndicators);
        
        if (newIndicators.length > 0) {
            // Create new optgroup for CSV data indicators
            const newGroup = document.createElement('optgroup');
            newGroup.label = 'CSV Data Indicators';
            
            newIndicators.forEach(indicator => {
                const option = document.createElement('option');
                option.value = indicator;
                option.textContent = indicator;
                newGroup.appendChild(option);
                console.log('➕ Added indicator:', indicator);
            });
            
            indicatorSelector.appendChild(newGroup);
            console.log('✅ Added new indicator group to selector');
        } else {
            console.log('ℹ️ No new indicators to add');
        }
    },
    
    populateCountrySelector: function() {
        console.log('🔄 Starting country population...');
        
        const data = window.__GLOBAL_DATA__ || [];
        console.log('Data available:', data.length, 'rows');
        
        if (data.length === 0) {
            console.log('⚠️ No data available to populate countries');
            return;
        }
        
        const countries = Array.from(new Set(data.map(r => r.Country))).sort();
        console.log('Countries found:', countries.length);
        
        const countrySelector = document.getElementById('country-selector');
        if (!countrySelector) {
            console.error('❌ Could not find country-selector element');
            return;
        }
        
        // Get existing country values from all optgroups
        const existingCountries = Array.from(countrySelector.options).map(opt => {
            // Map country codes back to full names for comparison
            return this.getCountryNameFromCode(opt.value) || opt.textContent;
        });
        
        console.log('Existing countries:', existingCountries.length);
        
        // Filter out countries that already exist
        const newCountries = countries.filter(country => 
            !existingCountries.includes(country) && country
        );
        
        console.log('New countries to add:', newCountries.length, newCountries.slice(0, 10));
        
        if (newCountries.length > 0) {
            // Create new optgroup for CSV data countries
            const newGroup = document.createElement('optgroup');
            newGroup.label = `Additional Countries from CSV Data (${newCountries.length})`;
            
            newCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country; // Use full country name as value for CSV data
                option.textContent = country;
                newGroup.appendChild(option);
            });
            
            countrySelector.appendChild(newGroup);
            console.log(`✅ Added ${newCountries.length} new countries to selector`);
        } else {
            console.log('ℹ️ No new countries to add');
        }
    },
    
    updateGlobalStats: function() {
        console.log('📈 Updating global statistics...');
        
        const data = window.__GLOBAL_DATA__ || [];
        
        if (data.length === 0) {
            console.log('⚠️ No data available for stats update');
            return;
        }
        
        // Update countries covered count
        const countriesCount = new Set(data.map(r => r.Country)).size;
        const countriesCoveredEl = document.getElementById('countries-covered');
        if (countriesCoveredEl) {
            const oldCount = countriesCoveredEl.textContent;
            countriesCoveredEl.textContent = countriesCount;
            console.log(`✅ Updated countries count: ${oldCount} → ${countriesCount}`);
        }
        
        // Log statistics
        const indicatorsCount = new Set(data.map(r => r.Indicator)).size;
        const yearsRange = {
            min: Math.min(...data.map(r => r.Year).filter(y => y > 0)),
            max: Math.max(...data.map(r => r.Year).filter(y => y > 0))
        };
        
        console.log(`📊 Global stats updated:`);
        console.log(`   🌍 Countries: ${countriesCount}`);
        console.log(`   📈 Indicators: ${indicatorsCount}`);
        console.log(`   📅 Years: ${yearsRange.min} - ${yearsRange.max}`);
        console.log(`   📊 Total records: ${data.length}`);
    },
    
    // Helper function to map country codes to names (from your existing dropdown)
    getCountryNameFromCode: function(code) {
        const mapping = {
            'CA': 'Canada',
            'CD': 'Democratic Republic of Congo', 
            'BJ': 'Benin',
            'BF': 'Burkina Faso',
            'CI': 'Ivory Coast',
            'GH': 'Ghana',
            'NG': 'Nigeria',
            'NL': 'Netherlands',
            'ZA': 'South Africa',
            'US': 'United States',
            'CN': 'China',
            'DE': 'Germany',
            'JP': 'Japan',
            'GB': 'United Kingdom',
            'FR': 'France',
            'IN': 'India',
            'BR': 'Brazil',
            'KE': 'Kenya',
            'EG': 'Egypt',
            'MA': 'Morocco',
            'RW': 'Rwanda',
            'ET': 'Ethiopia',
            'TZ': 'Tanzania',
            'UG': 'Uganda',
            'SN': 'Senegal'
        };
        return mapping[code];
    },
    
    // Get all loaded data for use by dashboard
    getLoadedData: function() {
        return window.__GLOBAL_DATA__ || [];
    },
    
    // Get filtered data based on current selections
    getFilteredData: function() {
        const data = this.getLoadedData();
        
        // Get current selections
        const countrySelector = document.getElementById('country-selector');
        const indicatorSelector = document.getElementById('indicator-selector');
        const timeSelector = document.getElementById('time-range');
        
        if (!countrySelector || !indicatorSelector) {
            return data;
        }
        
        const selectedCountries = Array.from(countrySelector.selectedOptions).map(opt => {
            // Convert codes to names for comparison with CSV data
            return this.getCountryNameFromCode(opt.value) || opt.value;
        });
        
        const selectedIndicator = indicatorSelector.value;
        const selectedTimeRange = timeSelector ? timeSelector.value : '2015-2024';
        
        // Parse time range
        const [startYear, endYear] = selectedTimeRange.split('-').map(y => parseInt(y));
        
        // Filter data
        return data.filter(row => {
            const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(row.Country);
            const indicatorMatch = !selectedIndicator || row.Indicator === selectedIndicator;
            const yearMatch = row.Year >= startYear && row.Year <= endYear;
            
            return countryMatch && indicatorMatch && yearMatch;
        });
    }
};