from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import (
    auth,
    profile,
    dashboard,
    study_plan,
    quiz,
    mistakes,
    progress,
    recommendations,
    resources,
    ai,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="ELEVΛLTE — AI-Powered Student Success Platform REST Backend",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
)

# CORS middleware for Next.js frontend communication
# Controlled via CORS_ORIGINS from environment config
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all domain routers with API v1 prefix
api_prefix = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=api_prefix)
app.include_router(profile.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)
app.include_router(study_plan.router, prefix=api_prefix)
app.include_router(quiz.router, prefix=api_prefix)
app.include_router(mistakes.router, prefix=api_prefix)
app.include_router(progress.router, prefix=api_prefix)
app.include_router(recommendations.router, prefix=api_prefix)
app.include_router(resources.router, prefix=api_prefix)
app.include_router(ai.router, prefix=api_prefix)

from fastapi.responses import RedirectResponse

@app.get("/", include_in_schema=False)
def root():
    return {
        "platform": "ELEVΛLTE",
        "tagline": "Learn Smarter • Grow Faster • Achieve More",
        "status": "operational",
        "docs": f"{settings.API_V1_PREFIX}/docs",
        "environment": settings.MODE
    }

@app.get("/health", tags=["System"])
@app.get(f"{settings.API_V1_PREFIX}/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "platform": "ELEVΛLTE",
        "version": settings.VERSION
    }

@app.get("/docs", include_in_schema=False)
def redirect_docs():
    return RedirectResponse(url=f"{settings.API_V1_PREFIX}/docs")

@app.get("/redoc", include_in_schema=False)
def redirect_redoc():
    return RedirectResponse(url=f"{settings.API_V1_PREFIX}/redoc")
