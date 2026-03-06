"""Make dark background of logo-light.png transparent and save as logo-light-transparent.png"""
try:
    from PIL import Image
except ImportError:
    print("PIL not found. Install with: pip install Pillow")
    exit(1)

img_path = "images/logo-light.png"
out_path = "images/logo-light-transparent.png"

img = Image.open(img_path).convert("RGBA")
data = img.getdata()

# Pixels darker than this (0-255) become transparent. Tune if needed.
DARK_THRESHOLD = 100

new_data = []
for item in data:
    r, g, b, a = item
    brightness = (r + g + b) / 3
    if brightness < DARK_THRESHOLD:
        new_data.append((r, g, b, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save(out_path, "PNG")
print(f"Saved {out_path}")
