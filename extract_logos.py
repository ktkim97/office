import re

with open(r"C:\Users\USER\.gemini\antigravity\brain\fe4b8074-08b4-4371-a44d-9ac6e23775e0\.system_generated\steps\210\content.md", "r", encoding="utf-8") as f:
    text = f.read()

imgs = re.findall(r'https?://[^\s\)]+\.(?:png|jpg|jpeg|svg|ai)', text, re.IGNORECASE)
for img in set(imgs):
    if 'symbol' in img.lower() or 'logo' in img.lower() or 'brand' in img.lower() or 'busan' in img.lower():
        print(img)
