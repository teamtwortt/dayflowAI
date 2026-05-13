"""Cognito JWT verification + user management."""
from functools import lru_cache
from typing import Optional

import boto3
import requests
from jose import jwt, JWTError

from config import settings


_client = boto3.client("cognito-idp", region_name=settings.AWS_REGION)


def cognito_client():
    return _client


@lru_cache(maxsize=1)
def _jwks() -> dict:
    url = (
        f"https://cognito-idp.{settings.AWS_REGION}.amazonaws.com/"
        f"{settings.COGNITO_USER_POOL_ID}/.well-known/jwks.json"
    )
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
    return resp.json()


def verify_token(token: str) -> Optional[dict]:
    """Verify a Cognito ID token and return its claims, or None on failure."""
    if not token:
        return None
    try:
        jwks = _jwks()
        headers = jwt.get_unverified_headers(token)
        key = next((k for k in jwks["keys"] if k["kid"] == headers["kid"]), None)
        if not key:
            return None
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.COGNITO_CLIENT_ID,
            options={"verify_exp": True},
        )
        return claims
    except (JWTError, StopIteration, requests.RequestException):
        return None
