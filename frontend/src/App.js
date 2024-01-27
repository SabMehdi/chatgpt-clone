
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './chat/chat';
import Register from './auth/Register';
import Login from './auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar/Navbar';
import { AuthProvider } from './auth/AuthContext';
import Welcome from './welcome/welcome';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/chat" element={<Chat />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;