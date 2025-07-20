from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from children import router as children_router
from safezone import router as safezone_router
from activity import router as activity_router

app = FastAPI()

origins = [
    "https://child-safety-tracker.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/users")
app.include_router(children_router, prefix="/api")
app.include_router(safezone_router, prefix="/api")
app.include_router(activity_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Child Tracking Backend is running"}
