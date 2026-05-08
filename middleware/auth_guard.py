from functools import wraps
from flask import request, jsonify
from services.cognito import verify_token

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        if not token:
            return jsonify({"error": "Missing token"}), 401

        user = verify_token(token)
        if not user:
            return jsonify({"error": "Invalid or expired token"}), 403

        request.user = user
        return f(*args, **kwargs)
    return decorated