import cv2
import numpy as np
from ultralytics import YOLO
from app.config import Config

# Load YOLO model ONCE
model = YOLO(Config.MODEL_PATH)

def process_frame(frame_bytes):

    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"label": "Invalid frame", "confidence": 0, "boxes": []}

    orig_h, orig_w = frame.shape[:2]

    resized = cv2.resize(frame, (320, 320))

    results = model(resized, conf=0.25, verbose=False)

    scale_x = orig_w / 320
    scale_y = orig_h / 320

    boxes_list = []

    for r in results:
        for box in r.boxes:

            cls = int(box.cls)
            conf = float(box.conf)

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            boxes_list.append({
                "x": int(x1 * scale_x),
                "y": int(y1 * scale_y),
                "width": int((x2 - x1) * scale_x),
                "height": int((y2 - y1) * scale_y),
                "label": model.names[cls],
                "confidence": conf
            })

    label = "No object"
    confidence = 0

    if boxes_list:
        best = max(boxes_list, key=lambda b: b["confidence"])
        label = best["label"]
        confidence = best["confidence"]

    return {
        "label": label,
        "confidence": confidence,
        "boxes": boxes_list
    }