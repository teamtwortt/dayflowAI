import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.ai import router as ai_router
from api.auth import router as auth_router
from api.briefing import router as briefing_router
from api.events import router as events_router
from api.users import router as users_router
from config import settings


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-7s %(name)s — %(message)s",
)
logger = logging.getLogger("dayflow")


def create_app() -> FastAPI:
    app = FastAPI(
        title="DayFlow AI API",
        description=(
            "Serverless personal productivity assistant — FastAPI backend.\n\n"
            "Features: Cognito auth, event CRUD, weather-aware briefings, "
            "Bedrock-powered AI parsing & chat, EventBridge-driven daily dispatch."
        ),
        version="1.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_timing(request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Response-Time-ms"] = f"{elapsed_ms:.1f}"
        logger.info(
            "%s %s -> %s (%.1f ms)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response

    app.include_router(auth_router)
    app.include_router(events_router)
    app.include_router(briefing_router)
    app.include_router(users_router)
    app.include_router(ai_router)

    @app.get("/", tags=["health"])
    def root():
        return JSONResponse(
            {
                "name": "DayFlow AI API",
                "status": "ok",
                "version": "1.1.0",
                "docs": "/docs",
            }
        )

    @app.get("/health", tags=["health"])
    def health():
        return {
            "status": "healthy",
            "region": settings.AWS_REGION,
            "cognito_configured": bool(settings.COGNITO_USER_POOL_ID and settings.COGNITO_CLIENT_ID),
            "weather_configured": bool(settings.WEATHER_API_KEY),
        }

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
