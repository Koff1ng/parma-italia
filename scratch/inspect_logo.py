from PIL import Image
import numpy as np

img_path = r'C:\Users\Jumez\.gemini\antigravity\brain\cb97e390-bff9-47bc-8bfc-87b8dcb395dd\media__1784837323207.jpg'
img = Image.open(img_path).convert('RGBA')
arr = np.array(img)

print("Image shape:", arr.shape)
print("Top-left pixel RGBA:", arr[0, 0])
print("Center pixel RGBA:", arr[arr.shape[0]//2, arr.shape[1]//2])

# Find min and max RGB in the image
print("Min RGB:", arr[:, :, :3].min(axis=(0,1)))
print("Max RGB:", arr[:, :, :3].max(axis=(0,1)))
