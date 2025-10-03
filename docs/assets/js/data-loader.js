window.DATA_LOADER = {
    RAW_ROOT: "https://raw.githubusercontent.com/PatMir04/patricemirindi/main/data/uploads/",
    API_URL: "https://api.github.com/repos/PatMir04/patricemirindi/contents/data/uploads",
    mergedRows: [],
    
    async loadAllCSVs() {
        try {
            console.log('🔄 Loading all CSV files from GitHub...');
            
            const response = await fetch(this.API_URL);
            const files = await response.json();
            const csvFiles = files.filter(f => f.name.endsWith('.csv'));
            
            console.log(`📂 Found ${csvFiles.length} CSV files`);
            
            let allRows = [];
            
            for (let file of csvFiles) {
                console.log(`📥 Loading ${file.name}...`);
                const csvText = await fetch(this.RAW_ROOT + file.name).then(r => r.text());
                
                const parsed = Papa.parse(csvText, {
                    header: true, 
                    skipEmptyLines: true,
                    transformHeader: function(h) {
                        return h.trim();
                    }
                });
                
                const validRows = parsed.data.filter(row => 
                    row.Country && row.Year && row.Indicator && row.Value
                ).map(row => ({
                    Country: row.Country.trim(),
                    Year: parseInt(row.Year),
                    Value: parseFloat(row.Value) || 0,
                    Indicator: row.Indicator.trim(),
                    Unit: row.Unit ? row.Unit.trim() : '',
                    source_file: file.name
                }));
                
                allRows.push(...validRows);
                console.log(`✅ ${file.name}: ${validRows.length} valid rows loaded`);
            }
            
            const regionalFilters = [
                'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'World',
                'Sub-Saharan Africa', 'Eastern Africa', 'Western Africa', 
                'Northern Africa', 'Central Africa', 'Southern Africa',
                'European Union', 'OECD'
            ];
            
            const countryRows = allRows.filter(row => 
                !regionalFilters.some(region => row.Country.includes(region))
            );
            
            const uniqueRows = [];
            const seen = new Set();
            
            countryRows.forEach(row => {
                const key = `${row.Country}_${row.Year}_${row.Indicator}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueRows.push(row);
                }
            });
            
            this.mergedRows = uniqueRows;
            window.__GLOBAL_DATA__ = uniqueRows;
            
            console.log(`🎉 Successfully loaded ${uniqueRows.length} unique records`);
            console.log(`📊 Countries: ${new Set(uniqueRows.map(r => r.Country)).size}`);
            console.log(`📈 Indicators: ${new Set(uniqueRows.map(r => r.Indicator)).size}`);
            
            return uniqueRows;
            
        } catch (error) {
            console.error('❌ Error loading CSV files:', error);
            return [];
        }
    }
};
