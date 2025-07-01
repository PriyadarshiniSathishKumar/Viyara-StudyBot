import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { QuizData, QuizQuestion } from '../types/chat';

interface QuizCardProps {
  quiz: QuizData;
  onAnswer: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
}

export function QuizCard({ quiz, onAnswer, onSubmit }: QuizCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(30);

  const currentQuestionIndex = quiz.currentQuestion || 0;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
    onAnswer(currentQuestionIndex, answerIndex);
  };

  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{quiz.topic} Quiz</h4>
        <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded">
          Question {currentQuestionIndex + 1}/{quiz.questions.length}
        </span>
      </div>
      
      <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium mb-3">{currentQuestion.question}</p>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left rounded-lg p-2 text-sm transition-colors ${
                selectedAnswer === index
                  ? 'bg-white bg-opacity-30'
                  : 'bg-white bg-opacity-10 hover:bg-opacity-20'
              }`}
            >
              {String.fromCharCode(65 + index)}) {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-green-100">
          Time: {timeRemaining}s remaining
        </div>
        <Button 
          onClick={onSubmit}
          disabled={selectedAnswer === undefined}
          className="bg-white text-green-600 hover:bg-opacity-90 text-xs font-medium px-3 py-1 h-auto"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
}
