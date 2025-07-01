import { langchainService } from './langchain';
import { storage } from '../storage';
import type { AgentType, WSMessage } from '@shared/schema';

export interface AgentStatus {
  type: AgentType;
  name: string;
  description: string;
  isActive: boolean;
  color: string;
  icon: string;
}

export class AgentManager {
  private activeAgents: Set<AgentType> = new Set(['explainer', 'memory']);

  getAgentStatuses(): AgentStatus[] {
    return [
      {
        type: 'explainer',
        name: 'Topic Explainer',
        description: 'Breaks down complex concepts',
        isActive: this.activeAgents.has('explainer'),
        color: 'from-edu-blue to-blue-600',
        icon: 'fa-lightbulb',
      },
      {
        type: 'quiz',
        name: 'Quiz Generator',
        description: 'Creates practice questions',
        isActive: this.activeAgents.has('quiz'),
        color: 'from-success-green to-green-600',
        icon: 'fa-question-circle',
      },
      {
        type: 'checker',
        name: 'Answer Checker',
        description: 'Evaluates your responses',
        isActive: this.activeAgents.has('checker'),
        color: 'from-creative-purple to-purple-600',
        icon: 'fa-check-circle',
      },
      {
        type: 'motivator',
        name: 'Motivation Agent',
        description: 'Keeps you inspired',
        isActive: this.activeAgents.has('motivator'),
        color: 'from-motivational-orange to-yellow-500',
        icon: 'fa-heart',
      },
      {
        type: 'memory',
        name: 'Memory Agent',
        description: 'Tracks your progress',
        isActive: this.activeAgents.has('memory'),
        color: 'from-gray-600 to-gray-700',
        icon: 'fa-history',
      },
    ];
  }

  async processMessage(message: string, conversationId: number, userId: number): Promise<WSMessage> {
    try {
      // Store user message
      await storage.createMessage({
        conversationId,
        role: 'user',
        content: message,
        agentType: null,
        metadata: null,
      });

      // Route to appropriate agent
      const response = await langchainService.routeToAgent(message, conversationId);

      // Store agent response
      await storage.createMessage({
        conversationId,
        role: 'assistant',
        content: response.content,
        agentType: response.agentType,
        metadata: response.metadata,
      });

      // Update agent status
      this.activateAgent(response.agentType);

      // Update user progress if applicable
      if (response.agentType === 'checker' && response.metadata?.isCorrect) {
        await this.updateUserProgress(userId, response.metadata);
      }

      return {
        type: 'agent_response',
        conversationId,
        agentType: response.agentType,
        content: response.content,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        type: 'error',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
      };
    }
  }

  private activateAgent(agentType: AgentType): void {
    this.activeAgents.add(agentType);
    
    // Deactivate after a period (simulate agent lifecycle)
    setTimeout(() => {
      if (agentType !== 'explainer' && agentType !== 'memory') {
        this.activeAgents.delete(agentType);
      }
    }, 300000); // 5 minutes
  }

  private async updateUserProgress(userId: number, metadata: any): Promise<void> {
    if (!metadata.topic) return;
    
    const progress = await storage.getUserProgressByTopic(userId, metadata.topic);
    const updates = {
      questionsAnswered: (progress?.questionsAnswered || 0) + 1,
      correctAnswers: (progress?.correctAnswers || 0) + (metadata.isCorrect ? 1 : 0),
      studyTimeMinutes: (progress?.studyTimeMinutes || 0) + 1, // Approximate
    };
    
    await storage.updateUserProgress(userId, metadata.topic, updates);
  }

  async getUserStats(userId: number): Promise<any> {
    const progress = await storage.getUserProgress(userId);
    const totalQuestions = progress.reduce((sum, p) => sum + (p.questionsAnswered || 0), 0);
    const totalCorrect = progress.reduce((sum, p) => sum + (p.correctAnswers || 0), 0);
    const totalStudyTime = progress.reduce((sum, p) => sum + (p.studyTimeMinutes || 0), 0);
    
    return {
      questionsAnswered: totalQuestions,
      correctAnswers: totalCorrect,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      studyTime: `${totalStudyTime}m`,
      topicsLearned: progress.length,
      streak: 7, // This would be calculated based on daily activity
    };
  }
}

export const agentManager = new AgentManager();
