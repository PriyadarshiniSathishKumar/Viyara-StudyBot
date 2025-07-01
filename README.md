# Viyara StudyBot 🤖

A sophisticated multi-agent educational assistant built with modern web technologies, featuring AI-powered learning experiences through interactive conversations, quizzes, and personalized feedback.

![Viyara StudyBot](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🌟 Features

### Multi-Agent Architecture
- **Topic Explainer Agent** - Breaks down complex concepts into digestible explanations
- **Quiz Generator Agent** - Creates interactive multiple-choice questions
- **Answer Checker Agent** - Provides instant feedback with detailed explanations
- **Motivation Agent** - Delivers encouraging messages and study tips
- **Memory Agent** - Tracks learning progress and conversation history

### Advanced Capabilities
- **Real-time Communication** - WebSocket-powered instant messaging
- **Interactive Quizzes** - Dynamic question generation with immediate feedback
- **Progress Tracking** - Comprehensive learning analytics and statistics
- **Responsive Design** - Beautiful gradient-based UI optimized for all devices
- **LangChain Integration** - Agent orchestration with observability via LangSmith
- **Fallback System** - Works offline with educational content when API is unavailable

## Screenshots
![image](https://github.com/user-attachments/assets/c5b4e70e-f6a6-4b1c-b2a0-914a627cf7ac)
![image](https://github.com/user-attachments/assets/dbcbf7fd-0f4a-445c-83a9-72f3f0c4e46f)
![image](https://github.com/user-attachments/assets/3c27dfcb-5a87-439c-9f0d-2c0203c3b1f3)



## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API Key (optional - fallback system available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/viyara-studybot.git
cd viyara-studybot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5000`

## 💬 Usage Examples

### Basic Interactions
```
User: "Explain photosynthesis"
→ Topic Explainer Agent provides detailed explanation with key points

User: "Quiz me on physics"
→ Quiz Generator Agent creates interactive questions

User: "My answer is B"
→ Answer Checker Agent evaluates and provides feedback

User: "Motivate me"
→ Motivation Agent delivers encouraging messages
```

### Advanced Features
- **Progress Tracking**: View statistics on questions answered, accuracy, and study time
- **Topic Memory**: Agents remember previous topics for contextual conversations
- **Real-time Feedback**: Instant responses with typing indicators
- **Adaptive Learning**: Content adjusts based on user interactions

## 🛠️ Tech Stack

### Frontend Architecture
- **React 18** - Modern component-based UI framework
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first styling framework
- **Shadcn/ui** - High-quality React components with Radix UI primitives
- **TanStack React Query** - Powerful data fetching and state management
- **Wouter** - Minimalist client-side routing
- **FontAwesome 6** - Comprehensive icon library

### Backend Architecture
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Enhanced development with static typing
- **WebSocket (ws)** - Real-time bidirectional communication
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Runtime type validation and schema definition

### AI & Agent Framework
- **OpenAI GPT-4o** - Latest language model for intelligent responses
- **LangChain** - Framework for developing AI agent applications
- **LangGraph** - Stateful agent orchestration and workflow management
- **LangSmith** - Observability, debugging, and performance tracing

### Development Tools
- **ESBuild** - Ultra-fast JavaScript bundler
- **TSX** - TypeScript execution for development
- **Browserslist** - Browser compatibility configuration
- **Hot Module Replacement** - Instant development feedback

### Data & Storage
- **In-Memory Storage** - Fast prototyping with MemStorage implementation
- **PostgreSQL Ready** - Database schema designed for production scaling
- **Neon Database** - Serverless PostgreSQL for cloud deployment
- **Session Management** - User state and conversation persistence

## 📁 Project Structure

```
viyara-studybot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── lib/            # Utility functions
│   └── index.html
├── server/                 # Backend Express application
│   ├── services/           # AI agents and business logic
│   │   ├── agents.ts       # Agent management system
│   │   ├── langchain.ts    # LangChain integration
│   │   └── openai.ts       # OpenAI API service
│   ├── routes.ts           # API routes and WebSocket handlers
│   ├── storage.ts          # Data persistence layer
│   └── index.ts            # Application entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and validation
└── package.json
```

## 🔧 Configuration

### Environment Variables
```env
# Required for AI functionality (optional with fallback)
OPENAI_API_KEY=sk-your-openai-api-key

# Database configuration (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/viyara

# Development settings
NODE_ENV=development
PORT=5000
```

### Customization Options
- **Agent Behavior**: Modify agent personalities in `server/services/`
- **UI Themes**: Customize colors and styling in `client/src/index.css`
- **Database Schema**: Update models in `shared/schema.ts`
- **Fallback Content**: Enhance offline responses in `server/services/openai.ts`

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Production Deployment
1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
```bash
export NODE_ENV=production
export OPENAI_API_KEY=your_production_key
export DATABASE_URL=your_production_database_url
```

3. **Start the server**
```bash
npm run start
```

### Deployment Platforms
- **Replit** - Integrated development and hosting (recommended)
- **Vercel** - Frontend with serverless functions
- **Railway** - Full-stack deployment with PostgreSQL
- **Heroku** - Traditional cloud platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Test agent interactions thoroughly
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing powerful language models
- LangChain team for the agent framework
- Shadcn for the beautiful UI components
- The React and TypeScript communities

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Join our Discord community
- Email: support@viyara-studybot.com

---

**Built with ❤️ for learners everywhere**
