import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION          = os.getenv("AWS_REGION", "us-east-1")
WEATHER_API_KEY     = os.getenv("WEATHER_API_KEY")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
COGNITO_CLIENT_ID   = os.getenv("COGNITO_CLIENT_ID")