from flask import Blueprint, request, jsonify
from middleware.auth_guard import require_auth
from services.dynamo import get_events, create_event, update_event, delete_event

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["GET"])
@require_auth
def list_events():
    events = get_events(request.user["sub"])
    return jsonify(events), 200

@events_bp.route("/", methods=["POST"])
@require_auth
def add_event():
    data = request.get_json()
    event = create_event(request.user["sub"], data)
    return jsonify(event), 201

@events_bp.route("/<event_id>", methods=["PUT"])
@require_auth
def edit_event(event_id):
    data = request.get_json()
    event = update_event(request.user["sub"], event_id, data)
    return jsonify(event), 200

@events_bp.route("/<event_id>", methods=["DELETE"])
@require_auth
def remove_event(event_id):
    delete_event(request.user["sub"], event_id)
    return jsonify({"message": "Deleted"}), 200