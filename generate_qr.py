import urllib.request
import os

url = "https://office-fdq5.vercel.app/"
encoded_url = urllib.parse.quote(url, safe='')

# High quality PNG QR code (500x500 px)
png_api_url = f"https://api.qrserver.com/v1/create-qr-code/?size=600x600&data={encoded_url}&margin=10&color=0b192c&bgcolor=ffffff"
png_path = r"c:\Users\USER\Desktop\3기\안티그래비티\기업정책협력관\qrcode_busan_officer.png"

# SVG QR code for vector print
svg_api_url = f"https://api.qrserver.com/v1/create-qr-code/?format=svg&size=600x600&data={encoded_url}&margin=10&color=0b192c&bgcolor=ffffff"
svg_path = r"c:\Users\USER\Desktop\3기\안티그래비티\기업정책협력관\qrcode_busan_officer.svg"

print(f"Downloading PNG QR Code from {png_api_url}...")
urllib.request.urlretrieve(png_api_url, png_path)

print(f"Downloading SVG QR Code from {svg_api_url}...")
urllib.request.urlretrieve(svg_api_url, svg_path)

print("QR Code generation completed successfully!")
