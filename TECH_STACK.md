# Viyara StudyBot - Tech Stack Overview

## 🏗️ Architecture Summary

Viyara StudyBot is a full-stack TypeScript application built with a modern multi-agent AI architecture, featuring real-time communication and educational content delivery.

## 📋 Technology Stack

### **Frontend (Client)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | Component-based UI framework |
| **TypeScript** | 5.0+ | Type safety and development experience |
| **Vite** | Latest | Build tool and development server |
| **Tailwind CSS** | 3.0+ | Utility-first CSS framework |
| **Shadcn/ui** | Latest | Pre-built accessible React components |
| **Radix UI** | Latest | Unstyled accessible UI primitives |
| **TanStack React Query** | 5.0+ | Server state management and caching |
| **Wouter** | Latest | Lightweight client-side routing |
| **FontAwesome** | 6.4+ | Icon library for UI elements |

### **Backend (Server)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | Latest | Web server framework |
| **TypeScript** | 5.0+ | Type safety for backend development |
| **WebSocket (ws)** | Latest | Real-time bidirectional communication |
| **Drizzle ORM** | Latest | Type-safe database operations |
| **Zod** | Latest | Runtime schema validation |

### **AI & Agent Framework**
| Technology | Version | Purpose |
|------------|---------|---------|
| **OpenAI API** | GPT-4o | Language model for AI responses |
| **LangChain** | Latest | AI agent development framework |
| **LangGraph** | Latest | Stateful agent orchestration |
| **LangSmith** | Latest | Observability and tracing |

### **Database & Storage**
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14+ | Production database (schema ready) |
| **Neon Database** | Latest | Serverless PostgreSQL provider |
| **In-Memory Storage** | Custom | Development and fallback storage |

### **Development Tools**
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESBuild** | Latest | Fast JavaScript bundling |
| **TSX** | Latest | TypeScript execution for development |
| **Hot Module Replacement** | Built-in | Development experience enhancement |
| **Browserslist** | Latest | Browser compatibility configuration |

## 🔄 Data Flow Architecture

```
Frontend (React + TypeScript)
    ↓ WebSocket Connection
Backend (Express + TypeScript)
    ↓ Agent Routing
LangChain Service Layer
    ↓ AI Processing
OpenAI API / Fallback System
    ↓ Response Generation
Database Storage (PostgreSQL/Memory)
    ↓ Real-time Updates
WebSocket → Frontend Updates
```

## 🎯 Key Design Decisions

### **Frontend Architecture**
- **Component-Based**: Modular React components with TypeScript
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom educational theme colors
- **Real-time**: WebSocket hooks for instant communication

### **Backend Architecture**
- **Agent System**: Multi-agent orchestration with LangChain
- **API Design**: RESTful endpoints + WebSocket for real-time features
- **Data Layer**: Drizzle ORM with PostgreSQL schema, in-memory fallback
- **Type Safety**: Full TypeScript coverage with Zod validation

### **AI Integration**
- **Multi-Agent**: Specialized agents for different educational tasks
- **Fallback System**: Offline educational content when API unavailable
- **Observability**: LangSmith tracing for debugging and monitoring
- **Context Management**: Conversation history and user progress tracking

## 🚀 Performance Features

- **Hot Module Replacement** - Instant development feedback
- **WebSocket Optimization** - Efficient real-time communication
- **Component Lazy Loading** - Optimized bundle splitting
- **Query Caching** - Intelligent data fetching and caching
- **Type Safety** - Compile-time error detection

## 🔧 Scalability Considerations

- **Database Ready**: PostgreSQL schema for production scaling
- **Agent Modularity**: Easy addition of new educational agents
- **API Abstraction**: Switchable AI providers and models
- **Component Reusability**: Scalable UI architecture
- **Environment Configuration**: Development/production flexibility

## 📦 Build & Deployment

- **Development**: Vite dev server with TypeScript compilation
- **Production**: ESBuild bundling with static asset optimization
- **Deployment**: Single server deployment or serverless architecture
- **Environment**: Docker-ready, cloud platform compatible

This stack provides a robust foundation for an educational AI application with excellent developer experience, type safety, and scalability.