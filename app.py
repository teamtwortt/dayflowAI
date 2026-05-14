from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.auth import auth_bp
from routes.events import events_bp
from routes.briefing import briefing_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(events_bp, url_prefix="/events")
app.register_blueprint(briefing_bp, url_prefix="/briefing")

@app.route("/")
def home():
    return send_from_directory("frontend", "index.html")

@app.route("/index.html")
def index_html():
    return send_from_directory("frontend", "index.html")

@app.route("/dashboard")
def dashboard():
    return send_from_directory("frontend", "dashboard.html")

@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory("frontend/js", filename)

if __name__ == "__main__":
    app.run(debug=True)