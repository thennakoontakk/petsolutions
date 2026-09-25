import json

with open('scratch_folders_data.json', 'r', encoding='utf-8') as f:
    folders = json.load(f)

print("=== BATCH 1 (1-46) ===")
for f in folders:
    if f['batch'] == 'Batch 1':
        print(f"Folder {f['folder']:>2}: {' | '.join(f['files'])}")

print("\n=== BATCH 2 (46-102) ===")
for f in folders:
    if f['batch'] == 'Batch 2':
        print(f"Folder {f['folder']:>3}: {' | '.join(f['files'])}")
