import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (inputText !== "") {
            setMessages([...messages, inputText]);
            setInputText("");
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
                                    <div key={index} className="p-2 mb-2 bg-secondary text-white rounded">
                                        {msg}
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
