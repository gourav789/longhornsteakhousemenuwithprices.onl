import os
import re

# Mapping from old folder name (with space/typo) to new clean SEO-friendly URL
rename_map = {
    'About US': 'about-us',
    'Contact US': 'contact-us',
    'Privacy Policy': 'privacy-policy',
    'Dislciamer': 'disclaimer'
}

# 1. Rename the directories first
for old_name, new_name in rename_map.items():
    if os.path.exists(old_name) and os.path.isdir(old_name):
        # Rename directory
        if os.path.exists(new_name):
            print(f"Warning: {new_name} already exists.")
        else:
            os.rename(old_name, new_name)
            print(f"Renamed directory '{old_name}' -> '{new_name}'")

# All HTML files we need to update
html_files = [
    'index.html',
    'about-us/index.html',
    'contact-us/index.html',
    'privacy-policy/index.html',
    'disclaimer/index.html'
]

# 2. Update all internal links in the HTML files
for filepath in html_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Update hrefs
        for old_name, new_name in rename_map.items():
            # Match href="About US", href="../About US", etc.
            content = content.replace(f'"{old_name}"', f'"{new_name}"')
            content = content.replace(f'"{old_name}/"', f'"{new_name}/"')
            content = content.replace(f'"../{old_name}"', f'"../{new_name}"')
            content = content.replace(f'"../{old_name}/"', f'"../{new_name}/"')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated links in {filepath}")
    else:
        print(f"Warning: {filepath} not found for updating.")

# 3. Update sitemap.xml
sitemap_file = 'sitemap.xml'
if os.path.exists(sitemap_file):
    with open(sitemap_file, 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
        
    for old_name, new_name in rename_map.items():
        # Update encoded spaces in sitemap
        encoded_old = old_name.replace(' ', '%20')
        sitemap_content = sitemap_content.replace(f'/{encoded_old}/', f'/{new_name}/')
        
    with open(sitemap_file, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    print(f"Updated {sitemap_file}")

print("Cleaned up URLs and fixed %20 spaces!")
