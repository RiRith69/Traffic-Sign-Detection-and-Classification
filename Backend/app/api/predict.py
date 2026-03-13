# app/api/predict.py
import sys
from pathlib import Path
import argparse
from flask import Flask
from flask_cors import CORS

# --- PATH FIX ---
# FILE is .../Backend/app/api/predict.py
FILE = Path(__file__).resolve()

# ROOT needs to be the 'Backend' folder for imports to work
# .parent (api) -> .parent (app) -> .parent (Backend)
ROOT = FILE.parents[2] 

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

# Now imports will work correctly
from app.service import load_model, predict
from app.api.routes import bp as routes_bp

# --- Flask App ---
app = Flask(__name__)
CORS(app)
app.register_blueprint(routes_bp)

# --- THE SPECIFIC FIX FOR YOUR PATH ---
# Your path: Backend/app/models/best.pt
# In pathlib terms: ROOT / 'app' / 'models' / 'best.pt'
MODEL_PATH = ROOT / 'app' / 'models' / 'best.pt'

print(f"--- Checking for model at: {MODEL_PATH} ---")
if MODEL_PATH.exists():
    print("✅ Model found!")
else:
    print("❌ Model NOT found! Please check if the folder 'app' contains 'models'.")

# --- Load YOLO model globally ---
parser = argparse.ArgumentParser()
parser.add_argument('--model', type=str, default=str(MODEL_PATH))
opt = parser.parse_args()

model = load_model(opt.model)

# Set global model in routes.py
import app.api.routes as routes_module
routes_module.model = model

# --- Run Flask ---
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)