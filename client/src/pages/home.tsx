import { useState, useEffect } from 'react';
import { AgentSidebar } from '../components/agent-sidebar';
import { ChatInterface } from '../components/chat-interface';
import { useWebSocket } from '../hooks/use-websocket';
import type { Agent, ChatMessage, WSMessage } from '../types/chat';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(1); // Default conversation for demo

  const { isConnected, lastMessage, sendMessage } = useWebSocket('/ws');

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'agent_response':
        const newMessage: ChatMessage = {
          id: Date.now(),
          role: 'assistant',
          content: lastMessage.content,
          agentType: lastMessage.agentType,
          metadata: lastMessage.metadata,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
        break;

      case 'typing_start':
        setIsTyping(true);
        break;

      case 'typing_end':
        setIsTyping(false);
        break;

      case 'error':
        const errorMessage: ChatMessage = {
          id: Date.now(),
          role: 'assistant',
          content: lastMessage.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        break;
    }
  }, [lastMessage]);

  const handleSendMessage = (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Send via WebSocket
    const wsMessage: WSMessage = {
      type: 'user_message',
      conversationId,
      content,
    };
    sendMessage(wsMessage);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    console.log('Quiz answer:', { questionIndex, answerIndex });
    // In a full implementation, this would update the quiz state
  };

  const handleQuizSubmit = () => {
    // Send the user's answer as a message
    handleSendMessage('My answer is C'); // This would be dynamic based on selected answer
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AgentSidebar 
        onAgentSelect={setSelectedAgent}
        selectedAgent={selectedAgent}
      />
      <ChatInterface
        selectedAgent={selectedAgent}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onQuizAnswer={handleQuizAnswer}
        onQuizSubmit={handleQuizSubmit}
      />
      
      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <i className="fas fa-wifi mr-2"></i>
          Reconnecting...
        </div>
      )}
    </div>
  );
}
