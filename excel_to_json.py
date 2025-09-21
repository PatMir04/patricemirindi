import pandas as pd
import json
import sys
import os

def excel_to_json(excel_file="data/faq.xlsx", json_file="data/faq.json"):
    """Convert Excel/CSV FAQ file to JSON format"""

    # Try reading Excel first, fallback to CSV
    try:
        if os.path.exists(excel_file):
            df = pd.read_excel(excel_file)
        else:
            csv_file = "data/faq.csv"
            if os.path.exists(csv_file):
                df = pd.read_csv(csv_file)
            else:
                raise FileNotFoundError("Neither Excel nor CSV file found!")
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Ensure proper column names
    df.columns = ["question", "keywords", "answer"]

    # Convert to JSON format
    faq_data = []
    for idx, row in df.iterrows():
        keywords = [k.strip() for k in str(row['keywords']).split(',') if k.strip()]
        faq_entry = {
            "id": idx + 1,
            "question": str(row['question']),
            "keywords": keywords,
            "answer": str(row['answer']),
            "category": "general"
        }
        faq_data.append(faq_entry)

    # Save as JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(faq_data, f, indent=2, ensure_ascii=False)

    print(f"FAQ data converted and saved to {json_file}")

if __name__ == "__main__":
    excel_to_json()
