import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';

// Auth Pages
import Splash from './pages/auth/Splash';
import Onboarding from './pages/auth/Onboarding';
import RoleSelection from './pages/auth/RoleSelection';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// User Flow Pages
import Home from './pages/user/Home';
import RideComparison from './pages/user/RideComparison';
import ExplainableAI from './pages/user/ExplainableAI';
import Profile from './pages/user/Profile';
import EmergencyContacts from './pages/user/EmergencyContacts';
import ThemeSettings from './pages/user/ThemeSettings';
import InviteFriend from './pages/user/InviteFriend';
import SafetyPrivacy from './pages/user/SafetyPrivacy';
import Parcel from './pages/user/Parcel';

// Placeholder components for Phase 4
const CaptainDashboard = () => <div className="p-8 text-white">Captain Dashboard (Coming in Phase 4)</div>;
const Placeholder = ({ title }) => <div className="p-8 text-white">{title} (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileContainer />}>
          {/* Auth Flow */}
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* User App Flow */}
          <Route path="/user/home" element={<Home />} />
          <Route path="/user/ride-comparison" element={<RideComparison />} />
          <Route path="/user/ai-insights" element={<ExplainableAI />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/emergency" element={<EmergencyContacts />} />
          <Route path="/user/theme" element={<ThemeSettings />} />
          <Route path="/user/invite" element={<InviteFriend />} />
          <Route path="/user/safety" element={<SafetyPrivacy />} />
          <Route path="/user/parcel" element={<Parcel />} />
          
          {/* Bottom Nav Placeholders */}
          <Route path="/user/rides" element={<Placeholder title="My Rides" />} />
          <Route path="/user/activity" element={<Placeholder title="Activity Notifications" />} />

          {/* Captain App Flow */}
          <Route path="/captain/dashboard" element={<CaptainDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
