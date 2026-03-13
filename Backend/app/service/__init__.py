# This allows you to import directly from the 'service' folder
from .yolo_service import load_model, predict

# (Optional) You can define what is exported when someone uses 'from service import *'
__all__ = ['load_model', 'predict']
def predict(model, image_path):
    # This returns a list of Results objects from Ultralytics
    return model(image_path)