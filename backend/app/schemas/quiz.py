from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class QuizOption(BaseModel):
    id: str
    text: str

class SanitizedQuizQuestion(BaseModel):
    id: int
    subject: str
    topic: str
    difficulty: str
    question: str
    options: List[QuizOption]
    # NOTE: correctAnswer and explanation are omitted for anti-cheat security!

class QuizQuestionSchema(BaseModel):
    id: int
    subject: str
    topic: str
    difficulty: str
    question: str
    options: List[QuizOption]
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None

class QuizGenerateRequest(BaseModel):
    subject: Optional[str] = "Data Structures & Algorithms"
    topic: Optional[str] = "Graphs"
    difficulty: Optional[str] = "Medium"
    count: Optional[int] = None
    number_of_questions: Optional[int] = 5
    student_id: Optional[str] = None

class QuizGenerateResponse(BaseModel):
    quiz_id: str
    topic: Optional[str] = None
    subject: Optional[str] = None
    questions: List[SanitizedQuizQuestion]
    total_questions: int

class QuestionSubmission(BaseModel):
    questionId: int
    selectedAnswer: str

class QuizSubmitRequest(BaseModel):
    answers: List[QuestionSubmission]
    timeSpentSeconds: int = 120
    student_id: Optional[str] = None

class QuestionDetailResult(BaseModel):
    questionId: int
    question: str
    studentAnswer: str
    correctAnswer: str
    isCorrect: bool
    explanation: str
    topic: str

class QuizResultResponse(BaseModel):
    score: int
    totalQuestions: int
    accuracyPercentage: int
    correctAnswersCount: int
    incorrectAnswersCount: int
    timeSpent: str
    questionDetails: List[QuestionDetailResult]
    updatedMastery: Optional[Dict[str, float]] = None
    topRecommendation: Optional[Dict[str, Any]] = None
    learningGaps: Optional[List[Dict[str, Any]]] = None
    message: Optional[str] = "Performance analyzed. Mastery and study plan adapted."
