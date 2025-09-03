from fastapi import FastAPI
# Import all three routers
from .api.routers import personas, orchestrator, are

app = FastAPI(
    title="Aurora Genesis Engine API",
    description="The backend service for creating and managing advanced AI agents.",
    version="1.0.0"
)

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "Aurora Genesis Engine is online and operational."}

# Include all three API routers
app.include_router(personas.router, prefix="/api/v1/personas", tags=["Personas"])
app.include_router(orchestrator.router, prefix="/api/v1/orchestrator", tags=["Orchestrator"])
app.include_router(are.router, prefix="/api/v1/are", tags=["ARE Crucible"])