#!/usr/bin/env python3
"""
Script to generate static HTML files from Flask templates for GitHub Pages deployment.
This preserves the original Flask app for local development while creating a static demo.
"""

import os
import shutil
from app import app

def generate_static_site():
    """Generate static HTML files from Flask app"""
    
    # Ensure build directory exists
    build_dir = 'build'
    os.makedirs(build_dir, exist_ok=True)
    shutil.copytree('static', os.path.join(build_dir, 'static'), dirs_exist_ok=True)
    
    pages = {
        "/": "index.html",
        "/tokens": "tokens.html",
        "/text": "text.html",
        "/hallucination-path": "hallucination-path.html",
    }
    with app.test_client() as client:
        for route, filename in pages.items():
            response = client.get(route)
            if response.status_code != 200:
                print(f"❌ Error generating {filename}: {response.status_code}")
                continue

            html_content = response.get_data(as_text=True)
            html_content = html_content.replace('/static/', 'static/')
            html_content = html_content.replace('href="/tokens"', 'href="tokens.html"')
            html_content = html_content.replace('href="/text"', 'href="text.html"')
            html_content = html_content.replace('href="/hallucination-path"', 'href="hallucination-path.html"')
            html_content = html_content.replace('href="/"', 'href="index.html"')
            html_content = html_content.replace('src="static/script.js"', 'src="static/script-static.js"')
            html_content = html_content.replace('data-generation-mode="path"', 'data-generation-mode="path" data-static-demo="true"')
            with open(os.path.join(build_dir, filename), 'w', encoding='utf-8') as output:
                output.write(html_content)
            print(f"✅ Generated {filename}")

    with open(os.path.join(build_dir, "phrase.html"), "w", encoding="utf-8") as output:
        output.write('<meta http-equiv="refresh" content="0; url=text.html">')
    
    print("✅ Static site generation complete!")
    print("📁 Files created in build/ directory")
    print("🚀 Ready for GitHub Pages deployment")

if __name__ == '__main__':
    generate_static_site()
