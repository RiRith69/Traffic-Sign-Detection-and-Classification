from flask import Blueprint
from flask_cors import cross_origin
from app.controllers.detection_controller import detect_multiple_images_controller, detect_video_controller

detection_bp = Blueprint("detection", __name__)

detection_bp.route("/detect/images", methods=["POST"])(
    cross_origin(origin="http://localhost:5173")(detect_multiple_images_controller)
)

detection_bp.route("/detect/video", methods=["POST"])(
    cross_origin(origin="http://localhost:5173")(detect_video_controller)
)