import os
from flask import Flask
from flask_cors import CORS
from app.routes.detection_routes import detection_bp
from app.extensions import socketio

def create_app():
    app = Flask(
        __name__,
        static_folder="static",
        static_url_path="/static"  
    )

    # Enable CORS
    CORS(app, origins=["http://localhost:5173"])

    # Register API routes
    app.register_blueprint(detection_bp, url_prefix="/api")

    # Init socket
    socketio.init_app(app, async_mode="threading", cors_allowed_origins="*")

    # Ensure tmp_videos folder exists
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    TMP_VIDEO_PATH = os.path.join(BASE_DIR, "static", "tmp_videos")
    os.makedirs(TMP_VIDEO_PATH, exist_ok=True)

    print("TMP_VIDEO_PATH:", TMP_VIDEO_PATH)

    return app