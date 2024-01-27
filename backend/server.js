const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ChatSession = require('./models/Message');
const PORT = process.env.PORT;
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('GPT-Gate Backend is runnifffng');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);


app.post('/chat', async (req, res) => {
  const { message: userMessage, userId } = req.body;

  try {
    console.log('Sending request to OpenAI API...', userMessage);

    // Create a chat completion request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": userMessage }],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    });

    console.log("OpenAI API Response:", response);

    if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
      const aiResponse = response.choices[0].message.content;
      let chatSession = await ChatSession.findOne({ user: userId });
      if (!chatSession) {
        chatSession = new ChatSession({ user: userId });
      }

      // Add user's message to the session
      chatSession.messages.push({ sender: userId, content: userMessage });

      // Add AI's response to the session
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

app.get('/chat/history/:userId', async (req, res) => {
  try {
    const chatSession = await ChatSession.findOne({ user: req.params.userId })
      .populate('user', 'username') // Populate user details if needed
      .exec();

    if (!chatSession) {
      return res.status(404).json({ message: 'No chat history found' });
    }

    res.json(chatSession.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving chat history', error });
  }
});
