export interface Agent {
  type: 'explainer' | 'quiz' | 'checker' | 'motivator' | 'memory';
  name: string;
  description: string;
  isActive: boolean;
  color: string;
  icon: string;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  agentType?: Agent['type'];
  metadata?: any;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  topic: string;
  currentQuestion?: number;
  userAnswers?: number[];
}

export interface UserStats {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  studyTime: string;
  topicsLearned: number;
  streak: number;
}

export interface WSMessage {
  type: 'user_message' | 'agent_response' | 'typing_start' | 'typing_end' | 'error';
  conversationId?: number;
  agentType?: Agent['type'];
  content: string;
  metadata?: any;
}
