import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const userId = localStorage.getItem('userId');
    const port = process.env.REACT_APP_API_PORT || 5000;
    const token = localStorage.getItem('token'); // Replace 'token' with your actual token key

    const loadHistory = () => {
        axios.get(`http://localhost:${port}/api/chat/history/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                setMessages(response.data.map(msg => ({
                    text: msg.content,
                    sender: msg.sender === userId ? 'user' : 'ai'
                })));
            })
            .catch(error => console.error('Error fetching chat history:', error));
    };
    const handleSend = async () => {
        if (inputText !== "") {
            const userMessage = inputText;
            setMessages(messages => [...messages, { text: userMessage, sender: 'user' }]);
            setInputText("");

            try {
                const response = await axios.post(`http://localhost:${port}/api/chat`,
                    { message: userMessage, userId },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const aiMessage = response.data.response;
                setMessages(messages => [...messages, { text: aiMessage, sender: 'ai' }]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const suggestActivity = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const weatherData = await fetchWeatherData(latitude, longitude); 
                const Message = `What can I do in ${weatherData.location} with ${weatherData.weather} condition, ${weatherData.temperature} Degree Celsius, at ${weatherData.time}?`;
                sendMessage(Message);
            }, (error) => {
                console.error('Error getting location:', error);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const fetchWeatherData = async (latitude, longitude) => {
        const apiKey = 'a164573a9bee41d9ab005932242801'; 
        const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return {
                location: data.location.name,
                weather: data.current.condition.text,
                temperature: data.current.temp_c,
                time: data.location.localtime,
            };
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const sendMessage = (message) => {
        setInputText(message); 
        handleSend(); 
    };

    return (
        <div className="chat-container">
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-3">
                        <button className="btn btn-info" onClick={loadHistory}>Load History</button>
                    </div>
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-footer chat-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                    <button className="btn btn-success ml-2" onClick={suggestActivity}>Do Activities</button>

                </div>
            </div>
        </div>
    );
}
export default Chat;
