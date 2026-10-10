export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  branch: string;
  year: string;
  semester: string;
  targetGoal: string;
  examName: string;
  examDate: string;
  daysRemaining: number;
  targetScore: string;
  dailyStudyHours: string;
  preferredTime: string;
  streakDays: number;
  totalStudyTime: string;
  xp: number;
  level: number;
  levelTitle: string;
}

export type TaskType = 'Learn' | 'Practice' | 'Review';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface StudyTask {
  id: string;
  title: string;
  type: TaskType;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
  priority: TaskPriority;
  xpReward: number;
}

export interface AIRecommendation {
  id: string;
  headline: string;
  topic: string;
  subject: string;
  reason: string;
  accuracy: number;
  daysToExam: number;
  impactLevel: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  actionUrl: string;
}

export type GapPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type GapCategory = 'STRONG' | 'NEEDS_PRACTICE' | 'HIGH_PRIORITY';
export type TrendDirection = 'declining' | 'stable' | 'improving';

export interface LearningGap {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  priority: GapPriority;
  category: GapCategory;
  trend: TrendDirection;
  lastPracticed: string;
  recommendation: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'quiz' | 'notes' | 'session' | 'mastery';
  timestamp: string;
  detail: string;
  badge?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickActions?: string[];
  steps?: string[];
  codeSnippet?: string;
}

export interface StudyPlanDay {
  id: string;
  dayName: string;
  dateStr: string;
  isToday?: boolean;
  tasks: {
    id: string;
    subject: string;
    topic: string;
    type: TaskType;
    durationMinutes: number;
    completed: boolean;
  }[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  timeSpent: string;
  questionDetails: {
    questionId: number;
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    topic: string;
  }[];
}

export interface MistakeRecord {
  id: string;
  topic: string;
  subject: string;
  mistakeCount: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  lastAttempted: string;
}

export interface ProgressAnalytics {
  overallMastery: number;
  studyTimeHours: string;
  quizAccuracy: number;
  topicsCompleted: number;
  weeklyStudyTime: { day: string; hours: number; target: number }[];
  subjectPerformance: { subject: string; score: number; target: number }[];
  topicMastery: { topic: string; subject: string; mastery: number; category: string }[];
  performanceTrend: { date: string; score: number; predicted: number }[];
  heatmapDays: { date: string; intensity: number; count: number }[];
}

export type ResourceType = 'Notes' | 'PDF' | 'Video' | 'Practice';

export interface LearningResource {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: ResourceType;
  duration: string;
  isAIRecommended: boolean;
  recommendationReason?: string;
  url?: string;
  readCount?: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  currentProgress?: number;
  totalRequired?: number;
  badgeType: 'streak' | 'mastery' | 'quiz' | 'goal' | 'speed';
  dateUnlocked?: string;
}
