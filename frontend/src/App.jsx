import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TargetCursor from './components/TargetCursor';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Resources from './pages/Resources';
import ResumeBuilder from './pages/ResumeBuilder';
import AIPrep from './pages/AIPrep';
import PlacementCalendar from './pages/PlacementCalendar';
import OfferCompare from './pages/OfferCompare';
import Profile from './pages/Profile';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return 'Dashboard Overview';
      case '/applications':
        return 'Company Applications';
      case '/ai-prep':
        return 'AI Interview Prep';
      case '/calendar':
        return 'Schedule Calendar';
      case '/offer-compare':
        return 'Offer Comparison Matrix';
      case '/resources':
        return 'Preparation Resources';
      case '/resume-builder':
        return 'ATS Resume Builder';
      case '/profile':
        return 'User Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-wrapper">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getPageTitle(location.pathname)} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/ai-prep" element={<AIPrep />} />
            <Route path="/calendar" element={<PlacementCalendar />} />
            <Route path="/offer-compare" element={<OfferCompare />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TargetCursor
          targetSelector=".btn, button, a, .menu-item, input, select, .card, .cursor-target"
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          cursorColor="#06C3B4"
          cursorColorOnTarget="#05AC9E"
        />
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<AppLayout />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
