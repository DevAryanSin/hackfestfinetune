import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys

# Add the parent directory and nested modules so we can import them
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from .routers import sessions
from brd_module.storage import init_db

OPTIONAL_APP_ROUTERS = []
for module_path in (
    "api.routers.ingest",
    "api.routers.review",
    "api.routers.brd",
):
    try:
        module = __import__(module_path, fromlist=["router"])
        OPTIONAL_APP_ROUTERS.append(module.router)
    except ModuleNotFoundError as e:
        print(f"WARNING: Skipping optional router '{module_path}': {e}")

OPTIONAL_INTEGRATION_ROUTERS = []
for module_path in (
    "integration_module.routes.gmail_routes",
    "integration_module.routes.slack_routes",
    "integration_module.routes.pdf_routes",
):
    try:
        module = __import__(module_path, fromlist=["router"])
        OPTIONAL_INTEGRATION_ROUTERS.append(module.router)
    except ModuleNotFoundError as e:
        print(f"WARNING: Skipping optional router '{module_path}': {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database (PG or SQLite fallback) AFTER uvicorn has bound the port
    port = os.getenv("PORT", "unknown")
    print(f"INFO: BRD Generation API starting up on port {port}...")
    try:
        init_db()
        print("INFO: Database initialized successfully.")
    except Exception as e:
        print(f"WARNING: Database initialization failed: {e}")
    
    print("INFO: API is ready to receive requests.")
    yield  # App runs here
    print("INFO: API shutting down...")


app = FastAPI(
    title="BRD Generation API",
    description="API for the Attributed Knowledge Store and BRD Generation Pipeline",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
for optional_router in OPTIONAL_APP_ROUTERS:
    app.include_router(optional_router)
for optional_router in OPTIONAL_INTEGRATION_ROUTERS:
    app.include_router(optional_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "BRD Generation API is running."}
