# realtime_service.py
import cv2
import threading
import numpy as np
from ultralytics import YOLO
from app.config import Config

# Load YOLO model once
model = YOLO(Config.MODEL_PATH)

# Global latest detection
latest_detection = {
    "label": "Detection processing...",
    "confidence": 0.0,
    "boxes": []
}

lock = threading.Lock()

def update_latest_detection(label, conf, boxes):
    """Thread-safe update of latest detection."""
    with lock:
        latest_detection["label"] = label
        latest_detection["confidence"] = conf
        latest_detection["boxes"] = boxes

def process_frame(frame_bytes):
    """Process a single webcam frame."""
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        return

    # Resize for speed (optional)
    frame = cv2.resize(frame, (640, 640))

    boxes_list = []
    results = model(frame)
    for r in results:
        for box in r.boxes:
            cls = int(box.cls)
            label = model.names[cls]
            conf = float(box.conf)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            w, h = x2 - x1, y2 - y1

            boxes_list.append({
                "x": int(x1),
                "y": int(y1),
                "width": int(w),
                "height": int(h),
                "label": label,
                "confidence": conf
            })

    # Update once per frame
    if boxes_list:
        first_box = max(boxes_list, key=lambda b: b['confidence'])
        update_latest_detection(first_box['label'], first_box['confidence'], boxes_list)

# Background webcam loop
def start_webcam_loop(cam_index=0):
    def loop():
        cap = cv2.VideoCapture(cam_index)
        while True:
            ret, frame = cap.read()
            if not ret:
                continue
            # Encode frame to bytes
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            process_frame(frame_bytes)

    threading.Thread(target=loop, daemon=True).start()