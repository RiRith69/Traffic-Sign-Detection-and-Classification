# app/services/yolo_service.py
import cv2
import numpy as np
import tempfile
import subprocess
import os
from ultralytics import YOLO
from PIL import Image
import io
from app.config import Config

# Load YOLO model once
model = YOLO(Config.MODEL_PATH)

def detect_image(img_bytes):
    """Detect traffic signs in a single image"""
    file_bytes = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    results = model(img)
    detections = []

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf)
            cls = int(box.cls)  # numeric class ID
            detections.append({
                "id": cls,             # <-- use ID instead of name
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })
    return detections


MAX_SIZE = 960
JPEG_QUALITY = 55

def preprocess_image(img_bytes):
    """Resize and compress image to match training conditions"""
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Resize while keeping aspect ratio
    img.thumbnail((MAX_SIZE, MAX_SIZE))

    # Save to buffer with compression
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=JPEG_QUALITY)
    buffer.seek(0)

    return buffer.read()


def process_images(files):
    """Process multiple uploaded images"""
    response = []

    for idx, file in enumerate(files):
        original_bytes = file.read()

        # 🔥 Preprocess before detection
        processed_bytes = preprocess_image(original_bytes)

        # Run detection on optimized image
        detections = detect_image(processed_bytes)

        response.append({
            "id": idx,
            "filename": file.filename,
            "results": detections
        })

    return response


def detect_video(video_bytes, frame_interval=5):
    """
    Detect traffic signs in a video of any format.
    Returns frame-wise detections with class IDs.
    """
    # Save uploaded video to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_video:
        tmp_video.write(video_bytes)
        temp_path = tmp_video.name

    # Try opening with OpenCV
    cap = cv2.VideoCapture(temp_path)
    mp4_path = None
    if not cap.isOpened():
        # convert to MP4 using FFmpeg
        mp4_path = temp_path + ".mp4"
        subprocess.run([
            "ffmpeg", "-y", "-i", temp_path,
            "-vcodec", "h264", "-acodec", "aac", mp4_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        cap.release()
        cap = cv2.VideoCapture(mp4_path)

    results_list = []
    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_interval == 0:
            frame_results = model(frame)
            frame_detections = []
            for r in frame_results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    conf = float(box.conf)
                    cls = int(box.cls)
                    frame_detections.append({
                        "id": cls,             # <-- numeric ID
                        "confidence": conf,
                        "bbox": [x1, y1, x2, y2]
                    })
            results_list.append({
                "frame_id": frame_id,
                "results": frame_detections
            })

        frame_id += 1

    cap.release()
    os.remove(temp_path)
    if mp4_path and os.path.exists(mp4_path):
        os.remove(mp4_path)

    return results_list