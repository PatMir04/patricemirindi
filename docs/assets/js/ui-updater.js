window.UI_UPDATER = {
    populateCountrySelector: function() {
        const data = window.__GLOBAL_DATA__ || [];
        const countries = Array.from(new Set(data.map(r => r.Country))).sort();
        
        const countrySelector = document.getElementById('country-selector');
        if (!countrySelector) return;
        
        // Keep existing structure but add new countries
        const existingCountries = Array.from(countrySelector.options).map(opt => opt.value);
        const newCountries = countries.filter(country => 
            !existingCountries.includes(country) && country
        );
        
        if (newCountries.length > 0) {
            const newGroup = document.createElement('optgroup');
            newGroup.label = 'Additional Countries (From Data)';
            
            newCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                newGroup.appendChild(option);
            });
            
            countrySelector.appendChild(newGroup);
        }
        
        console.log(`✅ Added ${newCountries.length} new countries to selector`);
    },
    
    populateIndicatorSelector: function() {
        const data = window.__GLOBAL_DATA__ || [];
        const indicators = Array.from(new Set(data.map(r => r.Indicator))).sort();
        
        const indicatorSelector = document.getElementById('indicator-selector');
        if (!indicatorSelector) return;
        
        const existingOptions = Array.from(indicatorSelector.options).map(opt => opt.value);
        const newIndicators = indicators.filter(indicator => 
            !existingOptions.includes(indicator) && indicator
        );
        
        if (newIndicators.length > 0) {
            const newGroup = document.createElement('optgroup');
            newGroup.label = 'Indicators from CSV Data';
            
            newIndicators.forEach(indicator => {
                const option = document.createElement('option');
                option.value = indicator;
                option.textContent = indicator;
                newGroup.appendChild(option);
            });
            
            indicatorSelector.appendChild(newGroup);
        }
        
        console.log(`✅ Added ${newIndicators.length} new indicators to selector`);
    },
    
    updateGlobalStats: function() {
        const data = window.__GLOBAL_DATA__ || [];
        const countriesCount = new Set(data.map(r => r.Country)).size;
        
        const countriesCoveredEl = document.getElementById('countries-covered');
        if (countriesCoveredEl) {
            countriesCoveredEl.textContent = countriesCount;
        }
        
        console.log(`✅ Updated stats: ${countriesCount} countries covered`);
    }
};
