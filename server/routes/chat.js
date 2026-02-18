const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST api/chat
// @desc    Chat with AI Financial Assistant
// @access  Private
router.post('/', auth, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a helpful and knowledgeable financial assistant for a personal expense tracking app called ExpenseMe. 
        Your goal is to help users manage their finances, provide budgeting tips, and answer questions about money management.
        Keep your answers concise, encouraging, and practical.
        
        User: ${message}
        Assistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error('Gemini API Error:', err);
        res.status(500).send('Error communicating with AI service');
    }
});

module.exports = router;
