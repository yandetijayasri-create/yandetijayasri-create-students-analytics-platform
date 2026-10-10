from fastapi import APIRouter, Depends
from typing import Dict, Any
from ..schemas.student import StudentResponse, StudentUpdate, OnboardingRequest, OnboardingResponse
from ..services.student_service import student_service
from .auth import get_current_user_id

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=Dict[str, Any])
def get_profile(student_id: str = Depends(get_current_user_id)):
    return student_service.get_profile(student_id)

@router.put("", response_model=Dict[str, Any])
def update_profile(updates: StudentUpdate, student_id: str = Depends(get_current_user_id)):
    clean_updates = updates.model_dump(exclude_unset=True)
    return student_service.update_profile(student_id, clean_updates)

@router.post("/onboarding", response_model=OnboardingResponse)
def onboard_student(req: OnboardingRequest, student_id: str = Depends(get_current_user_id)):
    data = req.model_dump()
    # Normalize field names
    if "available_study_time" in data and not data.get("daily_study_hours"):
        data["daily_study_hours"] = data["available_study_time"]
    if "preferred_study_time" in data and not data.get("preferred_time"):
        data["preferred_time"] = data["preferred_study_time"]

    result = student_service.complete_onboarding(student_id, data)
    return OnboardingResponse(**result)
