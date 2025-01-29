import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Management from './components/Management';
import Doctor from './components/Doctor';
import Staff from './components/Staff';
import PublicView from './components/PublicView';
import Navigation from './components/Navigation';
import { localDataService } from './lib/localData';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const currentUser = localDataService.getCurrentUser();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function RoleBasedDashboard() {
  const currentUser = localDataService.getCurrentUser();
  
  switch (currentUser?.role) {
    case 'management':
      return <Management />;
    case 'doctor':
      return <Doctor />;
    case 'staff':
      return <Staff />;
    default:
      return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                  MARTY Healthcare
                </span>
              </div>
              <Navigation />
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <RoleBasedDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;