import json
with open('excel_prices.json', 'r', encoding='utf-8') as f:
    items = json.load(f)
for i, x in enumerate(items):
    pet = x['pet']
    name = x['name']
    price = x['price']
    print(f"{i+1:3d}. [{pet}] {name} -> Rs. {price}")
