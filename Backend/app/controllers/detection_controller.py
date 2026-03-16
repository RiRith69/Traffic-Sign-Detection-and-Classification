# app/controllers/detection_controller.py
from flask import request, jsonify
from app.services.yolo_service import process_images, detect_video


def detect_multiple_images_controller():
    files = request.files.getlist("images")

    if not files:
        all_files = list(request.files.values())
        if all_files:
            files = all_files
        else:
            return jsonify({"error": "No images uploaded"}), 400

    results = process_images(files)

    return jsonify({
        "success": True,
        "results": results
    })


def detect_video_controller():
    # Get uploaded files
    files = list(request.files.values())

    if not files:
        return jsonify({"error": "No video uploaded"}), 400

    video_file = files[0]

    # Get frame interval from frontend (default = 5)
    frame_interval = int(request.form.get("frame_interval", 5))

    # Convert FileStorage → bytes
    video_bytes = video_file.read()

    # Run detection
    results = detect_video(video_bytes, frame_interval=frame_interval)

    return jsonify({
        "success": True,
        "results": results
    })