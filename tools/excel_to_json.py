#!/usr/bin/env python3
"""
Convert Excel/CSV data files to JSON for the Patrice Mirindi website
"""

import pandas as pd
import json
import os
from pathlib import Path

def convert_faq_data():
    """Convert FAQ data from Excel/CSV to JSON"""
    try:
        # Try to read Excel first, then CSV as fallback
        if os.path.exists('data/faq.xlsx'):
            df = pd.read_excel('data/faq.xlsx')
            print("Loaded FAQ data from Excel file")
        elif os.path.exists('data/faq.csv'):
            df = pd.read_csv('data/faq.csv')
            print("Loaded FAQ data from CSV file")
        else:
            print("No FAQ data file found, skipping...")
            return

        # Convert to JSON format
        faq_data = []
        for index, row in df.iterrows():
            faq_item = {
                "id": index + 1,
                "question": str(row.get('Question', '')).strip(),
                "keywords": str(row.get('Keywords', '')).strip().split(',') if pd.notna(row.get('Keywords')) else [],
                "answer": str(row.get('Answer', '')).strip(),
                "category": str(row.get('Category', 'General')).strip() if pd.notna(row.get('Category')) else 'General'
            }
            faq_data.append(faq_item)

        # Save to JSON
        os.makedirs('docs/data', exist_ok=True)
        with open('docs/data/faq.json', 'w', encoding='utf-8') as f:
            json.dump(faq_data, f, indent=2, ensure_ascii=False)

        print(f"Converted {len(faq_data)} FAQ entries to JSON")

    except Exception as e:
        print(f"Error converting FAQ data: {e}")

def copy_json_files():
    """Copy JSON data files to docs directory"""
    try:
        source_dir = Path('data')
        dest_dir = Path('docs/data')
        dest_dir.mkdir(exist_ok=True)

        json_files = ['about.json', 'work_experience.json', 'skills_expertise.json', 'key_projects.json']

        for json_file in json_files:
            source_path = source_dir / json_file
            dest_path = dest_dir / json_file

            if source_path.exists():
                with open(source_path, 'r', encoding='utf-8') as src:
                    data = json.load(src)

                with open(dest_path, 'w', encoding='utf-8') as dest:
                    json.dump(data, dest, indent=2, ensure_ascii=False)

                print(f"Copied {json_file} to docs/data/")
            else:
                print(f"Warning: {json_file} not found in data directory")

    except Exception as e:
        print(f"Error copying JSON files: {e}")

def main():
    """Main conversion function"""
    print("Starting data conversion process...")

    # Convert FAQ data if it exists
    convert_faq_data()

    # Copy other JSON data files
    copy_json_files()

    print("Data conversion completed!")

if __name__ == "__main__":
    main()