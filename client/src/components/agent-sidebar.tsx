import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Agent, UserStats } from '../types/chat';

interface AgentSidebarProps {
  onAgentSelect: (agent: Agent) => void;
  selectedAgent?: Agent;
}

export function AgentSidebar({ onAgentSelect, selectedAgent }: AgentSidebarProps) {
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['/api/agents/status'],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['/api/users/1/stats'], // Using default user ID
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-robot text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Viyara StudyBot</h1>
            <p className="text-sm text-gray-600">AI Educational Assistant</p>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.type}
              onClick={() => onAgentSelect(agent)}
              className={`agent-card bg-gradient-to-r ${agent.color} rounded-xl p-4 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg ${
                selectedAgent?.type === agent.type ? 'scale-105 ring-2 ring-gray-800 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i className={`fas ${agent.icon} text-sm text-black`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-black">{agent.name}</h3>
                  <p className="text-xs text-black opacity-80">{agent.description}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded text-black font-medium">
                  {agent.isActive ? 'Active' : 'Ready'}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  agent.isActive ? 'bg-black animate-pulse shadow-sm' : 'bg-black opacity-60'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Stats */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Today's Progress</div>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {stats?.questionsAnswered || 0}
              </div>
              <div className="text-xs text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats?.topicsLearned || 0}
              </div>
              <div className="text-xs text-gray-600">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {stats?.studyTime || '0m'}
              </div>
              <div className="text-xs text-gray-600">Study Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
