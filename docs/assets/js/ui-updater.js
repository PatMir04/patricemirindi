window.UI_UPDATER = {
    populateIndicatorSelector: function() {
        console.log('🔄 Starting indicator population...');
        
        const data = window.__GLOBAL_DATA__ || [];
        console.log('Data available:', data.length, 'rows');
        
        if (data.length === 0) {
            console.log('⚠️ No data available to populate indicators');
            return;
        }
        
        const indicators = Array.from(new Set(data.map(r => r.Indicator).filter(Boolean))).sort();
        console.log('Indicators found:', indicators);
        
        // Try to find the indicator selector - check multiple possible IDs
        const possibleSelectors = [
            'indicator-selector',
            'indicator-select', 
            'indicatorSelector',
            'indicatorSelect'
        ];
        
        let indicatorSelector = null;
        
        // Also try to find by class or other attributes
        for (let id of possibleSelectors) {
            indicatorSelector = document.getElementById(id);
            if (indicatorSelector) {
                console.log('✅ Found indicator selector with ID:', id);
                break;
            }
        }
        
        // If not found by ID, try to find select elements that might be the indicator dropdown
        if (!indicatorSelector) {
            const allSelects = document.querySelectorAll('select');
            console.log('All select elements found:', allSelects.length);
            
            // Look for select that contains indicator-related options
            for (let select of allSelects) {
                const options = Array.from(select.options).map(opt => opt.value.toLowerCase());
                if (options.some(opt => opt.includes('gdp') || opt.includes('inflation') || opt.includes('development'))) {
                    indicatorSelector = select;
                    console.log('✅ Found indicator selector by content analysis');
                    break;
                }
            }
        }
        
        if (!indicatorSelector) {
            console.error('❌ Could not find indicator selector element');
            console.log('Available select elements:', document.querySelectorAll('select'));
            return;
        }
        
        const existingOptions = Array.from(indicatorSelector.options).map(opt => opt.value);
        console.log('Existing indicator options:', existingOptions);
        
        const newIndicators = indicators.filter(indicator => 
            !existingOptions.includes(indicator) && indicator
        );
        
        console.log('New indicators to add:', newIndicators);
        
        if (newIndicators.length > 0) {
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
            console.log('✅ Successfully added', newIndicators.length, 'new indicators');
        } else {
            console.log('ℹ️ No new indicators to add - they may already exist');
        }
    },
    
    populateCountrySelector: function() {
        console.log('🔄 Starting country population...');
        
        const data = window.__GLOBAL_DATA__ || [];
        if (data.length === 0) {
            console.log('⚠️ No data available to populate countries');
            return;
        }
        
        const countries = Array.from(new Set(data.map(r => r.Country).filter(Boolean))).sort();
        console.log('Countries found:', countries.length);
        
        // Find country selector
        const possibleIds = ['country-selector', 'country-select', 'countrySelector'];
        let countrySelector = null;
        
        for (let id of possibleIds) {
            countrySelector = document.getElementById(id);
            if (countrySelector) {
                console.log('✅ Found country selector with ID:', id);
                break;
            }
        }
        
        if (!countrySelector) {
            console.log('⚠️ Country selector not found, skipping country update');
            return;
        }
        
        const existingCountries = Array.from(countrySelector.options).map(opt => opt.value);
        const newCountries = countries.filter(country => 
            !existingCountries.includes(country) && country
        );
        
        if (newCountries.length > 0) {
            const newGroup = document.createElement('optgroup');
            newGroup.label = 'Additional Countries (From CSV Data)';
            
            newCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                newGroup.appendChild(option);
            });
            
            countrySelector.appendChild(newGroup);
            console.log('✅ Added', newCountries.length, 'new countries');
        }
    },
    
    updateGlobalStats: function() {
        const data = window.__GLOBAL_DATA__ || [];
        const countriesCount = new Set(data.map(r => r.Country)).size;
        
        console.log('📊 Updating global stats:', countriesCount, 'countries');
        
        // Try to find and update countries covered element
        const possibleIds = ['countries-covered', 'total-countries', 'country-count'];
        for (let id of possibleIds) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = countriesCount;
                console.log('✅ Updated', id, 'to', countriesCount);
            }
        }
    }
};
