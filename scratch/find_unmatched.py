import json

with open('scratch_folders_data.json', 'r', encoding='utf-8') as f:
    folders = json.load(f)

keywords = ['bone', 'cat', 'shampoo', 'aloe', 'mala', 'meat', 'feet', 'limox', 'chicken', 'mother', 'baby', 'scavon', 'woofy']
for k in keywords:
    print(f"=== KEYWORD: {k} ===")
    found = 0
    for f in folders:
        for file in f['files']:
            if k in file.lower():
                print(f"  [{f['batch']}] Folder {f['folder']}: {file}")
                found += 1
    if found == 0:
        print("  (none)")
