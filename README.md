# Premium AI Chatbot (MERN Stack)

A professional AI Chatbot application built using the MERN stack (MongoDB, Express, React, Node.js) and powered by Groq SDK & Llama 3.1. It features custom user authentication, saved chat logs, and an administrative dashboard to monitor statistics and manage users.

---

## Features

* Modern dark mode design with sleek glassmorphism.
* User authentication with secure registration and login.
* Chat conversations powered by Llama 3.1 via Groq.
* Saved chat history threads for registered users.
* Administrative panel to monitor statistics and manage accounts.

---

## Tech Stack

* **Frontend:** React, Vite, Vanilla CSS
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas
* **AI Engine:** Groq SDK (Llama 3.1)

---

## Local Setup

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```text
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_secret_token_key
   ```
4. Run `npm run dev` to start the backend.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Run `npm run dev` to start the frontend.



