import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const userId = localStorage.getItem('userId');
    const port = process.env.REACT_APP_API_PORT || 5000;
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
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
        setIsLoading(true);
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
        setIsLoading(false);
    };

    const suggestActivity = async () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const weatherData = await fetchWeatherData(latitude, longitude);
                if (weatherData) {
                    const message = `What can I do in ${weatherData.name}, ${weatherData.country} with ${weatherData.weather} condition, ${weatherData.temperature} Degree Celsius, at ${weatherData.time}?`;
                    setInputText(message);
                } else {
                    console.error('Error fetching weather data');
                }
                setIsLoading(false);
            }, (error) => {
                console.error('Error getting location:', error);
                setIsLoading(false);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            setIsLoading(false); 
        }
    };


    const fetchWeatherData = async (latitude, longitude) => {
        const apiKey = 'a164573a9bee41d9ab005932242801';
        const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return {
                name: data.location.name,
                country: data.location.country,
                weather: data.current.condition.text,
                temperature: data.current.temp_c,
                time: data.location.localtime,
            };
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };



    return (
        <div className="chat-container">


            <div className="text-center mb-3">
                <button className="btn btn-info mt-3" onClick={loadHistory}>Load History</button>
                {isLoading && <div className="spinner-border text-primary" role="status">
                    <span className="sr-only"></span>
                </div>}
            </div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>


            <div className=" chat-input">
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
                    disabled={isLoading}
                >
                    Send
                </button>

                <button className="btn btn-success ml-2" onClick={suggestActivity} disabled={isLoading}>Do Activities</button>

            </div>

        </div>
    );
}
export default Chat;
