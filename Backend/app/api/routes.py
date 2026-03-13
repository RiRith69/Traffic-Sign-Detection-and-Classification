# app/api/routes.py
from flask import Blueprint, request, jsonify, render_template
from pathlib import Path
import os
import sys

# Import your YOLO service functions
from app.service import predict

# Create a Flask Blueprint
bp = Blueprint("routes", __name__)

# Global model variable (this is populated by predict.py after import)
model = None

@bp.route('/', methods=['GET'])
def home():
    # This will look for templates/index.html
    return render_template('index.html')

@bp.route('/predict', methods=['POST'])
def handle_predict():
    global model
    
    # 1. Safety Check: Is the model loaded?
    if model is None:
        print("❌ Error: Model variable is None in routes.py")
        return jsonify({"error": "Model not loaded on server"}), 500

    # 2. Flexible File Retrieval
    # Matches both 'myfile' (your old code) and 'file' (standard/new code)
    uploaded_file = request.files.get('myfile') or request.files.get('file')
    
    if not uploaded_file:
        print("❌ Error: No file found in request.files")
        return jsonify({"error": "No file uploaded. Check if the key is 'myfile' or 'file'"}), 400

    try:
        # 3. Secure Pathing
        # FILE is Backend/app/api/routes.py -> .parents[2] is Backend/
        ROOT = Path(__file__).resolve().parents[2]
        save_dir = ROOT / "data" / "raw"
        save_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = save_dir / uploaded_file.filename
        uploaded_file.save(str(file_path))
        print(f"--- File saved to: {file_path} ---")

        # 4. Run YOLO prediction
        # We pass the model global and the string path
        results = predict(model, str(file_path))

        # 5. Format JSON safely for the Frontend
        detections = []
        
        # YOLO results are a list (one item per image)
        if results and len(results) > 0:
            # Ultralytics Results object
            result = results[0]
            
            if hasattr(result, 'boxes') and result.boxes is not None:
                for box in result.boxes:
                    # .item() converts single-value tensors to Python numbers
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())
                    # Get coordinates as a list of 4 ints
                    coords = [int(v) for v in box.xyxy[0].tolist()]

                    detections.append({
                        "label": model.names[cls_id],
                        "confidence": round(conf, 4),
                        "box": coords
                    })

        print(f"✅ Detection successful: {len(detections)} items found.")
        
        # 6. Return JSON to Frontend
        return jsonify({
            "status": "success",
            "detections": detections
        })

    except Exception as e:
        print(f"❌ CRITICAL ERROR during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500