# app/services/yolo_service.py
import cv2, json
import numpy as np
import tempfile
import subprocess
import os
from ultralytics import YOLO
from PIL import Image, ImageOps
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


MAX_SIZE = 1280
JPEG_QUALITY = 55

def preprocess_image(img_bytes):
    """Resize, fix orientation and compress image to match training conditions"""
    img = Image.open(io.BytesIO(img_bytes))

    # ── Step 1: Fix rotation from EXIF (phone uploads) ────
    img = ImageOps.exif_transpose(img)

    # ── Step 2: Fix transparency (PNG uploads) ─────────────
    if img.mode == 'RGBA':
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    else:
        img = img.convert('RGB')

    # ── Step 3: Resize while keeping aspect ratio ──────────
    img.thumbnail((MAX_SIZE, MAX_SIZE))

    # ── Step 4: Save to buffer with compression ────────────
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=JPEG_QUALITY)
    buffer.seek(0)

    return buffer.read()


def process_images(files):
    """Process multiple uploaded images"""
    response = []

    for idx, file in enumerate(files):
        original_bytes = file.read()

        # Preprocess before detection (includes flip fix)
        processed_bytes = preprocess_image(original_bytes)

        # Run detection on optimized image
        detections = detect_image(processed_bytes)

        response.append({
            "id": idx,
            "filename": file.filename,
            "results": detections
        })

    return response

# -----------------------------------Video---------------------------
def get_video_rotation(video_path):
    """Get rotation angle from video metadata using ffprobe"""
    try:
        result = subprocess.run([
            "ffprobe", "-v", "quiet",
            "-print_format", "json",
            "-show_streams", video_path
        ], capture_output=True, text=True)

        data = json.loads(result.stdout)
        for stream in data.get('streams', []):
            tags = stream.get('tags', {})
            rotation = int(tags.get('rotate', 0))
            if rotation:
                return rotation
    except:
        pass
    return 0


def fix_frame_rotation(frame, rotation):
    """Fix frame rotation based on video metadata"""
    if rotation == 90:
        return cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
    elif rotation == 180:
        return cv2.rotate(frame, cv2.ROTATE_180)
    elif rotation == 270:
        return cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return frame


def detect_video(video_bytes, frame_interval=5):
    """
    Detect traffic signs in a video of any format.
    Returns frame-wise detections with class IDs.
    """
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

    # Fix rotation from video metadata
    check_path = mp4_path if mp4_path else temp_path
    rotation = get_video_rotation(check_path)

    results_list = []
    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_interval == 0:
            # Fix frame rotation before detection
            frame = fix_frame_rotation(frame, rotation)

            frame_results = model(frame)
            frame_detections = []
            for r in frame_results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    conf = float(box.conf)
                    cls = int(box.cls)
                    frame_detections.append({
                        "id": cls,
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