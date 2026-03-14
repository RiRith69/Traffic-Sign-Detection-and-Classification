from flask_cors import CORS
from flask import Blueprint
from app.controllers.realtime_controller import realtime_bp

# Create a wrapper blueprint
realtime_routes_bp = Blueprint("realtime_routes", __name__)

# Enable CORS for your React frontend
CORS(realtime_bp, origins=["http://localhost:5173"])

# Register the controller blueprint inside this wrapper
realtime_routes_bp.register_blueprint(realtime_bp, url_prefix="")