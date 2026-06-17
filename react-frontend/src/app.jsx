import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginScreen from './pages/LoginScreen'; 
import RegistrationScreen from './pages/RegistrationScreen'; 
import DashboardScreen from './pages/DashboardScreen';
import RestaurantMenuScreen from './pages/RestaurantMenuScreen';
import ProfileScreen from './pages/ProfileScreen';
import OwnerDashboardScreen from './pages/OwnerDashboardScreen';
import OwnerMenuManagerScreen from './pages/OwnerMenuManagerScreen';

// Context and Guards
import { AuthProvider } from './context/authContext'; 
import { ThemeProvider } from './context/themeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import SearchResultsView from './pages/SearchResultsView';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/woltTheme.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegistrationScreen />} />
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/restaurant/:id" element={<RestaurantMenuScreen />} />
            <Route path="/search/:query" element={<SearchResultsView />} />

            {/* --- Protected Routes --- */}
            {/* The new Profile Screen is fully protected by the Route Guard */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              } 
            />

            {/* --- Owner Protected Routes --- */}
            <Route 
              path="/owner/dashboard" 
              element={
                <ProtectedRoute requireOwner={true}>
                  <OwnerDashboardScreen />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/restaurant/:id" 
              element={
                <ProtectedRoute requireOwner={true}>
                  <OwnerMenuManagerScreen />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;