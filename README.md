# Role-Based Access Control (RBAC) System

A comprehensive enterprise-grade Role-Based Access Control system built with the MERN stack, featuring modular architecture, advanced security, and multi-tenant support.

## 🚀 Project Overview

This RBAC system provides a scalable solution for managing user permissions across multiple business modules including CRM, HR, Finance, Projects, and Inventory management. The system implements fine-grained permission control with organizational multi-tenancy.

### Key Features

- **Multi-tenant Architecture**: Organization-based user isolation
- **Granular Permissions**: Module-specific CRUD permissions
- **Modular Design**: Pluggable business modules (CRM, HR, Finance, Projects)
- **Advanced Security**: JWT authentication, bcrypt hashing, rate limiting
- **Real-time Updates**: Live data synchronization
- **Responsive UI**: Modern React interface with Chakra UI
- **Audit Logging**: Comprehensive activity tracking

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App] --> B[Chakra UI Components]
        A --> C[React Router]
        A --> D[Context API]
        A --> E[Axios HTTP Client]
    end
    
    subgraph "Backend Layer"
        F[Express.js Server] --> G[Authentication Middleware]
        F --> H[Permission Middleware]
        F --> I[Rate Limiting]
        F --> J[Error Handler]
    end
    
    subgraph "API Routes"
        K[Auth Routes] --> L[User Routes]
        L --> M[Module Routes]
        M --> N[CRM Routes]
        M --> O[HR Routes]
        M --> P[Finance Routes]
        M --> Q[Project Routes]
    end
    
    subgraph "Business Logic"
        R[Controllers] --> S[Services]
        S --> T[Models]
    end
    
    subgraph "Database Layer"
        U[(MongoDB)]
        V[User Collection]
        W[Organization Collection]
        X[Module Collections]
    end
    
    E --> F
    F --> K
    K --> R
    T --> U
    U --> V
    U --> W
    U --> X
```

## 📊 Data Flow Architecture

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Service
    participant M as Middleware
    participant R as Route Handler
    participant S as Service Layer
    participant D as Database
    
    C->>A: Login Request
    A->>D: Validate Credentials
    D-->>A: User Data + Permissions
    A-->>C: JWT Token + User Info
    
    C->>M: API Request + JWT
    M->>M: Validate Token
    M->>M: Check Permissions
    M->>R: Authorized Request
    R->>S: Business Logic
    S->>D: Database Operation
    D-->>S: Data Response
    S-->>R: Processed Data
    R-->>C: API Response
```

## 🗄️ Database Schema

```mermaid
erDiagram
    Organization ||--o{ User : contains
    User ||--o{ Post : creates
    User ||--o{ Lead : manages
    User ||--o{ Project : assigned
    User ||--o{ Meeting : attends
    Organization ||--o{ Module : enables
    
    Organization {
        ObjectId _id
        string name
        string domain
        object settings
        string subscription
        boolean active
        date createdAt
        date updatedAt
    }
    
    User {
        ObjectId _id
        string username
        string email
        string password
        string role
        ObjectId organizationId
        array permissions
        object profile
        object preferences
        boolean active
        date lastLogin
        date createdAt
        date updatedAt
    }
    
    Lead {
        ObjectId _id
        string name
        string email
        string status
        ObjectId assignedTo
        date createdAt
        date updatedAt
    }
    
    Project {
        ObjectId _id
        string title
        string description
        string status
        array assignedUsers
        date deadline
        date createdAt
        date updatedAt
    }
    
    Meeting {
        ObjectId _id
        string title
        string description
        date scheduledAt
        array attendees
        ObjectId organizer
        date createdAt
        date updatedAt
    }
```

## 🔐 Permission System

```mermaid
graph TD
    A[User Login] --> B{Role Check}
    B -->|Admin| C[Full Permissions]
    B -->|Manager| D[Module Permissions]
    B -->|Supervisor| E[Limited Permissions]
    B -->|Employee| F[Basic Permissions]
    B -->|Viewer| G[Read-Only Permissions]
    
    C --> H[All CRUD Operations]
    D --> I[Create, Read, Update]
    E --> J[Read, Update Own]
    F --> K[Read, Create Own]
    G --> L[Read Only]
    
    H --> M[Access All Modules]
    I --> N[Access Assigned Modules]
    J --> O[Access Department Modules]
    K --> P[Access Basic Modules]
    L --> Q[View Only Access]
```
--- 
## 📷Screenshots

![Image 2025-11-10 at 14 55 15_0666be6f](https://github.com/user-attachments/assets/199a42e3-d7f7-413e-bc59-be0e600c429a)

![Image 2025-11-10 at 14 55 58_faac68b3](https://github.com/user-attachments/assets/15c3a13f-7af2-428a-9a6e-db9c10ad8f5d)

![Image 2025-11-10 at 14 56 20_7ba1f336](https://github.com/user-attachments/assets/2ee61f2f-5901-4132-89ce-4c501b41acd6)

![Image 2025-11-10 at 14 56 42_6753718e](https://github.com/user-attachments/assets/9ed2552c-71e3-4adb-b78a-2af3cc9ec341)

![Image 2025-11-10 at 14 56 58_49823f9f](https://github.com/user-attachments/assets/35074cc6-7390-4324-8bc5-ca319451c202)

![Image 2025-11-10 at 14 57 13_c10419af](https://github.com/user-attachments/assets/3ef9ca07-0c03-4bb5-908c-1c01f8d8759f)

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI Library
- **TypeScript** - Type Safety
- **Chakra UI 2.10.9** - Component Library
- **React Router 6.30.1** - Navigation
- **Axios 1.13.2** - HTTP Client
- **React Hook Form 7.66.0** - Form Management
- **Framer Motion 10.18.0** - Animations
- **Recharts 2.15.4** - Data Visualization

### Backend
- **Node.js** - Runtime Environment
- **Express.js 4.18.2** - Web Framework
- **MongoDB** - Database
- **Mongoose 7.6.3** - ODM
- **JWT** - Authentication
- **bcryptjs 2.4.3** - Password Hashing
- **Winston 3.11.0** - Logging
- **Express Rate Limit** - API Protection

## 📁 Project Structure

```
Role-Based Access Control/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── navigation/
│   │   │   └── shared/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── modules/
│   │   │   ├── crm/
│   │   │   ├── hr/
│   │   │   ├── finance/
│   │   │   └── projects/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   │   ├── crm/
│   │   │   ├── hr/
│   │   │   ├── finance/
│   │   │   └── projects/
│   │   ├── routes/
│   │   ├── seeders/
│   │   └── server.js
│   ├── scripts/
│   └── package.json
└── docs/
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Role-Based\ Access\ Control
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Database Setup**
```bash
# Create test users
cd backend
npm run seed:users
```

### Environment Variables

**Backend (.env)**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/rbac
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 👥 Test Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@test.com | Admin123! | Full system access |
| Manager | editor@test.com | Editor123! | Module management |
| Viewer | viewer@test.com | Viewer123! | Read-only access |

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Management
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Module APIs
- `GET /api/crm/leads` - CRM leads
- `GET /api/projects` - Project management
- `GET /api/hr/meetings` - HR meetings
- `GET /api/posts` - General posts

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with configurable origins
- **Input Validation** using express-validator
- **Error Handling** with custom middleware
- **Audit Logging** for all operations

## 📊 Module Features

### CRM Module
- Lead management with Kanban board
- Contact tracking and history
- Deal pipeline visualization
- Lead conversion analytics

### HR Module
- Employee directory and profiles
- Meeting scheduling and management
- Leave request system
- Performance tracking

### Finance Module
- Expense tracking and categorization
- Revenue dashboard and analytics
- Financial reporting
- Budget management

### Project Module
- Project creation and assignment
- Task management with updates
- Team collaboration tools
- Progress tracking

## 🎨 UI Components

### Dashboard Features
- **Analytics Dashboard** - Key metrics and KPIs
- **Module Cards** - Quick access to business modules
- **Recent Activity** - Latest system activities
- **User Profile** - Personal settings and preferences

### Admin Panel
- **User Management** - CRUD operations for users
- **Role Assignment** - Dynamic permission management
- **Organization Settings** - Multi-tenant configuration
- **System Monitoring** - Health checks and logs

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading of modules
- **Caching Strategy** - Redis integration ready
- **Database Indexing** - Optimized queries
- **API Rate Limiting** - DDoS protection
- **Error Boundaries** - Graceful error handling

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time notifications with WebSocket
- [ ] Advanced reporting and analytics
- [ ] Mobile application (React Native)
- [ ] Third-party integrations (Slack, Teams)
- [ ] Advanced workflow automation
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] API documentation with Swagger

---

**This project is build by Manan and [simran](https://github.com/simzl10)**
