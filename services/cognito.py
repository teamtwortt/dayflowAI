import os
import requests
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

REGION       = os.getenv("AWS_REGION", "us-east-1")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID    = os.getenv("COGNITO_CLIENT_ID")

def get_jwks():
    url = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
    return requests.get(url).json()

def verify_token(token: str):
    try:
        jwks    = get_jwks()
        headers = jwt.get_unverified_headers(token)
        key     = next(k for k in jwks["keys"] if k["kid"] == headers["kid"])
        claims  = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            options={"verify_exp": True}
        )
        return claims
    except JWTError as e:
        print(f"JWT Error: {e}")
        return None
    except StopIteration:
        print("No matching key found")
        return None
    except Exception as e:
        print(f"Token error: {e}")
        return None