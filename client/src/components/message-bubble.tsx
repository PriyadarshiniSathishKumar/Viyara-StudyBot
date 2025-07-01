import { QuizCard } from './quiz-card';
import type { ChatMessage, QuizData } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  onQuizAnswer?: (questionIndex: number, answerIndex: number) => void;
  onQuizSubmit?: () => void;
}

export function MessageBubble({ message, onQuizAnswer, onQuizSubmit }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-2xl rounded-tr-lg px-4 py-3 max-w-xs shadow-sm">
          <p className="text-sm">{message.content}</p>
          <div className="text-xs text-blue-200 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  const agentConfig = getAgentConfig(message.agentType);

  return (
    <div className="flex items-start space-x-3 animate-slide-up">
      <div className={`w-8 h-8 bg-gradient-to-r ${agentConfig.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <i className={`fas ${agentConfig.icon} text-white text-xs drop-shadow-sm`}></i>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-lg px-4 py-3 max-w-2xl shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`text-xs font-medium ${agentConfig.textColor}`}>
            {agentConfig.name}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span className="text-xs text-gray-500">
            {message.agentType === 'quiz' ? 'Interactive Quiz' : 
             message.agentType === 'checker' ? 'Instant Feedback' :
             'via LangChain'}
          </span>
        </div>
        
        {/* Quiz content */}
        {message.agentType === 'quiz' && message.metadata && onQuizAnswer && onQuizSubmit && (
          <QuizCard 
            quiz={message.metadata as QuizData}
            onAnswer={onQuizAnswer}
            onSubmit={onQuizSubmit}
          />
        )}
        
        {/* Feedback content */}
        {message.agentType === 'checker' && message.metadata && (
          <div className={`rounded-xl p-4 text-white mb-3 ${
            message.metadata.isCorrect 
              ? 'bg-gradient-to-r from-green-400 to-green-500' 
              : 'bg-gradient-to-r from-red-400 to-red-500'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <i className={`fas ${message.metadata.isCorrect ? 'fa-check-circle' : 'fa-times-circle'} text-lg`}></i>
              <span className="font-semibold">
                {message.metadata.isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
              </span>
            </div>
            <p className="text-sm opacity-90">{message.metadata.feedback}</p>
          </div>
        )}
        
        {/* Regular content */}
        {(message.agentType !== 'quiz' || !message.metadata) && (
          <div className="prose prose-sm max-w-none">
            {formatMessageContent(message.content)}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>
            {message.agentType === 'checker' && message.metadata?.score 
              ? `Score: +${message.metadata.score} points`
              : 'Traced in LangSmith'
            }
          </span>
        </div>
      </div>
    </div>
  );
}

function getAgentConfig(agentType?: string) {
  switch (agentType) {
    case 'explainer':
      return {
        name: 'Topic Explainer Agent',
        color: 'from-blue-500 to-blue-600',
        textColor: 'text-blue-600',
        icon: 'fa-lightbulb',
      };
    case 'quiz':
      return {
        name: 'Quiz Generator Agent',
        color: 'from-green-500 to-green-600',
        textColor: 'text-green-600',
        icon: 'fa-question-circle',
      };
    case 'checker':
      return {
        name: 'Answer Checker Agent',
        color: 'from-purple-500 to-purple-600',
        textColor: 'text-purple-600',
        icon: 'fa-check-circle',
      };
    case 'motivator':
      return {
        name: 'Motivation Agent',
        color: 'from-orange-500 to-yellow-500',
        textColor: 'text-orange-600',
        icon: 'fa-heart',
      };
    case 'memory':
      return {
        name: 'Memory Agent',
        color: 'from-gray-600 to-gray-700',
        textColor: 'text-gray-600',
        icon: 'fa-history',
      };
    default:
      return {
        name: 'Viyara Assistant',
        color: 'from-blue-500 to-blue-600',
        textColor: 'text-blue-600',
        icon: 'fa-robot',
      };
  }
}

function formatMessageContent(content: string): JSX.Element {
  // Handle markdown-like formatting
  const parts = content.split('\n');
  
  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <h4 key={index} className="font-semibold text-gray-800 mb-2">{part.slice(2, -2)}</h4>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index} className="text-gray-600 text-sm">{part.slice(1, -1)}</em>;
        }
        if (part.match(/^\d+\./)) {
          return <li key={index} className="text-sm text-gray-700 ml-4">{part}</li>;
        }
        if (part.startsWith('•')) {
          return <li key={index} className="text-sm text-gray-700 ml-4">{part.slice(1).trim()}</li>;
        }
        if (part.trim()) {
          return <p key={index} className="text-sm text-gray-700 mb-2">{part}</p>;
        }
        return null;
      })}
    </div>
  );
}
