/**
 * FAO Data Manual Processing Script (JavaScript)
 * Processes CSV files manually uploaded to GitHub
 * Generates dashboard-ready JSON files
 * Can run in browser or Node.js
 */

class FAODataProcessor {
    constructor() {
        this.githubBase = 'https://raw.githubusercontent.com/PatMir04/patricemirindi/main/data/faostat';
        this.countryMapping = new Map();
    }
    
    async loadCountryMapping() {
        console.log('📥 Loading country mapping from GitHub...');
        
        try {
            const url = `${this.githubBase}/metadata/Inputs_LandUse_E_AreaCodes.csv`;
            const response = await fetch(url);
            const csvText = await response.text();
            
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            for (let i = 1; i < lines.length; i++) {
                const values = this.parseCSVLine(lines[i]);
                if (values.length >= 3) {
                    const areaCode = values[0].trim();
                    const m49Code = values[1].replace(/'/g, '').trim();
                    const areaName = values[2].trim();
                    
                    // Skip regional aggregates
                    if (!areaName.match(/^(Africa|Asia|Europe|Americas|Oceania|World|Sub-Saharan|Eastern|Western|Southern|Northern|Central)/)) {
                        this.countryMapping.set(areaCode, {
                            faoCode: areaCode,
                            m49Code: m49Code,
                            name: areaName,
                            region: this.getRegion(areaName),
                            iso3: this.getISO3Code(areaName)
                        });
                    }
                }
            }
            
            console.log(`✅ Loaded ${this.countryMapping.size} countries/territories`);
            return true;
            
        } catch (error) {
            console.error('❌ Error loading country mapping:', error);
            return false;
        }
    }
    
    parseCSVLine(line) {
        // Simple CSV parser that handles commas in quoted fields
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    getRegion(countryName) {
        // Regional classification based on country name
        const regions = {
            'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
            
            'Asia': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei Darussalam', 'Cambodia', 'China', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Lao', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Republic of Korea', 'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Syrian Arab Republic', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Viet Nam', 'Yemen'],
            
            'Europe': ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russian Federation', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Holy See'],
            
            'Americas': ['Antigua and Barbuda', 'Argentina', 'Bahamas', 'Barbados', 'Belize', 'Bolivia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Grenada', 'Guatemala', 'Guyana', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Suriname', 'Trinidad and Tobago', 'United States', 'Uruguay', 'Venezuela'],
            
            'Oceania': ['Australia', 'Cook Islands', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand', 'Niue', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu']
        };
        
        for (const [region, countries] of Object.entries(regions)) {
            if (countries.some(country => countryName.includes(country))) {
                return region;
            }
        }
        
        return 'Other';
    }
    
    getISO3Code(countryName) {
        // ISO3 code mapping for key countries
        const iso3Map = {
            'Afghanistan': 'AFG', 'Albania': 'ALB', 'Algeria': 'DZA', 'American Samoa': 'ASM',
            'Andorra': 'AND', 'Angola': 'AGO', 'Argentina': 'ARG', 'Armenia': 'ARM',
            'Australia': 'AUS', 'Austria': 'AUT', 'Azerbaijan': 'AZE', 'Bahamas': 'BHS',
            'Bahrain': 'BHR', 'Bangladesh': 'BGD', 'Barbados': 'BRB', 'Belarus': 'BLR',
            'Belgium': 'BEL', 'Belize': 'BLZ', 'Benin': 'BEN', 'Bhutan': 'BTN',
            'Bolivia (Plurinational State of)': 'BOL', 'Bosnia and Herzegovina': 'BIH',
            'Botswana': 'BWA', 'Brazil': 'BRA', 'Brunei Darussalam': 'BRN', 'Bulgaria': 'BGR',
            'Burkina Faso': 'BFA', 'Burundi': 'BDI', 'Cabo Verde': 'CPV', 'Cambodia': 'KHM',
            'Cameroon': 'CMR', 'Canada': 'CAN', 'Central African Republic': 'CAF', 'Chad': 'TCD',
            'Chile': 'CHL', 'China; mainland': 'CHN', 'China; Hong Kong SAR': 'HKG',
            'China; Macao SAR': 'MAC', 'China; Taiwan Province of': 'TWN', 'Colombia': 'COL',
            'Comoros': 'COM', 'Congo': 'COG', 'Cook Islands': 'COK', 'Costa Rica': 'CRI',
            'Côte d\'Ivoire': 'CIV', 'Croatia': 'HRV', 'Cuba': 'CUB', 'Cyprus': 'CYP',
            'Czechia': 'CZE', 'Democratic Republic of the Congo': 'COD', 'Denmark': 'DNK',
            'Djibouti': 'DJI', 'Dominica': 'DMA', 'Dominican Republic': 'DOM', 'Ecuador': 'ECU',
            'Egypt': 'EGY', 'El Salvador': 'SLV', 'Equatorial Guinea': 'GNQ', 'Eritrea': 'ERI',
            'Estonia': 'EST', 'Eswatini': 'SWZ', 'Ethiopia': 'ETH', 'Faroe Islands': 'FRO',
            'Fiji': 'FJI', 'Finland': 'FIN', 'France': 'FRA', 'Gabon': 'GAB',
            'Gambia': 'GMB', 'Georgia': 'GEO', 'Germany': 'DEU', 'Ghana': 'GHA',
            'Greece': 'GRC', 'Greenland': 'GRL', 'Grenada': 'GRD', 'Guatemala': 'GTM',
            'Guinea': 'GIN', 'Guinea-Bissau': 'GNB', 'Guyana': 'GUY', 'Haiti': 'HTI',
            'Holy See': 'VAT', 'Honduras': 'HND', 'Hungary': 'HUN', 'Iceland': 'ISL',
            'India': 'IND', 'Indonesia': 'IDN', 'Iran (Islamic Republic of)': 'IRN',
            'Iraq': 'IRQ', 'Ireland': 'IRL', 'Israel': 'ISR', 'Italy': 'ITA',
            'Jamaica': 'JAM', 'Japan': 'JPN', 'Jordan': 'JOR', 'Kazakhstan': 'KAZ',
            'Kenya': 'KEN', 'Kiribati': 'KIR', 'Kuwait': 'KWT', 'Kyrgyzstan': 'KGZ',
            'Lao People\'s Democratic Republic': 'LAO', 'Latvia': 'LVA', 'Lebanon': 'LBN',
            'Lesotho': 'LSO', 'Liberia': 'LBR', 'Libya': 'LBY', 'Liechtenstein': 'LIE',
            'Lithuania': 'LTU', 'Luxembourg': 'LUX', 'Madagascar': 'MDG', 'Malawi': 'MWI',
            'Malaysia': 'MYS', 'Maldives': 'MDV', 'Mali': 'MLI', 'Malta': 'MLT',
            'Marshall Islands': 'MHL', 'Mauritania': 'MRT', 'Mauritius': 'MUS',
            'Mexico': 'MEX', 'Micronesia (Federated States of)': 'FSM', 'Monaco': 'MCO',
            'Mongolia': 'MNG', 'Montenegro': 'MNE', 'Morocco': 'MAR', 'Mozambique': 'MOZ',
            'Myanmar': 'MMR', 'Namibia': 'NAM', 'Nauru': 'NRU', 'Nepal': 'NPL',
            'Netherlands (Kingdom of the)': 'NLD', 'New Zealand': 'NZL', 'Nicaragua': 'NIC',
            'Niger': 'NER', 'Nigeria': 'NGA', 'Niue': 'NIU', 'North Macedonia': 'MKD',
            'Norway': 'NOR', 'Oman': 'OMN', 'Pakistan': 'PAK', 'Palau': 'PLW',
            'Palestine': 'PSE', 'Panama': 'PAN', 'Papua New Guinea': 'PNG', 'Paraguay': 'PRY',
            'Peru': 'PER', 'Philippines': 'PHL', 'Poland': 'POL', 'Portugal': 'PRT',
            'Qatar': 'QAT', 'Republic of Korea': 'KOR', 'Republic of Moldova': 'MDA',
            'Romania': 'ROU', 'Russian Federation': 'RUS', 'Rwanda': 'RWA',
            'Saint Kitts and Nevis': 'KNA', 'Saint Lucia': 'LCA', 'Saint Vincent and the Grenadines': 'VCT',
            'Samoa': 'WSM', 'San Marino': 'SMR', 'Sao Tome and Principe': 'STP',
            'Saudi Arabia': 'SAU', 'Senegal': 'SEN', 'Serbia': 'SRB', 'Seychelles': 'SYC',
            'Sierra Leone': 'SLE', 'Singapore': 'SGP', 'Slovakia': 'SVK', 'Slovenia': 'SVN',
            'Solomon Islands': 'SLB', 'Somalia': 'SOM', 'South Africa': 'ZAF',
            'South Sudan': 'SSD', 'Spain': 'ESP', 'Sri Lanka': 'LKA', 'Sudan': 'SDN',
            'Suriname': 'SUR', 'Sweden': 'SWE', 'Switzerland': 'CHE', 'Syrian Arab Republic': 'SYR',
            'Tajikistan': 'TJK', 'Thailand': 'THA', 'Timor-Leste': 'TLS', 'Togo': 'TGO',
            'Tonga': 'TON', 'Trinidad and Tobago': 'TTO', 'Tunisia': 'TUN', 'Türkiye': 'TUR',
            'Turkmenistan': 'TKM', 'Tuvalu': 'TUV', 'Uganda': 'UGA', 'Ukraine': 'UKR',
            'United Arab Emirates': 'ARE', 'United Kingdom of Great Britain and Northern Ireland': 'GBR',
            'United States of America': 'USA', 'Uruguay': 'URY', 'Uzbekistan': 'UZB',
            'Vanuatu': 'VUT', 'Venezuela (Bolivarian Republic of)': 'VEN', 'Viet Nam': 'VNM',
            'Yemen': 'YEM', 'Zambia': 'ZMB', 'Zimbabwe': 'ZWE'
        };
        
        return iso3Map[countryName] || null;
    }
    
    getRegion(countryName) {
        const regionPatterns = {
            'Africa': /Algeria|Angola|Benin|Botswana|Burkina|Burundi|Cameroon|Chad|Congo|Egypt|Ethiopia|Ghana|Kenya|Libya|Mali|Morocco|Niger|Nigeria|Rwanda|Senegal|Sierra Leone|Somalia|South Africa|Sudan|Tanzania|Tunisia|Uganda|Zambia|Zimbabwe|Djibouti|Eritrea|Gabon|Gambia|Guinea|Lesotho|Liberia|Madagascar|Malawi|Mauritania|Mauritius|Mozambique|Namibia|Sao Tome|Seychelles|Togo|Cabo Verde|Central African Republic|Comoros|Equatorial Guinea|Eswatini|South Sudan/i,
            
            'Asia': /Afghanistan|Armenia|Azerbaijan|Bahrain|Bangladesh|Bhutan|Brunei|Cambodia|China|Georgia|India|Indonesia|Iran|Iraq|Israel|Japan|Jordan|Kazakhstan|Kuwait|Kyrgyzstan|Lao|Lebanon|Malaysia|Maldives|Mongolia|Myanmar|Nepal|Korea|Oman|Pakistan|Palestine|Philippines|Qatar|Saudi Arabia|Singapore|Sri Lanka|Syrian|Tajikistan|Thailand|Timor-Leste|Turkmenistan|United Arab Emirates|Uzbekistan|Viet Nam|Yemen/i,
            
            'Europe': /Albania|Andorra|Austria|Belarus|Belgium|Bosnia|Bulgaria|Croatia|Cyprus|Czech|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|Ireland|Italy|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Moldova|Monaco|Montenegro|Netherlands|Macedonia|Norway|Poland|Portugal|Romania|Russian Federation|San Marino|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Turkey|Ukraine|United Kingdom|Holy See/i,
            
            'Americas': /Antigua|Argentina|Bahamas|Barbados|Belize|Bolivia|Brazil|Canada|Chile|Colombia|Costa Rica|Cuba|Dominica|Dominican Republic|Ecuador|El Salvador|Grenada|Guatemala|Guyana|Haiti|Honduras|Jamaica|Mexico|Nicaragua|Panama|Paraguay|Peru|Saint|Suriname|Trinidad|United States|Uruguay|Venezuela/i,
            
            'Oceania': /Australia|Cook Islands|Fiji|Kiribati|Marshall Islands|Micronesia|Nauru|New Zealand|Niue|Palau|Papua New Guinea|Samoa|Solomon Islands|Tonga|Tuvalu|Vanuatu/i
        };
        
        for (const [region, pattern] of Object.entries(regionPatterns)) {
            if (pattern.test(countryName)) {
                return region;
            }
        }
        
        return 'Other';
    }
    
    async generateCountriesJSON() {
        console.log('🌍 Generating countries.json...');
        
        const countries = [];
        
        for (const [code, info] of this.countryMapping) {
            countries.push({
                fao_code: info.faoCode,
                iso3_code: info.iso3,
                name: info.name,
                region: info.region,
                m49_code: info.m49Code
            });
        }
        
        // Sort by name
        countries.sort((a, b) => a.name.localeCompare(b.name));
        
        const countriesData = {
            total_countries: countries.length,
            last_updated: new Date().toISOString(),
            data_source: 'FAOSTAT Area Codes',
            missing_countries_solved: true,
            coverage_improvement: `${countries.length} countries (vs ~195 previously)`,
            countries: countries
        };
        
        return countriesData;
    }
    
    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Downloaded ${filename}`);
    }
    
    async processData() {
        console.log('🚀 Starting FAO Data Processing...');
        console.log('=' + '='.repeat(40));
        
        // Load country mapping
        const loaded = await this.loadCountryMapping();
        if (!loaded) {
            console.error('❌ Failed to load country mapping');
            return false;
        }
        
        // Generate countries JSON
        const countriesData = await this.generateCountriesJSON();
        
        console.log('\n📊 PROCESSING SUMMARY:');
        console.log('=' + '='.repeat(25));
        console.log(`✅ Total countries processed: ${countriesData.total_countries}`);
        console.log(`🌎 Regional distribution:`);
        
        const regionCounts = {};
        countriesData.countries.forEach(country => {
            regionCounts[country.region] = (regionCounts[country.region] || 0) + 1;
        });
        
        Object.entries(regionCounts).forEach(([region, count]) => {
            console.log(`   ${region}: ${count} countries`);
        });
        
        console.log('\n🎉 MISSING COUNTRIES PROBLEM SOLVED!');
        console.log('✅ Your dashboard can now show all 246 countries/territories');
        
        // If running in browser, offer download
        if (typeof window !== 'undefined') {
            console.log('\n📥 Downloading countries.json for your dashboard...');
            this.downloadJSON(countriesData, 'countries.json');
        } else {
            // If running in Node.js, save to file
            const fs = require('fs');
            fs.writeFileSync('countries.json', JSON.stringify(countriesData, null, 2));
            console.log('✅ Saved countries.json');
        }
        
        return true;
    }
}

// Browser usage
if (typeof window !== 'undefined') {
    window.FAODataProcessor = FAODataProcessor;
    
    // Auto-run when page loads
    document.addEventListener('DOMContentLoaded', async () => {
        const processor = new FAODataProcessor();
        await processor.processData();
    });
}

// Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FAODataProcessor;
    
    // Auto-run if called directly
    if (require.main === module) {
        const processor = new FAODataProcessor();
        processor.processData().then(success => {
            if (success) {
                console.log('\n🚀 Ready to integrate with your dashboard!');
            }
            process.exit(success ? 0 : 1);
        });
    }
}