import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthProvider';
import AppContent from '../AppContent';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
