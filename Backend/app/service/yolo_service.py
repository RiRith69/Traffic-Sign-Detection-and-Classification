from ultralytics import YOLO

def load_model(model_path):
    return YOLO(model_path)

def predict(model, image_path):
    results = model(image_path)
    return results