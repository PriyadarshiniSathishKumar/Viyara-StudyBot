import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_OVERRIDE || "your-api-key-here"
});

export interface ExplanationResponse {
  explanation: string;
  keyPoints: string[];
  examples?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  topic: string;
}

export interface FeedbackResponse {
  isCorrect: boolean;
  feedback: string;
  explanation: string;
  score: number;
}

export interface MotivationResponse {
  message: string;
  tip: string;
  encouragement: string;
}

export class OpenAIService {
  private getFallbackExplanation(topic: string): ExplanationResponse {
    return {
      explanation: `${topic} is an important concept that involves several key components and principles. Understanding this topic requires breaking it down into manageable parts and exploring how they connect to real-world applications.`,
      keyPoints: [
        `Core definition and fundamental principles of ${topic}`,
        `Key components and how they interact`,
        `Real-world applications and examples`,
        `Important relationships and connections`
      ],
      examples: [
        `Consider how ${topic} applies in everyday situations`,
        `Think about practical uses in various fields`
      ]
    };
  }

  async explainTopic(topic: string, userLevel: string = "beginner"): Promise<ExplanationResponse> {
    try {
      const prompt = `You are an expert educator. Explain "${topic}" to a ${userLevel} student. 
      Provide a clear explanation with key points and examples if helpful.
      
      Respond with JSON in this format:
      {
        "explanation": "detailed explanation here",
        "keyPoints": ["point 1", "point 2", "point 3"],
        "examples": ["example 1", "example 2"] (optional)
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Viyara, an expert educational AI assistant. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.log(`OpenAI API unavailable for explanation: ${error}`);
      return this.getFallbackExplanation(topic);
    }
  }

  private getFallbackQuiz(topic: string, numQuestions: number = 3): QuizResponse {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        question: `What is an important aspect of ${topic} that students should understand?`,
        options: [
          `${topic} has fundamental principles that govern its behavior`,
          `${topic} is not related to other concepts in the field`,
          `${topic} can only be understood through advanced mathematics`,
          `${topic} has no practical applications`
        ],
        correctAnswer: 0,
        explanation: `Understanding the fundamental principles of ${topic} is crucial for grasping how it works and applies to real situations.`
      });
    }
    
    return {
      topic,
      questions
    };
  }

  async generateQuiz(topic: string, numQuestions: number = 3, difficulty: string = "medium"): Promise<QuizResponse> {
    try {
      const prompt = `Create ${numQuestions} ${difficulty} level multiple choice questions about "${topic}".
      Each question should have 4 options with one correct answer.
      
      Respond with JSON in this format:
      {
        "topic": "${topic}",
        "questions": [
          {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Viyara, an expert quiz generator. Create educational, accurate questions. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.log(`OpenAI API unavailable for quiz generation: ${error}`);
      return this.getFallbackQuiz(topic, numQuestions);
    }
  }

  private getFallbackFeedback(userAnswer: string, correctAnswer: string): FeedbackResponse {
    const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) || 
                     correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
    
    return {
      isCorrect,
      feedback: isCorrect 
        ? "Great job! You've demonstrated good understanding of the concept."
        : "Not quite right, but that's okay! Learning often involves making mistakes and growing from them.",
      explanation: isCorrect
        ? "Your answer shows you understand the key principles involved."
        : `The correct approach involves understanding the fundamental concepts. The right answer is: ${correctAnswer}`,
      score: isCorrect ? 10 : 3
    };
  }

  async checkAnswer(question: string, userAnswer: string, correctAnswer: string, options: string[]): Promise<FeedbackResponse> {
    try {
      const prompt = `A student answered a quiz question. Evaluate their response and provide feedback.
      
      Question: "${question}"
      Options: ${options.map((opt, i) => `${i + 1}. ${opt}`).join(', ')}
      Student's answer: "${userAnswer}"
      Correct answer: "${correctAnswer}"
      
      Respond with JSON in this format:
      {
        "isCorrect": true/false,
        "feedback": "Encouraging feedback message",
        "explanation": "Why this answer is correct/incorrect",
        "score": 10 (points earned, 0-10)
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Viyara, an encouraging educational AI that provides constructive feedback. Always be positive and helpful. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.log(`OpenAI API unavailable for answer checking: ${error}`);
      return this.getFallbackFeedback(userAnswer, correctAnswer);
    }
  }

  private getFallbackMotivation(): MotivationResponse {
    const motivations = [
      {
        message: "Every expert was once a beginner. Your learning journey is unique and valuable!",
        tip: "Break complex topics into smaller, manageable chunks for better understanding.",
        encouragement: "You're making progress with every question you explore. Keep up the great work!"
      },
      {
        message: "Learning is a journey, not a destination. Embrace the process!",
        tip: "Try explaining concepts to someone else - it's one of the best ways to learn.",
        encouragement: "Your curiosity and effort are your greatest learning tools."
      },
      {
        message: "Knowledge is power, and you're building yours one concept at a time!",
        tip: "Connect new information to what you already know to strengthen understanding.",
        encouragement: "Every question you ask brings you closer to mastery."
      }
    ];
    
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  async generateMotivation(context: string = "", userProgress?: any): Promise<MotivationResponse> {
    try {
      let prompt = `Generate an encouraging and motivational message for a student.`;
      
      if (context) {
        prompt += ` Context: ${context}`;
      }
      
      if (userProgress) {
        prompt += ` Student has answered ${userProgress.questionsAnswered} questions with ${userProgress.correctAnswers} correct.`;
      }
      
      prompt += `
      
      Respond with JSON in this format:
      {
        "message": "Main motivational message",
        "tip": "Study tip or advice",
        "encouragement": "Personal encouragement"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Viyara, a motivational educational AI. Be inspiring, positive, and helpful. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.log(`OpenAI API unavailable for motivation: ${error}`);
      return this.getFallbackMotivation();
    }
  }

  async summarizeProgress(userProgress: any[], recentTopics: string[]): Promise<string> {
    try {
      const prompt = `Summarize a student's learning progress and provide insights.
      
      Progress data: ${JSON.stringify(userProgress)}
      Recent topics: ${recentTopics.join(', ')}
      
      Provide a brief, encouraging summary of their learning journey and suggest next steps.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Viyara, an educational AI that tracks student progress. Be encouraging and provide actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content || "Great progress! Keep up the learning!";
    } catch (error) {
      console.log(`OpenAI API unavailable for progress summary: ${error}`);
      const topicCount = recentTopics.length;
      if (topicCount === 0) {
        return "Welcome to your learning journey! I'm excited to help you explore new topics and build your knowledge.";
      } else {
        return `You've been exploring ${topicCount} topic${topicCount === 1 ? '' : 's'}: ${recentTopics.join(', ')}. Your curiosity is driving great learning progress! Consider diving deeper into these areas or exploring related concepts.`;
      }
    }
  }
}

export const openaiService = new OpenAIService();
