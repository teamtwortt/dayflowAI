"""User profile + preferences endpoints."""
from fastapi import APIRouter, Depends

from api.deps import get_current_user
from schemas.user import UpdatePreferencesRequest, UserPreferences, UserProfile
from services.dynamo import get_user_prefs, upsert_user_prefs

router = APIRouter(prefix="/users", tags=["users"])


def _jwt_str_claim(user: dict, *keys: str) -> str | None:
    for k in keys:
        v = user.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return None


def _jwt_email(user: dict) -> str:
    mail = _jwt_str_claim(user, "email")
    if mail:
        return mail
    username = user.get("cognito:username")
    if isinstance(username, str) and "@" in username:
        return username.strip()
    return ""


def _jwt_display_name(user: dict) -> str | None:
    named = _jwt_str_claim(
        user, "name", "given_name", "nickname", "preferred_username"
    )
    if named:
        return named
    mail = _jwt_email(user)
    if mail and "@" in mail:
        return mail.split("@")[0]
    username = user.get("cognito:username")
    if isinstance(username, str) and username.strip():
        return username.split("@")[0] if "@" in username else username.strip()
    return None


@router.get("/me", response_model=UserProfile)
def me(user: dict = Depends(get_current_user)):
    prefs = get_user_prefs(user["sub"])
    email = _jwt_email(user)
    name = _jwt_display_name(user)
    return UserProfile(
        sub=user["sub"],
        email=email,
        name=name,
        preferences=UserPreferences(**prefs),
    )


@router.put("/me/preferences", response_model=UserPreferences)
def update_preferences(
    payload: UpdatePreferencesRequest, user: dict = Depends(get_current_user)
):
    merged = upsert_user_prefs(
        user["sub"],
        _jwt_email(user),
        payload.model_dump(exclude_none=True),
    )
    return UserPreferences(**merged)
