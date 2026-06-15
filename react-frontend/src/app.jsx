import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginScreen from './pages/loginScreen'; 
import { AuthProvider } from './context/authContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>
  );
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;