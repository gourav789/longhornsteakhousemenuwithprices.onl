import os
import re

pages = ['About US', 'Dislciamer', 'Contact US', 'Privacy Policy']

for page in pages:
    if os.path.exists(page) and os.path.isfile(page):
        # 1. Read content of the file
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 2. Update asset links to use ../ since it will be one level deep
        # Update style.css
        content = re.sub(r'href="style\.css"', 'href="../style.css"', content)
        # Update script.js
        content = re.sub(r'src="script\.js"', 'src="../script.js"', content)
        # Update Images/
        content = re.sub(r'src="Images/', 'src="../Images/', content)
        # Update href="index.html" just in case they click logo
        content = re.sub(r'href="index\.html"', 'href="../index.html"', content)
        # Update page links themselves (from 'About US' to '../About US' etc.)
        for other_page in pages:
            # We want to replace href="About US" with href="../About US"
            # But only if it doesn't already start with ../
            content = re.sub(rf'href="{other_page}"', f'href="../{other_page}"', content)
        
        # 3. Create directory
        temp_name = page + "_temp"
        os.rename(page, temp_name) # Rename file out of the way temporarily
        os.makedirs(page, exist_ok=True)
        
        # 4. Write content to index.html inside the directory
        with open(os.path.join(page, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(content)
            
        os.remove(temp_name)
        print(f"Fixed {page} -> {page}/index.html")
    elif os.path.exists(os.path.join(page, 'index.html')):
        print(f"{page} is already a directory with index.html")
    else:
        print(f"Could not find {page}")

print("Done fixing pages for standard web servers.")
