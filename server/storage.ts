import { 
  users, conversations, messages, userProgress, quizSessions,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type UserProgress, type InsertUserProgress,
  type QuizSession, type InsertQuizSession
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;

  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByTopic(userId: number, topic: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, topic: string, updates: Partial<UserProgress>): Promise<UserProgress>;

  // Quiz methods
  getQuizSession(id: number): Promise<QuizSession | undefined>;
  getUserQuizSessions(userId: number): Promise<QuizSession[]>;
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  updateQuizSession(id: number, updates: Partial<QuizSession>): Promise<QuizSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private userProgress: Map<string, UserProgress>; // userId-topic as key
  private quizSessions: Map<number, QuizSession>;
  private currentUserId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentProgressId: number;
  private currentQuizId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.userProgress = new Map();
    this.quizSessions = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentProgressId = 1;
    this.currentQuizId = 1;

    // Create default user for demo
    this.createUser({ username: "demo", password: "password" });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conv => conv.userId === userId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const conversation: Conversation = {
      id,
      title: insertConversation.title,
      userId: insertConversation.userId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updated = { ...conversation, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      conversationId: insertMessage.conversationId || null,
      role: insertMessage.role,
      content: insertMessage.content,
      agentType: insertMessage.agentType || null,
      metadata: insertMessage.metadata || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressByTopic(userId: number, topic: string): Promise<UserProgress | undefined> {
    const key = `${userId}-${topic}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(userId: number, topic: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${topic}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated = { ...existing, ...updates, lastStudied: new Date() };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = {
        id,
        userId,
        topic,
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTimeMinutes: 0,
        lastStudied: new Date(),
        ...updates,
      };
      this.userProgress.set(key, progress);
      return progress;
    }
  }

  // Quiz methods
  async getQuizSession(id: number): Promise<QuizSession | undefined> {
    return this.quizSessions.get(id);
  }

  async getUserQuizSessions(userId: number): Promise<QuizSession[]> {
    return Array.from(this.quizSessions.values()).filter(session => session.userId === userId);
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = this.currentQuizId++;
    const session: QuizSession = {
      id,
      userId: insertSession.userId || null,
      topic: insertSession.topic,
      totalQuestions: insertSession.totalQuestions,
      correctAnswers: insertSession.correctAnswers,
      completed: insertSession.completed || false,
      createdAt: new Date(),
    };
    this.quizSessions.set(id, session);
    return session;
  }

  async updateQuizSession(id: number, updates: Partial<QuizSession>): Promise<QuizSession | undefined> {
    const session = this.quizSessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, ...updates };
    this.quizSessions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
