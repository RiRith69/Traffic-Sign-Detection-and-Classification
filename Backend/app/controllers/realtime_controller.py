# realtime_controller.py
from flask import Blueprint, request, jsonify
from app.services.realtime_service import process_frame, latest_detection

realtime_bp = Blueprint("realtime", __name__)

@realtime_bp.route("/frame", methods=["POST"])
def receive_frame():
    if "frame" not in request.files:
        return jsonify({"error": "No frame uploaded"}), 400

    file = request.files["frame"]
    frame_bytes = file.read()
    process_frame(frame_bytes)

    # Return latest detection with boxes
    return jsonify({
        "label": latest_detection.get("label", "Detection processing..."),
        "confidence": latest_detection.get("confidence", 0),
        "boxes": latest_detection.get("boxes", [])
    })

@realtime_bp.route("/latest", methods=["GET"])
def get_latest_detection():
    return jsonify({
        "label": latest_detection.get("label", "Detection processing..."),
        "confidence": latest_detection.get("confidence", 0),
        "boxes": latest_detection.get("boxes", [])
    })