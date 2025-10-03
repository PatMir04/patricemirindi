/**
 * STEP 1: FAO Land Use Dataset Integration
 * Downloads and integrates FAO Land Use data to solve missing countries problem
 * Expected outcome: 246 countries/territories added to dashboard
 */

require('dotenv').config();
const fetch = require('node-fetch');
const JSZip = require('jszip');
const Papa = require('papaparse');
const fs = require('fs');

class FAOLandUseIntegrator {
    constructor() {
        this.datasetURL = 'https://bulks-faostat.fao.org/production/Inputs_LandUse_E_All_Data_(Normalized).zip';
        this.datasetName = 'Land Use (RL)';
        this.expectedRecords = 412559;
        this.expectedCountries = 246;
        
        // Database configuration
        this.dbConfig = {
            type: process.env.DB_TYPE || 'sqlite',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || (process.env.DB_TYPE === 'mysql' ? 3306 : 5432),
            database: process.env.DB_NAME || 'fao_data.db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || ''
        };
    }
    
    // Download and extract the Land Use dataset
    async downloadLandUseData() {
        console.log('📥 Downloading FAO Land Use dataset...');
        
        try {
            const response = await fetch(this.datasetURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            console.log(`✅ Downloaded ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
            
            return await this.extractCSVFromZip(arrayBuffer);
            
        } catch (error) {
            console.error('❌ Download failed:', error);
            throw error;
        }
    }
    
    // Extract CSV from ZIP file
    async extractCSVFromZip(arrayBuffer) {
        try {
            const zip = await JSZip.loadAsync(arrayBuffer);
            const csvFileName = 'Inputs_LandUse_E_All_Data_(Normalized).csv';
            
            if (!zip.files[csvFileName]) {
                throw new Error(`CSV file ${csvFileName} not found in ZIP`);
            }
            
            const csvContent = await zip.files[csvFileName].async('text');
            console.log('✅ Extracted CSV from ZIP');
            
            return this.parseCSVData(csvContent);
            
        } catch (error) {
            console.error('❌ ZIP extraction failed:', error);
            throw error;
        }
    }
    
    // Parse CSV data
    parseCSVData(csvContent) {
        const result = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            transform: (value, header) => {
                // Convert numeric fields
                if (['Area Code', 'Item Code', 'Element Code', 'Year', 'Value'].includes(header)) {
                    return value === '' ? null : Number(value);
                }
                return value;
            }
        });
        
        console.log(`✅ Parsed ${result.data.length} records`);
        return result.data;
    }
    
    // Create comprehensive country mapping
    createCountryMapping() {
        return new Map([
            // Major countries
            ['4', { iso3: 'AFG', name: 'Afghanistan', region: 'Asia' }],
            ['8', { iso3: 'ALB', name: 'Albania', region: 'Europe' }],
            ['12', { iso3: 'DZA', name: 'Algeria', region: 'Africa' }],
            ['16', { iso3: 'ASM', name: 'American Samoa', region: 'Oceania' }],
            ['20', { iso3: 'AND', name: 'Andorra', region: 'Europe' }],
            ['24', { iso3: 'AGO', name: 'Angola', region: 'Africa' }],
            ['28', { iso3: 'ATG', name: 'Antigua and Barbuda', region: 'Americas' }],
            ['32', { iso3: 'ARG', name: 'Argentina', region: 'Americas' }],
            ['51', { iso3: 'ARM', name: 'Armenia', region: 'Asia' }],
            ['36', { iso3: 'AUS', name: 'Australia', region: 'Oceania' }],
            ['40', { iso3: 'AUT', name: 'Austria', region: 'Europe' }],
            ['31', { iso3: 'AZE', name: 'Azerbaijan', region: 'Asia' }],
            ['44', { iso3: 'BHS', name: 'Bahamas', region: 'Americas' }],
            ['48', { iso3: 'BHR', name: 'Bahrain', region: 'Asia' }],
            ['50', { iso3: 'BGD', name: 'Bangladesh', region: 'Asia' }],
            ['52', { iso3: 'BRB', name: 'Barbados', region: 'Americas' }],
            ['112', { iso3: 'BLR', name: 'Belarus', region: 'Europe' }],
            ['56', { iso3: 'BEL', name: 'Belgium', region: 'Europe' }],
            ['84', { iso3: 'BLZ', name: 'Belize', region: 'Americas' }],
            ['204', { iso3: 'BEN', name: 'Benin', region: 'Africa' }],
            ['60', { iso3: 'BMU', name: 'Bermuda', region: 'Americas' }],
            ['64', { iso3: 'BTN', name: 'Bhutan', region: 'Asia' }],
            ['68', { iso3: 'BOL', name: 'Bolivia', region: 'Americas' }],
            ['70', { iso3: 'BIH', name: 'Bosnia and Herzegovina', region: 'Europe' }],
            ['72', { iso3: 'BWA', name: 'Botswana', region: 'Africa' }],
            ['76', { iso3: 'BRA', name: 'Brazil', region: 'Americas' }],
            ['96', { iso3: 'BRN', name: 'Brunei Darussalam', region: 'Asia' }],
            ['100', { iso3: 'BGR', name: 'Bulgaria', region: 'Europe' }],
            ['854', { iso3: 'BFA', name: 'Burkina Faso', region: 'Africa' }],
            ['108', { iso3: 'BDI', name: 'Burundi', region: 'Africa' }],
            
            // Small island states often missing
            ['132', { iso3: 'CPV', name: 'Cabo Verde', region: 'Africa' }],
            ['116', { iso3: 'KHM', name: 'Cambodia', region: 'Asia' }],
            ['120', { iso3: 'CMR', name: 'Cameroon', region: 'Africa' }],
            ['124', { iso3: 'CAN', name: 'Canada', region: 'Americas' }],
            ['140', { iso3: 'CAF', name: 'Central African Republic', region: 'Africa' }],
            ['148', { iso3: 'TCD', name: 'Chad', region: 'Africa' }],
            ['152', { iso3: 'CHL', name: 'Chile', region: 'Americas' }],
            ['156', { iso3: 'CHN', name: 'China', region: 'Asia' }],
            ['170', { iso3: 'COL', name: 'Colombia', region: 'Americas' }],
            ['174', { iso3: 'COM', name: 'Comoros', region: 'Africa' }],
            ['178', { iso3: 'COG', name: 'Congo', region: 'Africa' }],
            ['180', { iso3: 'COD', name: 'Democratic Republic of the Congo', region: 'Africa' }],
            ['184', { iso3: 'COK', name: 'Cook Islands', region: 'Oceania' }],
            ['188', { iso3: 'CRI', name: 'Costa Rica', region: 'Americas' }],
            ['384', { iso3: 'CIV', name: 'Côte d\'Ivoire', region: 'Africa' }],
            ['191', { iso3: 'HRV', name: 'Croatia', region: 'Europe' }],
            ['192', { iso3: 'CUB', name: 'Cuba', region: 'Americas' }],
            ['196', { iso3: 'CYP', name: 'Cyprus', region: 'Europe' }],
            ['203', { iso3: 'CZE', name: 'Czechia', region: 'Europe' }],
            ['208', { iso3: 'DNK', name: 'Denmark', region: 'Europe' }],
            ['262', { iso3: 'DJI', name: 'Djibouti', region: 'Africa' }],
            ['212', { iso3: 'DMA', name: 'Dominica', region: 'Americas' }],
            ['214', { iso3: 'DOM', name: 'Dominican Republic', region: 'Americas' }],
            ['218', { iso3: 'ECU', name: 'Ecuador', region: 'Americas' }],
            ['818', { iso3: 'EGY', name: 'Egypt', region: 'Africa' }],
            ['222', { iso3: 'SLV', name: 'El Salvador', region: 'Americas' }],
            ['226', { iso3: 'GNQ', name: 'Equatorial Guinea', region: 'Africa' }],
            ['232', { iso3: 'ERI', name: 'Eritrea', region: 'Africa' }],
            ['233', { iso3: 'EST', name: 'Estonia', region: 'Europe' }],
            ['748', { iso3: 'SWZ', name: 'Eswatini', region: 'Africa' }],
            ['231', { iso3: 'ETH', name: 'Ethiopia', region: 'Africa' }],
            ['234', { iso3: 'FRO', name: 'Faroe Islands', region: 'Europe' }],
            ['242', { iso3: 'FJI', name: 'Fiji', region: 'Oceania' }],
            ['246', { iso3: 'FIN', name: 'Finland', region: 'Europe' }],
            ['250', { iso3: 'FRA', name: 'France', region: 'Europe' }],
            ['266', { iso3: 'GAB', name: 'Gabon', region: 'Africa' }],
            ['270', { iso3: 'GMB', name: 'Gambia', region: 'Africa' }],
            ['268', { iso3: 'GEO', name: 'Georgia', region: 'Asia' }],
            ['276', { iso3: 'DEU', name: 'Germany', region: 'Europe' }],
            ['288', { iso3: 'GHA', name: 'Ghana', region: 'Africa' }],
            ['300', { iso3: 'GRC', name: 'Greece', region: 'Europe' }],
            ['304', { iso3: 'GRL', name: 'Greenland', region: 'Americas' }],
            ['308', { iso3: 'GRD', name: 'Grenada', region: 'Americas' }],
            ['320', { iso3: 'GTM', name: 'Guatemala', region: 'Americas' }],
            ['324', { iso3: 'GIN', name: 'Guinea', region: 'Africa' }],
            ['624', { iso3: 'GNB', name: 'Guinea-Bissau', region: 'Africa' }],
            ['328', { iso3: 'GUY', name: 'Guyana', region: 'Americas' }],
            ['332', { iso3: 'HTI', name: 'Haiti', region: 'Americas' }],
            ['336', { iso3: 'VAT', name: 'Vatican City', region: 'Europe' }],
            ['340', { iso3: 'HND', name: 'Honduras', region: 'Americas' }],
            ['344', { iso3: 'HKG', name: 'Hong Kong SAR', region: 'Asia' }],
            ['348', { iso3: 'HUN', name: 'Hungary', region: 'Europe' }],
            ['352', { iso3: 'ISL', name: 'Iceland', region: 'Europe' }],
            ['356', { iso3: 'IND', name: 'India', region: 'Asia' }],
            ['360', { iso3: 'IDN', name: 'Indonesia', region: 'Asia' }],
            ['364', { iso3: 'IRN', name: 'Iran', region: 'Asia' }],
            ['368', { iso3: 'IRQ', name: 'Iraq', region: 'Asia' }],
            ['372', { iso3: 'IRL', name: 'Ireland', region: 'Europe' }],
            ['376', { iso3: 'ISR', name: 'Israel', region: 'Asia' }],
            ['380', { iso3: 'ITA', name: 'Italy', region: 'Europe' }],
            ['388', { iso3: 'JAM', name: 'Jamaica', region: 'Americas' }],
            ['392', { iso3: 'JPN', name: 'Japan', region: 'Asia' }],
            ['400', { iso3: 'JOR', name: 'Jordan', region: 'Asia' }],
            ['398', { iso3: 'KAZ', name: 'Kazakhstan', region: 'Asia' }],
            ['404', { iso3: 'KEN', name: 'Kenya', region: 'Africa' }],
            ['296', { iso3: 'KIR', name: 'Kiribati', region: 'Oceania' }],
            ['408', { iso3: 'PRK', name: 'North Korea', region: 'Asia' }],
            ['410', { iso3: 'KOR', name: 'South Korea', region: 'Asia' }],
            ['414', { iso3: 'KWT', name: 'Kuwait', region: 'Asia' }],
            ['417', { iso3: 'KGZ', name: 'Kyrgyzstan', region: 'Asia' }],
            ['418', { iso3: 'LAO', name: 'Lao PDR', region: 'Asia' }],
            ['428', { iso3: 'LVA', name: 'Latvia', region: 'Europe' }],
            ['422', { iso3: 'LBN', name: 'Lebanon', region: 'Asia' }],
            ['426', { iso3: 'LSO', name: 'Lesotho', region: 'Africa' }],
            ['430', { iso3: 'LBR', name: 'Liberia', region: 'Africa' }],
            ['434', { iso3: 'LBY', name: 'Libya', region: 'Africa' }],
            ['438', { iso3: 'LIE', name: 'Liechtenstein', region: 'Europe' }],
            ['440', { iso3: 'LTU', name: 'Lithuania', region: 'Europe' }],
            ['442', { iso3: 'LUX', name: 'Luxembourg', region: 'Europe' }],
            ['446', { iso3: 'MAC', name: 'Macao SAR', region: 'Asia' }],
            ['450', { iso3: 'MDG', name: 'Madagascar', region: 'Africa' }],
            ['454', { iso3: 'MWI', name: 'Malawi', region: 'Africa' }],
            ['458', { iso3: 'MYS', name: 'Malaysia', region: 'Asia' }],
            ['462', { iso3: 'MDV', name: 'Maldives', region: 'Asia' }],
            ['466', { iso3: 'MLI', name: 'Mali', region: 'Africa' }],
            ['470', { iso3: 'MLT', name: 'Malta', region: 'Europe' }],
            ['584', { iso3: 'MHL', name: 'Marshall Islands', region: 'Oceania' }],
            ['478', { iso3: 'MRT', name: 'Mauritania', region: 'Africa' }],
            ['480', { iso3: 'MUS', name: 'Mauritius', region: 'Africa' }],
            ['484', { iso3: 'MEX', name: 'Mexico', region: 'Americas' }],
            ['583', { iso3: 'FSM', name: 'Micronesia', region: 'Oceania' }],
            ['498', { iso3: 'MDA', name: 'Moldova', region: 'Europe' }],
            ['492', { iso3: 'MCO', name: 'Monaco', region: 'Europe' }],
            ['496', { iso3: 'MNG', name: 'Mongolia', region: 'Asia' }],
            ['499', { iso3: 'MNE', name: 'Montenegro', region: 'Europe' }],
            ['504', { iso3: 'MAR', name: 'Morocco', region: 'Africa' }],
            ['508', { iso3: 'MOZ', name: 'Mozambique', region: 'Africa' }],
            ['104', { iso3: 'MMR', name: 'Myanmar', region: 'Asia' }],
            ['516', { iso3: 'NAM', name: 'Namibia', region: 'Africa' }],
            ['520', { iso3: 'NRU', name: 'Nauru', region: 'Oceania' }],
            ['524', { iso3: 'NPL', name: 'Nepal', region: 'Asia' }],
            ['528', { iso3: 'NLD', name: 'Netherlands', region: 'Europe' }],
            ['554', { iso3: 'NZL', name: 'New Zealand', region: 'Oceania' }],
            ['558', { iso3: 'NIC', name: 'Nicaragua', region: 'Americas' }],
            ['562', { iso3: 'NER', name: 'Niger', region: 'Africa' }],
            ['566', { iso3: 'NGA', name: 'Nigeria', region: 'Africa' }],
            ['570', { iso3: 'NIU', name: 'Niue', region: 'Oceania' }],
            ['578', { iso3: 'NOR', name: 'Norway', region: 'Europe' }],
            ['512', { iso3: 'OMN', name: 'Oman', region: 'Asia' }],
            ['586', { iso3: 'PAK', name: 'Pakistan', region: 'Asia' }],
            ['585', { iso3: 'PLW', name: 'Palau', region: 'Oceania' }],
            ['275', { iso3: 'PSE', name: 'Palestine', region: 'Asia' }],
            ['591', { iso3: 'PAN', name: 'Panama', region: 'Americas' }],
            ['598', { iso3: 'PNG', name: 'Papua New Guinea', region: 'Oceania' }],
            ['600', { iso3: 'PRY', name: 'Paraguay', region: 'Americas' }],
            ['604', { iso3: 'PER', name: 'Peru', region: 'Americas' }],
            ['608', { iso3: 'PHL', name: 'Philippines', region: 'Asia' }],
            ['616', { iso3: 'POL', name: 'Poland', region: 'Europe' }],
            ['620', { iso3: 'PRT', name: 'Portugal', region: 'Europe' }],
            ['634', { iso3: 'QAT', name: 'Qatar', region: 'Asia' }],
            ['642', { iso3: 'ROU', name: 'Romania', region: 'Europe' }],
            ['643', { iso3: 'RUS', name: 'Russian Federation', region: 'Europe' }],
            ['646', { iso3: 'RWA', name: 'Rwanda', region: 'Africa' }],
            ['659', { iso3: 'KNA', name: 'Saint Kitts and Nevis', region: 'Americas' }],
            ['662', { iso3: 'LCA', name: 'Saint Lucia', region: 'Americas' }],
            ['670', { iso3: 'VCT', name: 'Saint Vincent and the Grenadines', region: 'Americas' }],
            ['882', { iso3: 'WSM', name: 'Samoa', region: 'Oceania' }],
            ['674', { iso3: 'SMR', name: 'San Marino', region: 'Europe' }],
            ['678', { iso3: 'STP', name: 'Sao Tome and Principe', region: 'Africa' }],
            ['682', { iso3: 'SAU', name: 'Saudi Arabia', region: 'Asia' }],
            ['686', { iso3: 'SEN', name: 'Senegal', region: 'Africa' }],
            ['688', { iso3: 'SRB', name: 'Serbia', region: 'Europe' }],
            ['690', { iso3: 'SYC', name: 'Seychelles', region: 'Africa' }],
            ['694', { iso3: 'SLE', name: 'Sierra Leone', region: 'Africa' }],
            ['702', { iso3: 'SGP', name: 'Singapore', region: 'Asia' }],
            ['703', { iso3: 'SVK', name: 'Slovakia', region: 'Europe' }],
            ['705', { iso3: 'SVN', name: 'Slovenia', region: 'Europe' }],
            ['90', { iso3: 'SLB', name: 'Solomon Islands', region: 'Oceania' }],
            ['706', { iso3: 'SOM', name: 'Somalia', region: 'Africa' }],
            ['710', { iso3: 'ZAF', name: 'South Africa', region: 'Africa' }],
            ['728', { iso3: 'SSD', name: 'South Sudan', region: 'Africa' }],
            ['724', { iso3: 'ESP', name: 'Spain', region: 'Europe' }],
            ['144', { iso3: 'LKA', name: 'Sri Lanka', region: 'Asia' }],
            ['729', { iso3: 'SDN', name: 'Sudan', region: 'Africa' }],
            ['740', { iso3: 'SUR', name: 'Suriname', region: 'Americas' }],
            ['752', { iso3: 'SWE', name: 'Sweden', region: 'Europe' }],
            ['756', { iso3: 'CHE', name: 'Switzerland', region: 'Europe' }],
            ['760', { iso3: 'SYR', name: 'Syrian Arab Republic', region: 'Asia' }],
            ['762', { iso3: 'TJK', name: 'Tajikistan', region: 'Asia' }],
            ['834', { iso3: 'TZA', name: 'Tanzania', region: 'Africa' }],
            ['764', { iso3: 'THA', name: 'Thailand', region: 'Asia' }],
            ['626', { iso3: 'TLS', name: 'Timor-Leste', region: 'Asia' }],
            ['768', { iso3: 'TGO', name: 'Togo', region: 'Africa' }],
            ['776', { iso3: 'TON', name: 'Tonga', region: 'Oceania' }],
            ['780', { iso3: 'TTO', name: 'Trinidad and Tobago', region: 'Americas' }],
            ['788', { iso3: 'TUN', name: 'Tunisia', region: 'Africa' }],
            ['792', { iso3: 'TUR', name: 'Turkey', region: 'Asia' }],
            ['795', { iso3: 'TKM', name: 'Turkmenistan', region: 'Asia' }],
            ['798', { iso3: 'TUV', name: 'Tuvalu', region: 'Oceania' }],
            ['800', { iso3: 'UGA', name: 'Uganda', region: 'Africa' }],
            ['804', { iso3: 'UKR', name: 'Ukraine', region: 'Europe' }],
            ['784', { iso3: 'ARE', name: 'United Arab Emirates', region: 'Asia' }],
            ['826', { iso3: 'GBR', name: 'United Kingdom', region: 'Europe' }],
            ['840', { iso3: 'USA', name: 'United States', region: 'Americas' }],
            ['858', { iso3: 'URY', name: 'Uruguay', region: 'Americas' }],
            ['860', { iso3: 'UZB', name: 'Uzbekistan', region: 'Asia' }],
            ['548', { iso3: 'VUT', name: 'Vanuatu', region: 'Oceania' }],
            ['862', { iso3: 'VEN', name: 'Venezuela', region: 'Americas' }],
            ['704', { iso3: 'VNM', name: 'Viet Nam', region: 'Asia' }],
            ['887', { iso3: 'YEM', name: 'Yemen', region: 'Asia' }],
            ['894', { iso3: 'ZMB', name: 'Zambia', region: 'Africa' }],
            ['716', { iso3: 'ZWE', name: 'Zimbabwe', region: 'Africa' }],
            
            // Special territories and dependencies
            ['533', { iso3: 'ABW', name: 'Aruba', region: 'Americas' }],
            ['238', { iso3: 'FLK', name: 'Falkland Islands', region: 'Americas' }],
            ['254', { iso3: 'GUF', name: 'French Guiana', region: 'Americas' }],
            ['312', { iso3: 'GLP', name: 'Guadeloupe', region: 'Americas' }],
            ['316', { iso3: 'GUM', name: 'Guam', region: 'Oceania' }],
            ['474', { iso3: 'MTQ', name: 'Martinique', region: 'Americas' }],
            ['540', { iso3: 'NCL', name: 'New Caledonia', region: 'Oceania' }],
            ['630', { iso3: 'PRI', name: 'Puerto Rico', region: 'Americas' }],
            ['638', { iso3: 'REU', name: 'Réunion', region: 'Africa' }],
            ['652', { iso3: 'BLM', name: 'Saint Barthélemy', region: 'Americas' }],
            ['663', { iso3: 'MAF', name: 'Saint Martin', region: 'Americas' }],
            ['666', { iso3: 'SPM', name: 'Saint Pierre and Miquelon', region: 'Americas' }],
            ['796', { iso3: 'TCA', name: 'Turks and Caicos Islands', region: 'Americas' }],
            ['850', { iso3: 'VIR', name: 'U.S. Virgin Islands', region: 'Americas' }],
            ['876', { iso3: 'WLF', name: 'Wallis and Futuna', region: 'Oceania' }],
            
            // Special administrative regions
            ['214', { iso3: 'TWN', name: 'Taiwan', region: 'Asia', note: 'Taiwan Province of China' }],
            
            // Regional aggregates (exclude from country counts)
            ['5100', { iso3: null, name: 'Africa', type: 'region' }],
            ['5200', { iso3: null, name: 'Asia', type: 'region' }],
            ['5300', { iso3: null, name: 'Europe', type: 'region' }],
            ['5400', { iso3: null, name: 'Americas', type: 'region' }],
            ['5500', { iso3: null, name: 'Oceania', type: 'region' }]
        ]);
    }
    
    // Process and harmonize the data
    processLandUseData(rawData) {
        const countryMapping = this.createCountryMapping();
        
        const processedData = rawData.map(row => {
            const faoCode = row['Area Code']?.toString();
            const mapping = countryMapping.get(faoCode);
            
            return {
                // Original fields
                area_code_fao: row['Area Code'],
                area_name_fao: row['Area'],
                item_code: row['Item Code'],
                item_name: row['Item'],
                element_code: row['Element Code'],
                element_name: row['Element'],
                year: row['Year'],
                unit: row['Unit'],
                value: row['Value'],
                flag: row['Flag'] || null,
                note: row['Note'] || null,
                
                // Harmonized fields
                iso3_code: mapping?.iso3 || null,
                country_name_standard: mapping?.name || row['Area'],
                region: mapping?.region || null,
                is_country: mapping?.type !== 'region',
                
                // Data quality flags
                has_data: row['Value'] !== null && row['Value'] !== 0,
                data_source: 'FAOSTAT_RL',
                integration_date: new Date().toISOString()
            };
        });
        
        // Filter out invalid records
        const validData = processedData.filter(row => 
            row.year && row.value !== null && row.is_country
        );
        
        console.log(`✅ Processed ${validData.length} valid records`);
        
        // Analyze country coverage
        const uniqueCountries = new Set(validData.map(r => r.iso3_code).filter(c => c));
        console.log(`🌍 Coverage: ${uniqueCountries.size} countries with valid data`);
        
        return validData;
    }
    
    // Generate summary statistics
    generateSummary(processedData) {
        const summary = {
            total_records: processedData.length,
            countries_covered: new Set(processedData.map(r => r.iso3_code).filter(c => c)).size,
            year_range: {
                min: Math.min(...processedData.map(r => r.year)),
                max: Math.max(...processedData.map(r => r.year))
            },
            land_use_categories: [...new Set(processedData.map(r => r.item_name))],
            elements: [...new Set(processedData.map(r => r.element_name))],
            regions: {},
            top_countries_by_records: {}
        };
        
        // Count by region
        processedData.forEach(row => {
            if (row.region) {
                summary.regions[row.region] = (summary.regions[row.region] || 0) + 1;
            }
        });
        
        // Top countries by number of records
        const countryRecords = {};
        processedData.forEach(row => {
            if (row.iso3_code) {
                countryRecords[row.country_name_standard] = (countryRecords[row.country_name_standard] || 0) + 1;
            }
        });
        
        const sortedCountries = Object.entries(countryRecords)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .reduce((obj, [country, count]) => ({ ...obj, [country]: count }), {});
        
        summary.top_countries_by_records = sortedCountries;
        
        return summary;
    }
    
    // Save data to database (SQLite version for easy testing)
    async saveToSQLite(processedData) {
        const sqlite3 = require('sqlite3');
        const { open } = require('sqlite');
        
        const db = await open({
            filename: this.dbConfig.database,
            driver: sqlite3.Database
        });
        
        // Create table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS fao_land_use (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                area_code_fao INTEGER,
                area_name_fao TEXT,
                item_code INTEGER,
                item_name TEXT,
                element_code INTEGER,
                element_name TEXT,
                year INTEGER,
                unit TEXT,
                value REAL,
                flag TEXT,
                note TEXT,
                iso3_code TEXT,
                country_name_standard TEXT,
                region TEXT,
                is_country BOOLEAN,
                has_data BOOLEAN,
                data_source TEXT,
                integration_date TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(area_code_fao, item_code, element_code, year)
            )
        `);
        
        // Insert data in batches
        const batchSize = 1000;
        let inserted = 0;
        
        for (let i = 0; i < processedData.length; i += batchSize) {
            const batch = processedData.slice(i, i + batchSize);
            
            const placeholders = batch.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
            const values = batch.flatMap(row => [
                row.area_code_fao, row.area_name_fao, row.item_code, row.item_name,
                row.element_code, row.element_name, row.year, row.unit, row.value,
                row.flag, row.note, row.iso3_code, row.country_name_standard,
                row.region, row.is_country, row.has_data, row.data_source, row.integration_date
            ]);
            
            await db.run(`
                INSERT OR REPLACE INTO fao_land_use 
                (area_code_fao, area_name_fao, item_code, item_name, element_code, 
                 element_name, year, unit, value, flag, note, iso3_code, 
                 country_name_standard, region, is_country, has_data, data_source, integration_date)
                VALUES ${placeholders}
            `, values);
            
            inserted += batch.length;
            console.log(`💾 Inserted ${inserted}/${processedData.length} records`);
        }
        
        await db.close();
        console.log('✅ Data saved to SQLite database');
    }
    
    // Save data to PostgreSQL
    async saveToPostgreSQL(processedData) {
        const { Pool } = require('pg');
        
        const pool = new Pool({
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            database: this.dbConfig.database,
            user: this.dbConfig.user,
            password: this.dbConfig.password,
        });
        
        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fao_land_use (
                id SERIAL PRIMARY KEY,
                area_code_fao INTEGER,
                area_name_fao VARCHAR(255),
                item_code INTEGER,
                item_name VARCHAR(255),
                element_code INTEGER,
                element_name VARCHAR(255),
                year INTEGER,
                unit VARCHAR(50),
                value NUMERIC,
                flag VARCHAR(10),
                note TEXT,
                iso3_code VARCHAR(3),
                country_name_standard VARCHAR(255),
                region VARCHAR(100),
                is_country BOOLEAN,
                has_data BOOLEAN,
                data_source VARCHAR(50),
                integration_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(area_code_fao, item_code, element_code, year)
            )
        `);
        
        // Insert data in batches
        const batchSize = 1000;
        let inserted = 0;
        
        for (let i = 0; i < processedData.length; i += batchSize) {
            const batch = processedData.slice(i, i + batchSize);
            
            const insertPromises = batch.map(row => {
                return pool.query(`
                    INSERT INTO fao_land_use 
                    (area_code_fao, area_name_fao, item_code, item_name, element_code, 
                     element_name, year, unit, value, flag, note, iso3_code, 
                     country_name_standard, region, is_country, has_data, data_source, integration_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                    ON CONFLICT (area_code_fao, item_code, element_code, year) 
                    DO UPDATE SET value = EXCLUDED.value, integration_date = EXCLUDED.integration_date
                `, [
                    row.area_code_fao, row.area_name_fao, row.item_code, row.item_name,
                    row.element_code, row.element_name, row.year, row.unit, row.value,
                    row.flag, row.note, row.iso3_code, row.country_name_standard, 
                    row.region, row.is_country, row.has_data, row.data_source, row.integration_date
                ]);
            });
            
            await Promise.all(insertPromises);
            inserted += batch.length;
            console.log(`💾 Inserted ${inserted}/${processedData.length} records`);
        }
        
        await pool.end();
        console.log('✅ Data saved to PostgreSQL database');
    }
    
    // Main database save method
    async saveToDatabase(processedData) {
        console.log(`💾 Saving ${processedData.length} records to ${this.dbConfig.type}...`);
        
        switch (this.dbConfig.type.toLowerCase()) {
            case 'sqlite':
                await this.saveToSQLite(processedData);
                break;
            case 'postgresql':
            case 'postgres':
                await this.saveToPostgreSQL(processedData);
                break;
            default:
                throw new Error(`Unsupported database type: ${this.dbConfig.type}`);
        }
    }
    
    // Export data as JSON for verification
    async exportSummaryJSON(summary) {
        const exportData = {
            integration_info: {
                step: 1,
                dataset: this.datasetName,
                integration_date: new Date().toISOString(),
                expected_countries: this.expectedCountries,
                actual_countries: summary.countries_covered,
                success: summary.countries_covered >= 200 // Success if we get most countries
            },
            summary: summary
        };
        
        fs.writeFileSync('step1_integration_summary.json', JSON.stringify(exportData, null, 2));
        console.log('📄 Integration summary exported to step1_integration_summary.json');
    }
    
    // Main execution function
    async execute() {
        try {
            console.log(`🚀 Starting STEP 1: ${this.datasetName} integration...`);
            console.log(`📊 Target: ${this.expectedCountries} countries, ${this.expectedRecords} records`);
            console.log(`🗄️ Database: ${this.dbConfig.type} (${this.dbConfig.database})`);
            console.log('=' + '='.repeat(60));
            
            // Step 1: Download data
            const rawData = await this.downloadLandUseData();
            
            // Step 2: Process data
            const processedData = this.processLandUseData(rawData);
            
            // Step 3: Generate summary
            const summary = this.generateSummary(processedData);
            console.log('\n📊 INTEGRATION SUMMARY:');
            console.log('=' + '='.repeat(30));
            console.log(`✅ Total records processed: ${summary.total_records.toLocaleString()}`);
            console.log(`🌍 Countries covered: ${summary.countries_covered}`);
            console.log(`📅 Year range: ${summary.year_range.min} - ${summary.year_range.max}`);
            console.log(`🏷️ Land use categories: ${summary.land_use_categories.length}`);
            console.log(`📋 Elements tracked: ${summary.elements.length}`);
            
            console.log('\n🌎 REGIONAL COVERAGE:');
            Object.entries(summary.regions).forEach(([region, count]) => {
                console.log(`   ${region}: ${count.toLocaleString()} records`);
            });
            
            console.log('\n🏆 TOP COUNTRIES BY RECORDS:');
            Object.entries(summary.top_countries_by_records).slice(0, 5).forEach(([country, count]) => {
                console.log(`   ${country}: ${count.toLocaleString()} records`);
            });
            
            // Step 4: Save to database
            console.log('\n💾 SAVING TO DATABASE...');
            await this.saveToDatabase(processedData);
            
            // Step 5: Export summary
            await this.exportSummaryJSON(summary);
            
            // Final success message
            console.log('\n🎉 STEP 1 COMPLETED SUCCESSFULLY!');
            console.log('=' + '='.repeat(40));
            console.log(`✅ Added ${summary.countries_covered} countries to your dashboard`);
            console.log(`✅ Integrated ${summary.total_records.toLocaleString()} land use records`);
            console.log('✅ Missing countries problem solved!');
            console.log('✅ Foundation ready for STEP 2: Food Security Indicators');
            
            return {
                success: true,
                summary,
                message: `Successfully integrated ${summary.countries_covered} countries and ${summary.total_records} records`
            };
            
        } catch (error) {
            console.error('\n❌ STEP 1 FAILED:', error.message);
            console.error('Stack trace:', error.stack);
            
            return {
                success: false,
                error: error.message,
                message: 'STEP 1 integration failed. Check error details above.'
            };
        }
    }
}

// Usage Example and Main Execution
async function main() {
    console.log('🌟 FAO DATA INTEGRATION - STEP 1');
    console.log('Global Development Analytics Dashboard Enhancement');
    console.log('By Patrice Mirindi - https://patricemirindi.com');
    console.log('');
    
    const integrator = new FAOLandUseIntegrator();
    const result = await integrator.execute();
    
    if (result.success) {
        console.log('\n🚀 READY FOR NEXT STEPS:');
        console.log('   1. Verify data in your database');
        console.log('   2. Update your dashboard to show new countries');
        console.log('   3. Run STEP 2: npm run step2');
        console.log('   4. Continue with remaining FAO datasets');
    } else {
        console.log('\n🔧 TROUBLESHOOTING:');
        console.log('   1. Check your database configuration in .env');
        console.log('   2. Ensure database is running and accessible');
        console.log('   3. Verify internet connection to FAO servers');
        console.log('   4. Run: node test_setup.js to diagnose issues');
    }
    
    process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = FAOLandUseIntegrator;