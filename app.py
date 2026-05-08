from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.events import events_bp
from routes.briefing import briefing_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp,     url_prefix="/auth")
app.register_blueprint(events_bp,   url_prefix="/events")
app.register_blueprint(briefing_bp, url_prefix="/briefing")

if __name__ == "__main__":
    app.run(debug=True)