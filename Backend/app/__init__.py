# app/__init__.py
from flask import Flask
from app.routes.detection_routes import detection_bp
from app.routes.realtime_routes import realtime_routes_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(detection_bp, url_prefix="/api")
    app.register_blueprint(realtime_routes_bp, url_prefix="/api/realtime")

    return app