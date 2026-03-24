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

model = YOLO(Config.MODEL_PATH)

MAX_SIZE = 960
JPEG_QUALITY = 55


# =========================
# PREPROCESS IMAGE
# =========================
def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Fix EXIF rotation
    img = ImageOps.exif_transpose(img)

    original_w, original_h = img.size

    # Resize
    img.thumbnail((MAX_SIZE, MAX_SIZE))
    resized_w, resized_h = img.size

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=JPEG_QUALITY)
    buffer.seek(0)

    return buffer.read(), (original_w, original_h), (resized_w, resized_h)


# =========================
# RUN YOLO
# =========================
def run_detection(img):
    results = model(img)
    detections = []

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf)
            cls = int(box.cls)

            detections.append({
                "id": cls,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })

    return detections


# =========================
# SCALE BBOX
# =========================
def scale_bbox(detections, original_size, resized_size):
    orig_w, orig_h = original_size
    resized_w, resized_h = resized_size

    scale_x = orig_w / resized_w
    scale_y = orig_h / resized_h

    scaled = []

    for d in detections:
        x1, y1, x2, y2 = d["bbox"]

        scaled.append({
            "id": d["id"],
            "confidence": d["confidence"],
            "bbox": [
                x1 * scale_x,
                y1 * scale_y,
                x2 * scale_x,
                y2 * scale_y
            ]
        })

    return scaled


# =========================
# FIX MIRROR BBOX BACK
# =========================
def unmirror_bbox(detections, width):
    fixed = []

    for d in detections:
        x1, y1, x2, y2 = d["bbox"]

        x1_new = width - x2
        x2_new = width - x1

        fixed.append({
            "id": d["id"],
            "confidence": d["confidence"],
            "bbox": [x1_new, y1, x2_new, y2]
        })

    return fixed


# =========================
# MAIN DETECTION (AUTO MIRROR)
# =========================
def detect_image_auto(img_bytes, original_size, resized_size):
    file_bytes = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # --- NORMAL DETECTION ---
    normal_det = run_detection(img)

    # --- MIRRORED DETECTION ---
    flipped_img = cv2.flip(img, 1)
    flipped_det = run_detection(flipped_img)

    # 👉 Choose better result
    normal_score = sum(d["confidence"] for d in normal_det)
    flipped_score = sum(d["confidence"] for d in flipped_det)

    if flipped_score > normal_score:
        # 🔥 Use flipped result → but convert back
        scaled = scale_bbox(flipped_det, original_size, resized_size)
        final = unmirror_bbox(scaled, original_size[0])
    else:
        # 🔥 Use normal result
        final = scale_bbox(normal_det, original_size, resized_size)

    return final


# =========================
# PROCESS IMAGES
# =========================
def process_images(files):
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
# VIDEO (OPTIONAL SIMPLE VERSION)
# =========================
def detect_video(video_bytes, frame_interval=5):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_video:
        tmp_video.write(video_bytes)
        temp_path = tmp_video.name

    cap = cv2.VideoCapture(temp_path)
    mp4_path = None

    if not cap.isOpened():
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
            detections = run_detection(frame)

            results_list.append({
                "frame_id": frame_id,
                "results": detections
            })

        frame_id += 1

    cap.release()
    os.remove(temp_path)

    if mp4_path and os.path.exists(mp4_path):
        os.remove(mp4_path)

    return results_list