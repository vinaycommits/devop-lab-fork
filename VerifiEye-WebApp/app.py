from flask import Flask, render_template, request
import os
from PIL import Image
import imagehash

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def generate_image_hash(image_path):
    img = Image.open(image_path)
    return str(imagehash.phash(img))

def compare_hashes(manufacturer_path, customer_path, threshold=5):
    hash1 = generate_image_hash(manufacturer_path)
    hash2 = generate_image_hash(customer_path)
    distance = imagehash.hex_to_hash(hash1) - imagehash.hex_to_hash(hash2)
    return distance <= threshold, distance

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    manufacturer_hash = None
    customer_hash = None

    if request.method == "POST":
        manufacturer = request.files["manufacturer"]
        customer = request.files["customer"]
        
        if manufacturer and customer:
            manufacturer_path = os.path.join(app.config['UPLOAD_FOLDER'], "manufacturer.jpg")
            customer_path = os.path.join(app.config['UPLOAD_FOLDER'], "customer.jpg")
            
            manufacturer.save(manufacturer_path)
            customer.save(customer_path)

            # Generate hashes
            manufacturer_hash = generate_image_hash(manufacturer_path)
            customer_hash = generate_image_hash(customer_path)

            match, distance = compare_hashes(manufacturer_path, customer_path)
            result = "✅ Product is authentic." if match else "❌ Product has been tampered with or is fake."
            result += f" (Hamming Distance: {distance})"

    return render_template("index.html", result=result, manufacturer_hash=manufacturer_hash, customer_hash=customer_hash)

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
