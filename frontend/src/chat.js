import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");

    const handleSend = async () => {
        if (inputText !== "") {
            const userMessage = inputText;
            setMessages(messages => [...messages, { text: userMessage, sender: 'user' }]);
            setInputText("");

            try {
                const response = await axios.post('http://localhost:3000/chat', { message: userMessage });
                const aiMessage = response.data.response; // Updated line
                console.log('Received response:', response.data); // Updated log
                setMessages(messages => [...messages, { text: aiMessage, sender: 'ai' }]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="chat-box bg-light" style={{ height: '400px', overflowY: 'scroll' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`p-2 mb-2 ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'} text-white rounded`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleSend}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
