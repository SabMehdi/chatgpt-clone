
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './chat';
import Register from './Register';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { AuthProvider } from './AuthContext';
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      );
}

      export default App;