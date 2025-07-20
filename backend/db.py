# MongoDB connection and models for FastAPI backend
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import Optional, List

import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "child_tracking"

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# User model
class User(BaseModel):
    username: str
    password: str

# Child model
class Child(BaseModel):
    name: str
    location: Optional[dict] = None
    safe_zone: Optional[dict] = None
    activities: Optional[List[dict]] = []

# Dependency to get DB
async def get_db():
    return db
