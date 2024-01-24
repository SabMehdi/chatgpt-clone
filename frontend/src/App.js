import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:3000/chat', { message });
      setConversation([...conversation, { message, response: response.data }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Chat with GPT-3</h1>
      {conversation.map((exchange, index) => (
        <div key={index}>
          <p>User: {exchange.message}</p>
          <p>GPT-3: {exchange.response}</p>
        </div>
      ))}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
