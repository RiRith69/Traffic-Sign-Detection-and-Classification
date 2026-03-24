import os
from flask import request, jsonify
from app.services.yolo_service import detect_video, process_images


def detect_multiple_images_controller():
    files = request.files.getlist("images")
    if not files:
        all_files = list(request.files.values())
        if all_files:
            files = all_files
        else:
            return jsonify({"error": "No images uploaded"}), 400

    results = process_images(files)
    return jsonify({"success": True, "results": results})


def detect_video_controller():
    files = list(request.files.values())
    if not files:
        return jsonify({"error": "No video uploaded"}), 400

    video_file = files[0]
    frame_interval = int(request.form.get("frame_interval", 5))
    video_bytes = video_file.read()

    detections, video_path = detect_video(video_bytes, frame_interval=frame_interval)

    filename = os.path.basename(video_path)

    print("Saved video:", filename)

    return jsonify({
        "success": True,
        "results": detections,
        "video_url": f"/static/{filename}"   
    })