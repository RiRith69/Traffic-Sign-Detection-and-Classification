# app/services/realtime_service.py
import cv2
from ultralytics import YOLO
from app.config import Config

# Load YOLO model once
model = YOLO(Config.MODEL_PATH)

def generate_camera_stream(camera_id=0, frame_interval=1):
    """
    Generator that yields MJPEG frames with YOLO detections
    """
    cap = cv2.VideoCapture(camera_id)
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run detection every N frames
        if frame_count % frame_interval == 0:
            results = model(frame)
            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    conf = float(box.conf)
                    cls = int(box.cls)
                    # Draw bbox and label on the frame
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    cv2.putText(frame, f"{model.names[cls]} {conf:.2f}", 
                                (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        frame_count += 1

        # Encode frame as JPEG
        ret, jpeg = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        # Yield frame in MJPEG format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

    cap.release()