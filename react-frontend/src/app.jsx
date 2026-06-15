import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/loginScreen'; 
import RegistrationScreen from './pages/RegistrationScreen'; 
import { AuthProvider } from './context/authContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/woltTheme.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegistrationScreen />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;