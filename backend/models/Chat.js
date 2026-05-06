const mongoose = require('mongoose');

// This defines what a chat message looks like in our database
const chatSchema = new mongoose.Schema({
    username: String, // Owner of this chat thread
    title: String,    // First message text
    messages: [
        {
            text: String,
            isUser: Boolean,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
module.exports = mongoose.model('Chat', chatSchema);
