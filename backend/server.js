const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ChatSession = require('./models/Message');
const chatRoutes = require('./routes/chat');
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

app.use('/api', chatRoutes);