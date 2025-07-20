from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db import db, get_db

router = APIRouter()

class SafeZoneIn(BaseModel):
    child_name: str
    safe_zone: dict

@router.post("/safezone")
async def set_safe_zone(data: SafeZoneIn, db=Depends(get_db)):
    result = await db["children"].update_one({"name": data.child_name}, {"$set": {"safe_zone": data.safe_zone}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Child not found")
    return {"msg": "Safe zone updated"}

@router.get("/safezone/{child_name}")
async def get_safe_zone(child_name: str, db=Depends(get_db)):
    child = await db["children"].find_one({"name": child_name})
    if not child or "safe_zone" not in child:
        raise HTTPException(status_code=404, detail="Safe zone not found")
    return child["safe_zone"]
