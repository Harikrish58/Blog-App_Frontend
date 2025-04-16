# 🚀 DevHub — Blog Application

DevHub is a full-stack blog platform built using the **MERN stack**, integrated with **Firebase for image uploads**, **JWT authentication**, and a sleek, responsive UI powered by **Tailwind CSS**. It includes dark mode support, admin post creation, search filtering, user profile management, and Google OAuth login.

---

## 📸 Live Demo

>https://devhub-blogapp.netlify.app/

---

## 🛠️ Tech Stack

### ✅ Frontend:
- **React** + **Vite**
- **Tailwind CSS**
- **React Router**
- **Redux Toolkit** with **Redux Persist**
- **React Quill** for rich text editing
- **Firebase Storage** for image upload
- **Google OAuth** (Firebase Auth)

### ✅ Backend:
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Dotenv**, **CORS**, **cookie-parser**

---

## ✨ Features

- 🔐 User Authentication (JWT-based)
- 🔒 Protected & Admin-only Routes
- 📚 Post CRUD (Create Post for Admin only)
- 🔍 Search Posts by Title, Content, or Category
- 🌙 Dark/Light Theme with toggle
- 📸 Profile Picture Upload (Firebase)
- 🧠 Google OAuth Authentication
- 📋 About Page & Responsive Design
- ⚙️ Role-based access (admin/user)

---

## 📮 API Endpoints

| Method | Endpoint                          | Description                          | Protected |
|--------|-----------------------------------|--------------------------------------|-----------|
| POST   | `/api/auth/register-user`         | Register new user                    | ❌        |
| POST   | `/api/auth/signin-user`           | Sign in with email/password          | ❌        |
| POST   | `/api/auth/googleauth`            | Sign in with Google                  | ❌        |
| PUT    | `/api/user/update/:id`            | Update user profile                  | ✅        |
| DELETE | `/api/user/delete/:id`            | Delete user account                  | ✅        |
| POST   | `/api/post/createpost`            | Create new post (Admin only)         | ✅        |
| GET    | `/api/post/getallposts?search=`   | Fetch all posts or search by keyword | ✅        |
| GET    | `/api/post/getpost/:id`           | Fetch single post by ID              | ✅        |

---

## ⚙️ Installation & Running Locally

### 🖥️ Frontend

```bash
cd Frontend_Blog
npm install
npm run dev
