# Master Blog Platform

A full-stack blogging platform built with Node.js/Express backend and Next.js frontend.

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Blog Management**: Create, read, update, and delete blog posts
- **Comments System**: Users can comment on blog posts with full CRUD functionality
- **Rich Text Editor**: Built-in editor for creating formatted blog content
- **Dashboard**: User dashboard to manage personal blog posts
- **Responsive Design**: Mobile-friendly UI built with modern web technologies
- **Token Refresh**: Automatic token refresh mechanism for seamless user experience
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (configured in db.js)
- **Authentication**: JWT (JSON Web Tokens)
- **Logging**: Custom logger utility

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: CSS with PostCSS
- **HTTP Client**: Axios
- **State Management**: Redux (configured in store.ts)
- **Linting**: ESLint

## 📁 Project Structure

```
master-blog-platform/
├── backend/                    # Node.js Express server
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # MongoDB schemas
│   ├── repositories/          # Data access layer
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Helper utilities
│   ├── logs/                  # Application logs
│   ├── server.js              # Entry point
│   └── package.json           # Dependencies
│
└── frontend/                  # Next.js application
    ├── app/                   # App router pages
    ├── components/            # Reusable components
    ├── lib/                   # Utilities (API calls, store)
    ├── types/                 # TypeScript types
    ├── public/                # Static assets
    └── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd master-blog-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_token_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Blog Post Routes
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments Routes
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments` - Add a comment to a post (requires authentication)
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## 🔐 Authentication

The application uses JWT-based authentication:
- Access tokens are issued upon login
- Refresh tokens are stored for token renewal
- Protected routes require valid JWT in Authorization header: `Bearer <token>`

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with blog posts feed
- **Blog Post** (`/blog/[slug]`) - Individual blog post with comments
- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page
- **Dashboard** (`/dashboard`) - User's blog management dashboard
- **Edit Post** (`/dashboard/edit/[id]`) - Edit existing blog post

## 📝 Development

### Backend Development
- API controllers handle request logic
- Services contain business logic
- Repositories handle data access
- Middleware for authentication and error handling
- Logger utility for tracking application events

### Frontend Development
- Components are built with React and TypeScript
- API utility file (`lib/api.ts`) centralizes HTTP requests
- Store file (`lib/store.ts`) manages Redux state
- Type definitions in `types/index.ts` ensure type safety

## 🐛 Error Handling

The application includes:
- Custom error middleware for consistent error responses
- Logger utility for debugging
- Input validation using validators utility
- Try-catch blocks in services and controllers

## 📦 Dependencies

### Backend
- express
- mongoose (for MongoDB)
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Frontend
- next
- react
- typescript
- axios
- redux
- tailwindcss (or custom CSS)

## 🚢 Deployment

### Backend Deployment
- Can be deployed to Heroku, AWS, or any Node.js hosting
- Ensure environment variables are set in the hosting platform
- MongoDB connection string must be configured

### Frontend Deployment
- Can be deployed to Vercel (recommended for Next.js)
- Can also be deployed to Netlify or AWS
- Set `NEXT_PUBLIC_API_URL` environment variable pointing to deployed backend

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



**Happy Blogging! 📝**
