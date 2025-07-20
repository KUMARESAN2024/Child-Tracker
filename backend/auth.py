
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db import db, get_db
from passlib.context import CryptContext
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserIn(BaseModel):
    fullName: str = None
    email: str
    phone: str = None
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(user: UserIn, db=Depends(get_db)):
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed
    await db["users"].insert_one(user_dict)
    return {
        "success": True,
        "message": "User registered",
        "user": {
            "email": user.email,
            "phone": user.phone,
            "fullName": user.fullName
        },
        "token": "dummy_token"
    }

@router.post("/login")
async def login(user: UserLogin, db=Depends(get_db)):
    db_user = await db["users"].find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "email": db_user["email"],
            "phone": db_user.get("phone", ""),
            "fullName": db_user.get("fullName", "")
        },
        "token": token
    }
