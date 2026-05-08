from flask import Blueprint, request, jsonify
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint("auth", __name__)

client = boto3.client("cognito-idp", region_name=os.getenv("AWS_REGION", "us-east-1"))
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    try:
        client.sign_up(
            ClientId=CLIENT_ID,
            Username=data["email"],
            Password=data["password"],
            UserAttributes=[{"Name": "email", "Value": data["email"]}]
        )
        return jsonify({"message": "User registered successfully"}), 201
    except client.exceptions.UsernameExistsException:
        return jsonify({"error": "User already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    try:
        resp = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": data["email"],
                "PASSWORD": data["password"]
            },
            ClientId=CLIENT_ID
        )
        return jsonify({
            "token":   resp["AuthenticationResult"]["IdToken"],
            "access":  resp["AuthenticationResult"]["AccessToken"],
            "refresh": resp["AuthenticationResult"]["RefreshToken"]
        }), 200
    except client.exceptions.NotAuthorizedException:
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400