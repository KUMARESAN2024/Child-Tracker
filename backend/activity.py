from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db import db, get_db
from typing import List

router = APIRouter()

class ActivityIn(BaseModel):
    child_name: str
    activity: dict

@router.post("/activity")
async def add_activity(data: ActivityIn, db=Depends(get_db)):
    result = await db["children"].update_one({"name": data.child_name}, {"$push": {"activities": data.activity}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Child not found")
    return {"msg": "Activity added"}

@router.get("/activity/{child_name}")
async def get_activities(child_name: str, db=Depends(get_db)):
    child = await db["children"].find_one({"name": child_name})
    if not child or "activities" not in child:
        raise HTTPException(status_code=404, detail="No activities found")
    return child["activities"]
