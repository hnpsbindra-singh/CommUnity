# Community Social Platform 🚀

A full-stack community-based social platform built using Spring Boot, MongoDB, React, and JWT Authentication.

Users can create communities, join communities using join codes, create posts, react to posts, comment on discussions, and manage their profiles securely.

---

# Features 🌱

## Authentication & Security
- JWT Authentication
- Secure Login & Registration
- OTP-based Password Reset
- Protected APIs using Spring Security
- Role-based access validation

---

## Community System
- Create Communities
- Join Communities using Join Code
- Leave Communities
- View Joined Communities
- View Community Members

---

## Social Features
- Create Posts
- Delete Own Posts
- Feel-Good Reactions ❤️
- Add Comments
- Delete Own Comments

---

## Profile System
- View Profile
- Update Profile

---

# Tech Stack ⚙️

## Backend
- Java
- Spring Boot
- Spring Security
- JWT
- MongoDB
- Maven

## Frontend
- React
- Vite
- Axios
- React Router

---

# Project Structure 📂

```bash
community-social-platform/
│
├── backend/
│
├── frontend/
│
└── README.md
```

---

# API Highlights 🔥

## Community APIs

```http
POST   /api/user/community/create
POST   /api/user/community/join/{joinCode}
DELETE /api/user/community/leave/{communityId}
GET    /api/user/community/all
GET    /api/user/community/my
GET    /api/user/community/{communityId}
```

---

## Post APIs

```http
POST   /api/user/post/create/{communityId}
GET    /api/user/post/community/{communityId}
GET    /api/user/post/{postId}
DELETE /api/user/post/{postId}
PATCH  /api/user/post/feel-good/{postId}
```

---

## Comment APIs

```http
POST   /api/user/comment/create/{postId}
GET    /api/user/comment/{postId}
DELETE /api/user/comment/{commentId}
```

---

## Profile APIs

```http
GET    /api/user/me
PATCH  /api/user/update-profile
```

---

# Security Features 🔐

- JWT-based authentication
- Protected routes
- Community membership validation
- Resource ownership validation
- Secure API access using Spring Security

---

# Installation 🚀

## Backend

```bash
cd backend
```

### Configure application.properties

```properties
spring.data.mongodb.uri=YOUR_MONGODB_URI
jwt.secret=YOUR_SECRET
```

### Run Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

## Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Future Improvements 🌌

- Real-time chat using WebSockets
- Notifications using Kafka/RabbitMQ
- Image Upload Support
- Android App using Jetpack Compose
- Docker Deployment
- Redis Caching
- Infinite Scrolling Feed



# Author 👨‍💻

Harnimarpreet Singh
