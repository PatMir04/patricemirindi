# Data Uploads Folder

## Purpose
This folder contains CSV files that are automatically loaded into the Global Development Analytics Dashboard.

## CSV Format Requirements

Your CSV files must have these exact column headers (case-sensitive):

```csv
Country,Year,Value,Indicator,Unit
```

## Example CSV Structure:

```csv
Country,Year,Value,Indicator,Unit
Afghanistan,2020,65286,Country area,1000 ha
Afghanistan,2021,65286,Country area,1000 ha
Benin,2020,11462,Country area,1000 ha
Benin,2021,11462,Country area,1000 ha
```

## How to Add New Data:

1. **Format your data** with the required columns above
2. **Save as CSV** with any filename (e.g., `patmirtest.csv`, `land_use_2024.csv`)
3. **Upload to this folder** via GitHub web interface or git push
4. **Refresh your dashboard** - new data appears automatically!

## Automatic Processing:

- All CSV files in this folder are automatically loaded when the dashboard opens
- Country and Indicator dropdowns update automatically
- No manual import or code changes needed
- Duplicate data is automatically handled

## Current Files:

- `Land_use.csv` - FAO Land Use dataset with 246 countries/territories

---

*Dashboard automatically refreshes data from this folder on every load.*