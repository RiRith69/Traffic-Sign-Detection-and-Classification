# app/services/yolo_service.py

import cv2
import numpy as np
import tempfile
import subprocess
import os
from ultralytics import YOLO
from PIL import Image, ImageOps
import io
from app.config import Config

# =========================
# LOAD YOLO MODEL
# =========================
model = YOLO(Config.MODEL_PATH)

MAX_SIZE = 960
JPEG_QUALITY = 55
CONF_THRESHOLD = 0.5

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "static"))
TEMP_VIDEO_DIR = STATIC_DIR

os.makedirs(TEMP_VIDEO_DIR, exist_ok=True)

print("Saving videos to:", TEMP_VIDEO_DIR)

# Load model
model = YOLO(Config.MODEL_PATH)
# =========================
# PREPROCESS IMAGE
# =========================
def preprocess_image(img_bytes):
    """
    Fix orientation + resize + compress image
    """

    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Fix EXIF rotation (important for phone uploads)
    img = ImageOps.exif_transpose(img)

    original_w, original_h = img.size

    # Resize (keep aspect ratio)
    img.thumbnail((MAX_SIZE, MAX_SIZE))
    resized_w, resized_h = img.size

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=JPEG_QUALITY)
    buffer.seek(0)

    return buffer.read(), (original_w, original_h), (resized_w, resized_h)


# =========================
# DETECT SINGLE IMAGE
# =========================
def detect_image(img_bytes, original_size, resized_size):
    """
    Detect YOLO objects and scale bboxes back to original image size
    """
    orig_w, orig_h = original_size
    resized_w, resized_h = resized_size

    scale_x = orig_w / resized_w
    scale_y = orig_h / resized_h

    file_bytes = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # 🔥 Force YOLO to use 960
    results = model(img, imgsz=960)

    detections = []

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf)
            cls = int(box.cls)

            # Scale to original image size
            x1 *= scale_x
            x2 *= scale_x
            y1 *= scale_y
            y2 *= scale_y

            detections.append({
                "id": cls,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })

    return detections


# =========================
# AUTO-MIRROR DETECTION
# =========================
def detect_image_auto(img_bytes, original_size, resized_size):
    """
    Detects image, auto flips if mirrored to maximize confidence
    """

    # --- Normal detection
    normal_det = detect_image(img_bytes, original_size, resized_size)
    normal_score = sum(d["confidence"] for d in normal_det)

    # --- Flipped detection
    np_img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    flipped_img = cv2.flip(np_img, 1)
    _, buf = cv2.imencode('.jpg', flipped_img)
    flipped_bytes = buf.tobytes()

    flipped_det = detect_image(flipped_bytes, original_size, resized_size)
    flipped_score = sum(d["confidence"] for d in flipped_det)

    # --- Choose the better one
    if flipped_score > normal_score:
        # Image is likely mirrored → fix bboxes
        w, _ = original_size
        for d in flipped_det:
            x1, y1, x2, y2 = d["bbox"]
            d["bbox"] = [w - x2, y1, w - x1, y2]
        return flipped_det
    else:
        return normal_det


# =========================
# PROCESS MULTIPLE IMAGES
# =========================
def process_images(files):
    """
    Process uploaded images and auto-detect mirrored images
    """
    response = []

    for idx, file in enumerate(files):
        original_bytes = file.read()
        processed_bytes, original_size, resized_size = preprocess_image(original_bytes)

        detections = detect_image_auto(
            processed_bytes,
            original_size,
            resized_size
        )

        response.append({
            "id": idx,
            "filename": file.filename,
            "results": detections
        })

    return response


# =========================
# VIDEO DETECTION HELPERS
# =========================
def get_video_rotation(video_path):
    """Get rotation angle from video metadata using ffprobe"""
    try:
        result = subprocess.run([
            "ffprobe", "-v", "quiet",
            "-print_format", "json",
            "-show_streams", video_path
        ], capture_output=True, text=True)

        data = result.stdout
        if not data:
            return 0
        import json
        data = json.loads(data)
        for stream in data.get('streams', []):
            rotation = int(stream.get('tags', {}).get('rotate', 0))
            if rotation:
                return rotation
    except:
        pass
    return 0


def fix_frame_rotation(frame, rotation):
    if rotation == 90:
        return cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
    elif rotation == 180:
        return cv2.rotate(frame, cv2.ROTATE_180)
    elif rotation == 270:
        return cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return frame


# =========================
# VIDEO DETECTION
# =========================
def detect_video(video_bytes, frame_interval=2):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_video:
        tmp_video.write(video_bytes)
        temp_path = tmp_video.name

    cap = cv2.VideoCapture(temp_path)
    if not cap.isOpened():
        raise ValueError("Cannot open video")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    filename = f"video_{next(tempfile._get_candidate_names())}.mp4"
    output_path = os.path.join(TEMP_VIDEO_DIR, filename)

    out = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height)
    )

    frame_id = 0
    detections = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_interval == 0:
            results = model(frame)

            frame_dets = []
            for r in results:
                for box in r.boxes:
                    conf = float(box.conf[0])
                    if conf < CONF_THRESHOLD:
                        continue

                    cls = int(box.cls[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)

                    frame_dets.append({
                        "id": cls,
                        "confidence": conf,
                        "bbox": [x1, y1, x2, y2]
                    })

            detections.append({
                "frame_id": frame_id,
                "results": frame_dets
            })

        out.write(frame)
        frame_id += 1

    cap.release()
    out.release()
    os.remove(temp_path)

    video_url = f"http://127.0.0.1:5000/static/{filename}"  

    return detections, video_url