"""User profile + preferences endpoints."""
from fastapi import APIRouter, Depends

from api.deps import get_current_user
from schemas.user import UpdatePreferencesRequest, UserPreferences, UserProfile
from services.dynamo import get_user_prefs, upsert_user_prefs

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfile)
def me(user: dict = Depends(get_current_user)):
    prefs = get_user_prefs(user["sub"])
    name = (
        user.get("name")
        or user.get("given_name")
        or (user.get("email", "").split("@")[0] if user.get("email") else None)
    )
    return UserProfile(
        sub=user["sub"],
        email=user.get("email", ""),
        name=name,
        preferences=UserPreferences(**prefs),
    )


@router.put("/me/preferences", response_model=UserPreferences)
def update_preferences(
    payload: UpdatePreferencesRequest, user: dict = Depends(get_current_user)
):
    merged = upsert_user_prefs(
        user["sub"],
        user.get("email", ""),
        payload.model_dump(exclude_none=True),
    )
    return UserPreferences(**merged)
