// imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');

// database models
const Chat = require('./models/Chat');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// server config
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// auto-create default admin if it doesn't exist yet
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log("\n[SEED] SUCCESS: Default admin account created successfully!");
            console.log("       Username: admin\n       Password: admin123\n");
        }
    } catch (err) {
        console.error("Error seeding default admin account:", err);
    }
};

// mongodb connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_chatbot')
    .then(async () => {
        console.log("MongoDB Connected Successfully!");
        await seedAdmin();
    })
    .catch((err) => console.log("MongoDB Error:", err));

// auth endpoints
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Prevent registration of reserved system username "admin"
        if (username.toLowerCase() === 'admin') {
            return res.status(400).json({ error: "Username 'admin' is a reserved system keyword." });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        // Create Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

        // Send back username and role!
        res.json({ message: "Login successful!", token, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// chat completion endpoint
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const username = req.body.username;
        const threadId = req.body.threadId;

        // initialize groq sdk with api key
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: userMessage }],
            model: 'llama-3.1-8b-instant',
        });
        const aiReply = response.choices[0].message.content;

        let activeThread;

        // if threadId exists, append messages to that existing thread
        if (threadId) {
            activeThread = await Chat.findById(threadId);
            if (activeThread) {
                activeThread.messages.push({ text: userMessage, isUser: true });
                activeThread.messages.push({ text: aiReply, isUser: false });
                activeThread.updatedAt = Date.now();
                await activeThread.save();
            }
        } else {
            // if no threadId, create a brand new conversation thread
            const shortTitle = userMessage.length > 25 ? userMessage.substring(0, 25) + "..." : userMessage;
            activeThread = new Chat({
                username: username,
                title: shortTitle,
                messages: [
                    { text: userMessage, isUser: true },
                    { text: aiReply, isUser: false }
                ]
            });
            await activeThread.save();
        }

        console.log("Chat saved successfully! Thread ID:", activeThread._id);

        // Send back both the reply and the threadId
        res.json({ reply: aiReply, threadId: activeThread._id });

    } catch (error) {
        console.log("Error inside /chat route:", error);
        res.status(500).json({ reply: "Sorry, the server had an error!" });
    }
});

// --- Get Past Chats Route ---
app.get('/history', async (req, res) => {
    try {
        const { username } = req.query; // Filter by the logged-in user
        const history = await Chat.find({ username: username }).sort({ updatedAt: -1 }); // Get threads, newest updated first
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to get history" });
    }
});

// --- Clear Chat History Route ---
app.delete('/history', async (req, res) => {
    try {
        const { username } = req.query; // Only clear this specific user's chats
        await Chat.deleteMany({ username: username });
        res.json({ message: "History cleared!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear history" });
    }
});

// --- Delete Single Chat Route ---
app.delete('/history/:id', async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.id); // Delete one chat by its ID
        res.json({ message: "Chat deleted!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

// --- Rename Single Chat Route ---
app.put('/history/:id', async (req, res) => {
    try {
        const { title } = req.body;
        await Chat.findByIdAndUpdate(req.params.id, { title, updatedAt: Date.now() });
        res.json({ message: "Chat renamed successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to rename chat" });
    }
});

// --- ADMIN DASHBOARD API ROUTES ---

// 1. Get General Analytics Stats
app.get('/admin/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalThreads = await Chat.countDocuments();
        
        // Sum up total messages inside all conversation threads
        const allThreads = await Chat.find({}, 'messages');
        let totalMessages = 0;
        allThreads.forEach(t => {
            if (t.messages) totalMessages += t.messages.length;
        });

        res.json({ totalUsers, totalThreads, totalMessages });
    } catch (err) {
        console.error("Error loading admin stats:", err);
        res.status(500).json({ error: "Failed to load admin stats" });
    }
});

// 2. Get All Registered Users with their thread counts
app.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username role');
        
        const userListWithThreadCounts = await Promise.all(users.map(async (u) => {
            const threadCount = await Chat.countDocuments({ username: u.username });
            return {
                _id: u._id,
                username: u.username,
                role: u.role || 'user',
                threadCount
            };
        }));

        res.json(userListWithThreadCounts);
    } catch (err) {
        console.error("Error loading admin users list:", err);
        res.status(500).json({ error: "Failed to load admin users list" });
    }
});

// 3. Delete a User account and cascade delete all of their conversations
app.delete('/admin/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        // Remove account
        await User.findOneAndDelete({ username });
        
        // Cascade remove all history logs
        await Chat.deleteMany({ username });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user and cascade history" });
    }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Backend Server is running perfectly on port " + PORT);
});
