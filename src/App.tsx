import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Layout/Navigation';
import PomodoroTimer from './components/Timer/PomodoroTimer';
import TaskManager from './components/Tasks/TaskManager';
import Dashboard from './components/Analytics/Dashboard';
import About from './pages/About';
import Feedback from './pages/Feedback';
import Auth from './pages/Auth';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Loading TimeVault...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PomodoroTimer />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
