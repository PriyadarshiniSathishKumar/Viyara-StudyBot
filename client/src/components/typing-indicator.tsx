interface TypingIndicatorProps {
  agentName: string;
  agentColor: string;
  agentIcon: string;
}

export function TypingIndicator({ agentName, agentColor, agentIcon }: TypingIndicatorProps) {
  return (
    <div className="flex items-start space-x-3 animate-slide-up">
      <div className={`w-8 h-8 bg-gradient-to-r ${agentColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <i className={`fas ${agentIcon} text-white text-xs drop-shadow-sm`}></i>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-lg px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-medium text-gray-600">{agentName}</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span className="text-xs text-gray-500">typing...</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
