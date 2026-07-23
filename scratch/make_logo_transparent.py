from PIL import Image
import numpy as np

img_path = r'C:\Users\Jumez\.gemini\antigravity\brain\cb97e390-bff9-47bc-8bfc-87b8dcb395dd\media__1784837323207.jpg'
out_path = r'c:\Users\Jumez\OneDrive\Escritorio\Proyectos Negocios\PARMA\parma-italia\public\logo.png'

img = Image.open(img_path).convert('RGBA')
arr = np.array(img, dtype=np.float32)

# Background reference color from corners
bg_color = arr[0, 0, :3] # [247, 247, 247]

# Calculate color distance to background color for each pixel
rgb = arr[:, :, :3]
diff = np.sqrt(np.sum((rgb - bg_color) ** 2, axis=2))

# Create alpha channel based on distance from background color
# Pixels very close to #F7F7F7 background -> transparent
# Pixels with significant difference -> opaque (including pure white text [255, 255, 255] and red logo [217, 4, 41])
alpha = np.ones((arr.shape[0], arr.shape[1]), dtype=np.float32) * 255.0

# Thresholds:
# Background is within 8 units of [247, 247, 247]
transparent_mask = diff <= 6.0
feather_mask = (diff > 6.0) & (diff < 15.0)

alpha[transparent_mask] = 0.0
alpha[feather_mask] = ((diff[feather_mask] - 6.0) / 9.0) * 255.0

# Set final alpha channel
arr[:, :, 3] = alpha

# Also for pure white text, ensure it's full opacity white
white_text_mask = (rgb[:, :, 0] > 252) & (rgb[:, :, 1] > 252) & (rgb[:, :, 2] > 252) & (diff > 8.0)
arr[white_text_mask, 3] = 255.0

result = Image.fromarray(arr.astype(np.uint8))

# Crop transparent borders cleanly
bbox = result.getbbox()
if bbox:
    # Add small padding around cropped logo
    padding = 10
    crop_box = (
        max(0, bbox[0] - padding),
        max(0, bbox[1] - padding),
        min(result.width, bbox[2] + padding),
        min(result.height, bbox[3] + padding)
    )
    result = result.crop(crop_box)

result.save(out_path, "PNG")
print("Saved clean transparent PNG logo to:", out_path)
print("Final size:", result.size)
