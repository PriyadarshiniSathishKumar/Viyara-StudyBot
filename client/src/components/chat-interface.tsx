import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import type { ChatMessage, Agent, QuizData } from '../types/chat';

interface ChatInterfaceProps {
  selectedAgent?: Agent;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onQuizAnswer?: (questionIndex: number, answerIndex: number) => void;
  onQuizSubmit?: () => void;
}

export function ChatInterface({ 
  selectedAgent, 
  messages, 
  isTyping, 
  onSendMessage,
  onQuizAnswer,
  onQuizSubmit 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const getAgentConfig = (agent?: Agent) => {
    if (!agent) {
      return {
        name: 'Viyara StudyBot',
        description: 'Ready to help you learn',
        color: 'from-blue-500 to-blue-600',
        icon: 'fa-robot',
      };
    }
    return {
      name: agent.name,
      description: agent.description,
      color: agent.color,
      icon: agent.icon,
    };
  };

  const agentConfig = getAgentConfig(selectedAgent);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              selectedAgent?.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <div>
              <h2 className="font-semibold text-gray-800">{agentConfig.name}</h2>
              <p className="text-sm text-gray-600">{agentConfig.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-cog"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
        
        {/* LangSmith/LangGraph Indicators */}
        <div className="mt-2 flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-2 py-1 rounded">
            <i className="fas fa-chart-line"></i>
            <span>LangSmith Tracing Active</span>
          </div>
          <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-2 py-1 rounded">
            <i className="fas fa-link"></i>
            <span>LangGraph Connected</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center">
            <div className="inline-block bg-white rounded-2xl shadow-sm p-6 max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Viyara StudyBot!</h3>
              <p className="text-gray-600 text-sm">I'm here to help you learn any subject. Try commands like:</p>
              <div className="mt-4 space-y-2 text-left">
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <code className="text-blue-600">"Explain Newton's Laws"</code>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <code className="text-green-600">"Quiz me on photosynthesis"</code>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <code className="text-orange-600">"Motivate me"</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onQuizAnswer={onQuizAnswer}
            onQuizSubmit={onQuizSubmit}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && selectedAgent && (
          <TypingIndicator
            agentName={selectedAgent.name}
            agentColor={selectedAgent.color}
            agentIcon={selectedAgent.icon}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="fas fa-paperclip"></i>
          </button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about any subject..."
              className="bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <i className="fas fa-microphone"></i>
              </button>
            </div>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="text-xs text-gray-600">Quick actions:</div>
          <button 
            onClick={() => handleQuickAction('Explain a topic')}
            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
          >
            Explain a topic
          </button>
          <button 
            onClick={() => handleQuickAction('Start quiz')}
            className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-100 transition-colors"
          >
            Start quiz
          </button>
          <button 
            onClick={() => handleQuickAction('Get motivated')}
            className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors"
          >
            Get motivated
          </button>
        </div>
      </div>
    </div>
  );
}
