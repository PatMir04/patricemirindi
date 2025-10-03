/**
 * Automatic CSV Data Loader for Global Development Analytics Dashboard
 * Loads all CSV files from data/uploads/ automatically
 * No manual import needed - just refresh dashboard
 */

window.DATA_LOADER = {
    RAW_ROOT: "https://raw.githubusercontent.com/PatMir04/patricemirindi/main/data/uploads/",
    API_URL: "https://api.github.com/repos/PatMir04/patricemirindi/contents/data/uploads",
    mergedRows: [],
    
    async loadAllCSVs() {
        try {
            console.log('📥 Loading all CSV files from GitHub...');
            
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const files = await response.json();
            const csvFiles = files.filter(f => f.name.endsWith('.csv'));
            
            console.log(`📂 Found ${csvFiles.length} CSV files to process`);
            
            if (csvFiles.length === 0) {
                console.log('⚠️ No CSV files found in data/uploads/');
                return [];
            }
            
            let allRows = [];
            
            // Process each CSV file
            for (let file of csvFiles) {
                try {
                    console.log(`📄 Processing ${file.name}...`);
                    
                    // Fetch CSV content
                    const csvResponse = await fetch(this.RAW_ROOT + file.name);
                    const csvText = await csvResponse.text();
                    
                    // Parse CSV
                    const parsed = Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                        transformHeader: function(header) {
                            return header.trim(); // Clean header names
                        },
                        transform: function(value, header) {
                            // Clean values
                            if (value && typeof value === 'string') {
                                return value.trim();
                            }
                            return value;
                        }
                    });
                    
                    // Validate and clean rows
                    const validRows = parsed.data
                        .filter(row => row.Country && row.Year && row.Indicator && row.Value)
                        .filter(row => {
                            // Filter out regional aggregates
                            const regionals = ['Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'World',
                                             'Sub-Saharan Africa', 'Eastern Africa', 'Western Africa', 
                                             'Northern Africa', 'Central Africa', 'Southern Africa',
                                             'Eastern Asia', 'Western Asia', 'Southern Asia', 'Central Asia',
                                             'Eastern Europe', 'Western Europe', 'Northern Europe', 'Southern Europe',
                                             'Central America', 'South America', 'Northern America', 'Caribbean',
                                             'European Union', 'OECD', 'Least Developed Countries'];
                            return !regionals.some(regional => row.Country.includes(regional));
                        })
                        .map(row => ({
                            Country: row.Country.trim(),
                            Year: parseInt(row.Year) || 0,
                            Value: parseFloat(row.Value) || 0,
                            Indicator: row.Indicator.trim(),
                            Unit: row.Unit ? row.Unit.trim() : '',
                            Source: file.name
                        }));
                    
                    allRows.push(...validRows);
                    console.log(`✅ ${file.name}: ${validRows.length} valid rows loaded`);
                    
                } catch (fileError) {
                    console.error(`❌ Error processing ${file.name}:`, fileError);
                }
            }
            
            // Remove duplicates (same Country + Year + Indicator)
            const uniqueRows = this.removeDuplicates(allRows);
            
            this.mergedRows = uniqueRows;
            window.__GLOBAL_DATA__ = uniqueRows;
            
            console.log(`🎉 Data loading complete!`);
            console.log(`📊 Total records: ${uniqueRows.length}`);
            console.log(`🌍 Countries: ${new Set(uniqueRows.map(r => r.Country)).size}`);
            console.log(`📈 Indicators: ${new Set(uniqueRows.map(r => r.Indicator)).size}`);
            console.log(`📅 Years: ${Math.min(...uniqueRows.map(r => r.Year))} - ${Math.max(...uniqueRows.map(r => r.Year))}`);
            
            return uniqueRows;
            
        } catch (error) {
            console.error('❌ Failed to load CSV data:', error);
            return [];
        }
    },
    
    removeDuplicates(rows) {
        const seen = new Set();
        return rows.filter(row => {
            const key = `${row.Country}_${row.Year}_${row.Indicator}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
};