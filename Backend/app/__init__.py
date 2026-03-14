from flask import Flask
from app.routes.detection_routes import detection_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(detection_bp, url_prefix="/api")
    return app