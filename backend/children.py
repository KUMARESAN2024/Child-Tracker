
from fastapi import APIRouter, Depends, HTTPException, Body
from bson import ObjectId
from pydantic import BaseModel
from db import db, get_db, Child
from typing import List

router = APIRouter()

# Endpoint to update a child's location by _id
@router.put("/children/update-location/{child_id}")
async def update_child_location(child_id: str, location: dict = Body(...), db=Depends(get_db)):
    result = await db["children"].update_one(
        {"_id": ObjectId(child_id)},
        {"$set": {"latitude": str(location.get("latitude", "")), "longitude": str(location.get("longitude", ""))}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Child not found")
    updated = await db["children"].find_one({"_id": ObjectId(child_id)})
    updated["_id"] = str(updated["_id"])
    return updated


# Accept all fields from frontend formData
class ChildIn(BaseModel):
    userEmail: str
    name: str
    age: str = ""
    gender: str = ""
    location: str = ""
    latitude: str = ""
    longitude: str = ""
    parentContact: str = ""
    emergencyContact: str = ""
    healthConditions: str = ""
    schoolName: str = ""
    grade: str = ""
    safe_zone: dict = {}
    activities: List[dict] = []



@router.post("/api/users/children")
async def add_child(child: ChildIn, db=Depends(get_db)):
    # Store userEmail as email for lookup
    child_dict = child.dict()
    child_dict["email"] = child_dict.pop("userEmail")
    await db["children"].insert_one(child_dict)
    # Return all children for frontend compatibility
    children = await db["children"].find().to_list(100)
    for c in children:
        c["_id"] = str(c["_id"])
    return {"msg": "Child added", "children": children}

@router.get("/api/users/children")
async def get_children(db=Depends(get_db)):
    children = await db["children"].find().to_list(100)
    for c in children:
        c["_id"] = str(c["_id"])
    return children


