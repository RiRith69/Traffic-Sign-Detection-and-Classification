# app/controllers/realtime_controller.py
from flask import Response
from app.services.realtime_service import generate_camera_stream

def realtime_camera_controller():
    """
    Endpoint that streams camera with YOLO detection
    """
    return Response(generate_camera_stream(camera_id=0, frame_interval=1),
                    mimetype='multipart/x-mixed-replace; boundary=frame')