import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setAuth } = useAuth();
    const port=process.env.REACT_APP_API_PORT || 5000;

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:${port}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log('Login successful:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', data.userId);
                setAuth({
                    isAuthenticated: true,
                    username: username,
                });
                navigate('/');
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Login failed due to an error');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label login-form-label">Username</label>
                    <input
                        type="text"
                        className="form-control login-form-input"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label login-form-label">Password</label>
                    <input
                        type="password"
                        className="form-control login-form-input"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn login-form-button">Login</button>
            </form>
        </div>
    );
}
export default Login;
