import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginScreen from './pages/loginScreen'; 
import RegistrationScreen from './pages/RegistrationScreen'; 
import DashboardScreen from './pages/DashboardScreen';
import RestaurantScreen from './pages/RestaurantScreen';

// Context and Guards
import { AuthProvider } from './context/authContext'; 
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/woltTheme.css';

function App() {
  return (
    <AuthProvider>
      {/* BrowserRouter is the main wrapper that enables client-side routing */}
      <BrowserRouter>
        <Routes>
          
          {/* --- Public Routes (Anyone can access these) --- */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegistrationScreen />} />
          
          {/* Main screens are now public so guests can browse */}
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/restaurant/:id" element={<RestaurantScreen />} />

          {/* --- Protected Routes (Require Authentication) --- */}
          {/* Example for future use when we build checkout/profile: */}
          {/* <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} /> */}
          
          {/* Catch-all route: If user types a random URL, bounce them to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;