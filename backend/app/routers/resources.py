from fastapi import APIRouter, Query
from typing import List, Optional
from pydantic import BaseModel
from ..db.repository import db

router = APIRouter(prefix="/resources", tags=["Resources"])

class ResourceSchema(BaseModel):
    id: str
    title: str
    subject: str
    topic: str
    type: str
    duration: str
    isAIRecommended: bool
    recommendationReason: Optional[str] = None
    url: Optional[str] = "#"
    readCount: Optional[int] = 100

@router.get("", response_model=List[ResourceSchema])
def get_resources(
    subject: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    results = db.resources

    if subject:
        results = [r for r in results if subject.lower() in r["subject"].lower()]
    if topic:
        results = [r for r in results if topic.lower() in r["topic"].lower()]
    if resource_type:
        results = [r for r in results if resource_type.lower() in r["type"].lower()]
    if search:
        s = search.lower()
        results = [r for r in results if s in r["title"].lower() or s in r["topic"].lower()]

    return [ResourceSchema(**r) for r in results]
