"""Authentication endpoints (Cognito)."""
from pydantic import BaseModel, EmailStr, Field

from fastapi import APIRouter, HTTPException, status

from config import settings
from schemas.auth import (
    ConfirmRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    TokenResponse,
)
from services.cognito import cognito_client

router = APIRouter(prefix="/auth", tags=["auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ConfirmForgotPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=10)
    new_password: str = Field(min_length=8, max_length=128)


class ResendRequest(BaseModel):
    email: EmailStr


@router.post("/register", response_model=MessageResponse, status_code=201)
def register(payload: RegisterRequest):
    client = cognito_client()
    attributes = [{"Name": "email", "Value": payload.email}]
    if payload.name:
        attributes.append({"Name": "name", "Value": payload.name.strip()})
    try:
        client.sign_up(
            ClientId=settings.COGNITO_CLIENT_ID,
            Username=payload.email,
            Password=payload.password,
            UserAttributes=attributes,
        )
        return MessageResponse(message="User registered successfully")
    except client.exceptions.UsernameExistsException:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    except client.exceptions.InvalidPasswordException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except client.exceptions.InvalidParameterException as e:
        # Most common cause: User Pool isn't configured to accept the 'name' attribute.
        # Retry without it so the user can still sign up; they'll set it in onboarding.
        if payload.name:
            try:
                client.sign_up(
                    ClientId=settings.COGNITO_CLIENT_ID,
                    Username=payload.email,
                    Password=payload.password,
                    UserAttributes=[{"Name": "email", "Value": payload.email}],
                )
                return MessageResponse(message="User registered successfully")
            except Exception as inner:
                raise HTTPException(status_code=400, detail=str(inner))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    client = cognito_client()
    try:
        resp = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": payload.email, "PASSWORD": payload.password},
            ClientId=settings.COGNITO_CLIENT_ID,
        )
        result = resp["AuthenticationResult"]
        return TokenResponse(
            token=result["IdToken"],
            access=result["AccessToken"],
            refresh=result["RefreshToken"],
        )
    except client.exceptions.NotAuthorizedException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    except client.exceptions.UserNotConfirmedException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Please confirm your email first"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/confirm", response_model=MessageResponse)
def confirm(payload: ConfirmRequest):
    client = cognito_client()
    try:
        client.confirm_sign_up(
            ClientId=settings.COGNITO_CLIENT_ID,
            Username=payload.email,
            ConfirmationCode=payload.code,
        )
        return MessageResponse(message="Email confirmed successfully")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/resend", response_model=MessageResponse)
def resend(payload: ResendRequest):
    client = cognito_client()
    try:
        client.resend_confirmation_code(
            ClientId=settings.COGNITO_CLIENT_ID, Username=payload.email
        )
        return MessageResponse(message="Confirmation code resent")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest):
    client = cognito_client()
    try:
        client.forgot_password(
            ClientId=settings.COGNITO_CLIENT_ID, Username=payload.email
        )
        return MessageResponse(message="Reset code sent to your email")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ConfirmForgotPasswordRequest):
    client = cognito_client()
    try:
        client.confirm_forgot_password(
            ClientId=settings.COGNITO_CLIENT_ID,
            Username=payload.email,
            ConfirmationCode=payload.code,
            Password=payload.new_password,
        )
        return MessageResponse(message="Password reset successful")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
