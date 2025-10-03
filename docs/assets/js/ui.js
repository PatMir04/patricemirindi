window.UI = {
    populateDropdowns: function() {
        const data = window.__GLOBAL_DATA__ || [];
        console.log('🔧 Populating dropdowns with data...');
        
        // Populate Countries
        const countries = Array.from(new Set(data.map(r => r.Country).filter(Boolean)))
            .sort()
            .filter(country => {
                // Filter out regional aggregates
                const regionals = ['Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'World', 
                                 'Sub-Saharan Africa', 'Eastern Africa', 'Western Africa', 
                                 'Northern Africa', 'Central Africa', 'Southern Africa',
                                 'Eastern Asia', 'Western Asia', 'Southern Asia', 'Central Asia',
                                 'Eastern Europe', 'Western Europe', 'Northern Europe', 'Southern Europe',
                                 'Central America', 'South America', 'Northern America', 'Caribbean'];
                return !regionals.some(regional => country.includes(regional));
            });
            
        this.populateSelect('countrySelect', countries);
        this.populateSelect('countryDropdown', countries);
        
        // Populate Indicators
        const indicators = Array.from(new Set(data.map(r => r.Indicator).filter(Boolean))).sort();
        this.populateSelect('indicatorSelect', indicators);
        this.populateSelect('indicatorDropdown', indicators);
        
        // Populate Years
        const years = Array.from(new Set(data.map(r => r.Year).filter(Boolean)))
            .sort((a, b) => +b - +a); // Newest first
        this.populateSelect('yearSelect', years);
        this.populateSelect('yearDropdown', years);
        
        console.log(`✅ Dropdowns populated: ${countries.length} countries, ${indicators.length} indicators, ${years.length} years`);
    },
    
    populateSelect: function(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Store current selection
        const currentValue = select.value;
        
        // Clear and populate
        select.innerHTML = '<option value="">-- Select --</option>';
        
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option;
            optElement.textContent = option;
            if (option === currentValue) {
                optElement.selected = true;
            }
            select.appendChild(optElement);
        });
    },
    
    getFilteredData: function() {
        const data = window.__GLOBAL_DATA__ || [];
        const country = document.getElementById('countrySelect')?.value || 
                       document.getElementById('countryDropdown')?.value;
        const indicator = document.getElementById('indicatorSelect')?.value || 
                         document.getElementById('indicatorDropdown')?.value;
        const year = document.getElementById('yearSelect')?.value || 
                    document.getElementById('yearDropdown')?.value;
        
        return data.filter(row => {
            return (!country || row.Country === country) &&
                   (!indicator || row.Indicator === indicator) &&
                   (!year || row.Year == year);
        });
    }
};
