const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const Message = require('./models/Message');

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
  const { message: userMessage, userId } = req.body; // Include userId in the request body

  try {
    console.log('Sending request to OpenAI API...', userMessage);

    // Create a chat completion request to OpenAI
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

    console.log("OpenAI API Response:", response);

    if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
      const aiResponse = response.choices[0].message.content;
      console.log('Received response from OpenAI API:', aiResponse);

      // Save user's message
      const userMsg = new Message({ sender: userId, content: userMessage });
      await userMsg.save();

      // Save AI's response
      const aiMsg = new Message({ sender: null, content: aiResponse }); // Assuming null for AI sender
      await aiMsg.save();

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


// Function to save a message
const saveMessage = async (senderId, content) => {
  const message = new Message({
    sender: senderId,
    content: content
  });
  await message.save();
};