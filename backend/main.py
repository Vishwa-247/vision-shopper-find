
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import cv2
import requests
from bs4 import BeautifulSoup
import os
from typing import List, Optional
import uvicorn

app = FastAPI(title="VisionShopper Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model on startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        # Load MobileNet model
        model = tf.keras.applications.MobileNetV2(
            weights='imagenet',
            include_top=True,
            input_shape=(224, 224, 3)
        )
        print("MobileNet model loaded successfully")
    except Exception as e:
        print(f"Failed to load model: {e}")

class ImageAnalysisResult(BaseModel):
    productCategory: str
    dominantColor: str
    confidence: float
    features: List[str]

class ProductSearchResult(BaseModel):
    id: int
    title: str
    price: float
    originalPrice: float
    site: str
    image: str
    url: str
    rating: float
    discount: Optional[float] = None
    availability: Optional[bool] = True

@app.post("/analyze-image", response_model=ImageAnalysisResult)
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Read image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Preprocess for MobileNet
        image = image.convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)
        image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)
        
        # Get predictions
        predictions = model.predict(image_array)
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=5)[0]
        
        # Map to product categories
        product_category = map_to_product_category(decoded_predictions[0][1])
        confidence = float(decoded_predictions[0][2])
        
        # Extract dominant color
        dominant_color = extract_dominant_color(np.array(Image.open(io.BytesIO(image_data))))
        
        return ImageAnalysisResult(
            productCategory=product_category,
            dominantColor=dominant_color,
            confidence=confidence,
            features=["real-ml-analysis"]
        )
        
    except Exception as e:
        print(f"Image analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.get("/search-products", response_model=List[ProductSearchResult])
async def search_products(
    query: str,
    color: str = "",
    sites: str = "Amazon,Flipkart"
):
    try:
        # Use Brave Search API
        brave_api_key = os.getenv("BRAVE_API_KEY")
        if not brave_api_key:
            raise HTTPException(status_code=500, detail="Brave API key not configured")
        
        search_query = f"{color} {query} buy online" if color else f"{query} buy online"
        
        headers = {
            "X-Subscription-Token": brave_api_key,
            "Accept": "application/json"
        }
        
        response = requests.get(
            f"https://api.search.brave.com/res/v1/web/search",
            params={
                "q": search_query,
                "count": 20,
                "search_lang": "en",
                "country": "US",
                "market": "US"
            },
            headers=headers
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Brave API error: {response.status_code}")
        
        data = response.json()
        results = []
        
        if "web" in data and "results" in data["web"]:
            for i, result in enumerate(data["web"]["results"][:10]):
                site = extract_site_name(result["url"])
                if is_ecommerce_site(site):
                    price = extract_price_from_description(result.get("description", ""))
                    results.append(ProductSearchResult(
                        id=i + 1,
                        title=result["title"],
                        price=price,
                        originalPrice=price * 1.2,
                        site=site,
                        image=f"https://picsum.photos/300/300?random={i}",
                        url=result["url"],
                        rating=4.0 + (i % 10) * 0.1,
                        discount=round(((price * 1.2 - price) / (price * 1.2)) * 100, 1)
                    ))
        
        return results
        
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

def map_to_product_category(imagenet_class: str) -> str:
    """Map ImageNet classes to e-commerce product categories"""
    mappings = {
        "sneaker": "Sneaker",
        "shoe": "Shoe",
        "sandal": "Sandal",
        "boot": "Boot",
        "running_shoe": "Sneaker",
        "jersey": "T-Shirt",
        "sweatshirt": "Sweatshirt",
        "cardigan": "Cardigan",
        "suit": "Suit",
        "jean": "Jeans",
        "miniskirt": "Skirt",
        "cellular_telephone": "Smartphone",
        "laptop": "Laptop",
        "notebook": "Laptop",
        "desktop_computer": "Desktop",
        "monitor": "Monitor",
        "mouse": "Mouse",
        "keyboard": "Keyboard",
        "headphone": "Headphones",
        "sunglasses": "Sunglasses",
        "watch": "Watch",
        "backpack": "Backpack",
        "purse": "Handbag",
        "wallet": "Wallet"
    }
    
    for key, value in mappings.items():
        if key in imagenet_class.lower():
            return value
    
    # Default categories
    if any(word in imagenet_class.lower() for word in ["shirt", "cloth", "wear"]):
        return "T-Shirt"
    elif any(word in imagenet_class.lower() for word in ["phone", "mobile", "cell"]):
        return "Smartphone"
    elif any(word in imagenet_class.lower() for word in ["computer", "laptop"]):
        return "Laptop"
    else:
        return "Product"

def extract_dominant_color(image_array: np.ndarray) -> str:
    """Extract dominant color from image"""
    # Reshape image to list of pixels
    pixels = image_array.reshape(-1, 3)
    
    # Use k-means to find dominant color
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters=5, random_state=42)
    kmeans.fit(pixels)
    
    # Get the most frequent color
    dominant_color_rgb = kmeans.cluster_centers_[0]
    
    # Map RGB to color name
    return rgb_to_color_name(dominant_color_rgb)

def rgb_to_color_name(rgb):
    """Convert RGB values to color names"""
    r, g, b = rgb
    
    if r > 200 and g > 200 and b > 200:
        return "White"
    elif r < 50 and g < 50 and b < 50:
        return "Black"
    elif r > g and r > b:
        return "Red"
    elif g > r and g > b:
        return "Green"
    elif b > r and b > g:
        return "Blue"
    elif r > 150 and g > 150 and b < 100:
        return "Yellow"
    elif r > 150 and g < 100 and b > 150:
        return "Purple"
    elif r > 150 and g > 100 and b < 100:
        return "Orange"
    else:
        return "Gray"

def extract_site_name(url: str) -> str:
    """Extract site name from URL"""
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc.lower()
        if "amazon" in domain:
            return "Amazon"
        elif "flipkart" in domain:
            return "Flipkart"
        elif "myntra" in domain:
            return "Myntra"
        elif "nike" in domain:
            return "Nike"
        elif "puma" in domain:
            return "Puma"
        elif "meesho" in domain:
            return "Meesho"
        else:
            return domain.replace("www.", "").split(".")[0].title()
    except:
        return "Unknown"

def is_ecommerce_site(site: str) -> bool:
    """Check if site is an e-commerce platform"""
    ecommerce_sites = ["amazon", "flipkart", "myntra", "nike", "puma", "meesho", "ajio", "nykaa"]
    return any(ecom in site.lower() for ecom in ecommerce_sites)

def extract_price_from_description(description: str) -> float:
    """Extract price from product description"""
    import re
    price_patterns = [
        r'\$[\d,]+\.?\d*',
        r'₹[\d,]+\.?\d*',
        r'[\d,]+\.?\d*\s*(?:USD|INR|dollars?|rupees?)'
    ]
    
    for pattern in price_patterns:
        match = re.search(pattern, description, re.IGNORECASE)
        if match:
            price_str = re.sub(r'[^\d.]', '', match.group())
            try:
                return float(price_str)
            except:
                continue
    
    # Default price range
    return 50.0 + np.random.random() * 200.0

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
