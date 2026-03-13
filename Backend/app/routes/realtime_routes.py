# app/routes/realtime_routes.py
from flask import Blueprint
from app.controllers.realtime_controller import realtime_camera_controller

realtime_bp = Blueprint("realtime", __name__)

# Access live camera stream
realtime_bp.route("/stream/camera", methods=["GET"])(realtime_camera_controller)