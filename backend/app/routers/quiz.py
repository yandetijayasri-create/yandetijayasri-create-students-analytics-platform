from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from ..schemas.quiz import (
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    SanitizedQuizQuestion,
    QuestionDetailResult
)
from ..services.quiz_service import quiz_service
from .auth import get_current_user_id

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.get("/generate", response_model=QuizGenerateResponse)
def generate_quiz_get(
    subject: str = "Data Structures & Algorithms",
    topic: str = "Graphs",
    difficulty: str = "Medium",
    count: int = 4,
    current_user_id: str = Depends(get_current_user_id)
):
    result = quiz_service.generate_quiz(
        subject=subject,
        topic=topic,
        difficulty=difficulty,
        number_of_questions=count
    )
    return QuizGenerateResponse(
        quiz_id=result["quiz_id"],
        topic=result.get("topic"),
        subject=result.get("subject"),
        questions=[SanitizedQuizQuestion(**q) for q in result["questions"]],
        total_questions=result["total_questions"]
    )

@router.post("/generate", response_model=QuizGenerateResponse)
def generate_quiz(filters: QuizGenerateRequest, current_user_id: str = Depends(get_current_user_id)):
    num_q = filters.count if filters.count is not None else (filters.number_of_questions or 5)
    result = quiz_service.generate_quiz(
        subject=filters.subject,
        topic=filters.topic,
        difficulty=filters.difficulty,
        number_of_questions=num_q
    )
    return QuizGenerateResponse(
        quiz_id=result["quiz_id"],
        topic=result.get("topic"),
        subject=result.get("subject"),
        questions=[SanitizedQuizQuestion(**q) for q in result["questions"]],
        total_questions=result["total_questions"]
    )

@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz(submission: QuizSubmitRequest, current_user_id: str = Depends(get_current_user_id)):
    student_id = submission.student_id or current_user_id
    sub_data = submission.model_dump()
    result = quiz_service.submit_quiz(sub_data, student_id=student_id)

    return QuizResultResponse(
        score=result["score"],
        totalQuestions=result["totalQuestions"],
        accuracyPercentage=result["accuracyPercentage"],
        correctAnswersCount=result["correctAnswersCount"],
        incorrectAnswersCount=result["incorrectAnswersCount"],
        timeSpent=result["timeSpent"],
        questionDetails=[QuestionDetailResult(**q) for q in result["questionDetails"]],
        updatedMastery=result.get("updatedMastery"),
        topRecommendation=result.get("topRecommendation"),
        learningGaps=result.get("learningGaps"),
        message=result.get("message")
    )
