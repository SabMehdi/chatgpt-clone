const express = require('express');

const ChatSession = require('../models/Message');
const { OpenAI } = require('openai');

const router = express.Router();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const requireAuth = require('./requireAuth');

router.post('/chat',requireAuth, async (req, res) => {
    const { message: userMessage, userId } = req.body;

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ "role": "user", "content": userMessage }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false
        });


        if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
            const aiResponse = response.choices[0].message.content;
            let chatSession = await ChatSession.findOne({ user: userId });
            if (!chatSession) {
                chatSession = new ChatSession({ user: userId });
            }

            chatSession.messages.push({ sender: userId, content: userMessage });

            if (aiResponse) {
                chatSession.messages.push({ sender: null, content: aiResponse });
            }

            await chatSession.save();

            res.json({ response: aiResponse });
        } else {
            console.error('Unexpected response format:', response);
            res.status(500).json({ message: 'Unexpected response format from OpenAI API' });
        }
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
});

router.get('/chat/history/:userId',requireAuth, async (req, res) => {
    try {
        const chatSession = await ChatSession.findOne({ user: req.params.userId })
            .populate('user', 'username')
            .exec();

        if (!chatSession) {
            return res.status(404).json({ message: 'No chat history found' });
        }

        res.json(chatSession.messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving chat history', error });
    }
});

module.exports = router;