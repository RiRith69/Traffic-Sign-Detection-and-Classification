from app.extensions import socketio
from app.services.realtime_service import process_frame
from flask_socketio import emit
import base64

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("frame")
def handle_frame(data):
    socketio.start_background_task(process_and_emit, data)


def process_and_emit(data):
    try:
        img_bytes = base64.b64decode(data.split(",")[1])

        result = process_frame(img_bytes)

        socketio.emit("result", result)

    except Exception as e:
        print("Frame processing error:", e)
        socketio.emit("result", {
            "label": "Error",
            "confidence": 0,
            "boxes": []
        })