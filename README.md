# 🤖 Premium AI Chatbot (MERN Stack)

A modern, highly professional AI Chatbot application built using the complete MERN stack (MongoDB, Express, React, Node.js) and powered by Groq SDK & Llama 3.1. It features smooth UI animations, secure login authentication, saved chat logs, and a full administrative dashboard to manage registered users and monitor system statistics.

---

## ✨ Features

* 🎨 **Stunning Minimalist Design:** Premium dark mode aesthetic with custom typography and elegant glassmorphic components.
* 🔐 **Secure User Authentication:** Custom registration and login with encrypted passwords.
* 💬 **Dynamic Chat Conversations:** Real-time AI chat powered by advanced **Llama 3.1** via Groq Cloud API.
* 📂 **Saved Chat History:** Safely stores your chats so you can resume conversation threads at any time.
* 👑 **Admin Command Center:** Built-in dashboard to monitor database stats (users, threads, messages) and delete accounts.
* 🚀 **Automatic Production Deployment:** Out-of-the-box support for Render (backend) and Vercel (frontend).

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Vanilla CSS
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas (Cloud Database)
* **AI Engine:** Groq SDK (Llama 3.1 8B Model)

---

## 🚀 Local Setup

### ⚙️ Backend (Node.js & Express)
1. `cd backend`
2. `npm install`
3. Add a `.env` file with:
   ```text
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_secret_token_key
   ```
4. Run `npm run dev` to start the backend.

### 💻 Frontend (React & Vite)
1. `cd frontend`
2. `npm install`
3. Run `npm run dev` to start the frontend.


