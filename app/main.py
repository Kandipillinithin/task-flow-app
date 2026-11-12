from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
import app.models.user
import app.models.task
from app.api.auth import router as auth_router
from app.api.tasks import router as tasks_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
    description="Role-Based Task & Workflow Management System",
    version="1.0.0",
)

# Allow React app origins
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")


@app.get("/")
def health_check():
    return {"status": "healthy", "service": "TaskFlow Backend"}