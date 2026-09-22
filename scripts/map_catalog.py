import json
import re

with open('parsed_docx_products.json', 'r', encoding='utf-8') as f:
    docx_prods = json.load(f)

with open('excel_prices.json', 'r', encoding='utf-8') as f:
    excel_items = json.load(f)

print(f"Total Docx: {len(docx_prods)}, Total Excel: {len(excel_items)}")

terms = ['rapim', 'alov', 'flead', 'classic', 'smart', 'catron', 'petfat', 'limox', 'sorbit', 'me-o', 'meo', 'vetgrow', 'poultry', 'meat']
for t in terms:
    found = [e for e in excel_items if t in e['name'].lower()]
    print(f"Term '{t}': {len(found)} matches")
    for x in found[:3]:
        print(f"   {x['name']} -> Rs. {x['price']}")
