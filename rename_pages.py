import os
import re

# Mapping of old filenames to new filenames
file_mapping = {
    'about.html': 'About US',
    'disclaimer.html': 'Dislciamer',
    'contact.html': 'Contact US',
    'privacy.html': 'Privacy Policy'
}

# The files we need to update content in (including index.html and the new files themselves)
files_to_update = ['index.html'] + list(file_mapping.values())

# 1. Rename the files
for old_name, new_name in file_mapping.items():
    if os.path.exists(old_name):
        # In case the new name already exists, remove it first
        if os.path.exists(new_name):
            os.remove(new_name)
        os.rename(old_name, new_name)
        print(f"Renamed {old_name} -> {new_name}")
    else:
        print(f"Warning: {old_name} not found.")

# 2. Update the links inside the files
for filename in files_to_update:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the hrefs
        for old_link, new_link in file_mapping.items():
            # Match href="old.html" or href='old.html'
            content = re.sub(rf'href=["\']{re.escape(old_link)}["\']', f'href="{new_link}"', content)
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated links in {filename}")
    else:
        print(f"Warning: {filename} not found for updating.")
