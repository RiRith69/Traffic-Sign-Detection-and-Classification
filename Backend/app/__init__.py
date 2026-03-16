# app/__init__.py
from flask import Flask
from flask_cors import CORS
from app.routes.detection_routes import detection_bp
from app.extensions import socketio
import app.controllers.realtime_controller  # <-- just import, no function needed

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    app.register_blueprint(detection_bp, url_prefix="/api")
    socketio.init_app(app, cors_allowed_origins="*")

    return app