import os

print("Current Directory:", os.getcwd())
print("Files in the folder:", os.listdir())

# rest of your imports...
from PIL import Image
import imagehash
import cv2


def generate_image_hash(image_path):
    print(f"Generating hash for: {image_path}")
    img = Image.open(image_path)
    hash_value = imagehash.phash(img)
    return str(hash_value)

def compare_hashes(manufacturer_hash, customer_image_path, threshold=5):
    customer_hash = generate_image_hash(customer_image_path)
    hamming_distance = imagehash.hex_to_hash(manufacturer_hash) - imagehash.hex_to_hash(customer_hash)

    print(f"Manufacturer Hash: {manufacturer_hash}")
    print(f"Customer Hash:     {customer_hash}")
    print(f"Hamming Distance:  {hamming_distance}")

    if hamming_distance <= threshold:
        return "Product is authentic."
    else:
        return " Product has been tampered or is fake."

manufacturer_image = r"C:\Users\itspu\Desktop\VerifiEye-ImageHash\original_product.JPG.jpg"
manufacturer_hash = generate_image_hash(manufacturer_image)

customer_image = r"C:\Users\itspu\Desktop\VerifiEye-ImageHash\customer_upload.jpg.jpg"
result = compare_hashes(manufacturer_hash, customer_image)

print("\nResult:", result)