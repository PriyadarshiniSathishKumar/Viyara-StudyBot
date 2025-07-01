import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { agentManager } from "./services/agents";
import { insertConversationSchema, wsMessageSchema, type WSMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // REST API Routes
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversation = insertConversationSchema.parse(req.body);
      const created = await storage.createConversation(conversation);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/agents/status", async (req, res) => {
    try {
      const statuses = agentManager.getAgentStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent statuses" });
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await agentManager.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  app.get("/api/users/:id/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  // WebSocket Server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        const validatedMessage = wsMessageSchema.parse(message);

        if (validatedMessage.type === 'user_message') {
          // Send typing start indicator
          const typingStart: WSMessage = {
            type: 'typing_start',
            conversationId: validatedMessage.conversationId,
            content: '',
          };
          ws.send(JSON.stringify(typingStart));

          // Process the message through agents
          const response = await agentManager.processMessage(
            validatedMessage.content,
            validatedMessage.conversationId || 1,
            1 // Default user ID for demo
          );

          // Send typing end indicator
          const typingEnd: WSMessage = {
            type: 'typing_end',
            conversationId: validatedMessage.conversationId,
            content: '',
          };
          ws.send(JSON.stringify(typingEnd));

          // Send the agent response
          ws.send(JSON.stringify(response));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        const errorMessage: WSMessage = {
          type: 'error',
          content: 'Failed to process message',
        };
        ws.send(JSON.stringify(errorMessage));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial agent statuses
    if (ws.readyState === WebSocket.OPEN) {
      const initialMessage: WSMessage = {
        type: 'agent_response',
        agentType: 'explainer',
        content: 'Welcome to Viyara StudyBot! I\'m here to help you learn any subject. Try commands like "Explain Newton\'s Laws", "Quiz me on photosynthesis", or "Motivate me".',
      };
      ws.send(JSON.stringify(initialMessage));
    }
  });

  return httpServer;
}
