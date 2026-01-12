import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import MapVisualization from './pages/MapVisualization';
import CommunityVoting from './pages/CommunityVoting';
import CollaborationDashboard from './pages/CollaborationDashboard';
import ImpactMonitoring from './pages/ImpactMonitoring';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import IntroVideo from './components/IntroVideo';
import ARView from './pages/ARView';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroVideo onComplete={() => setShowIntro(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
            <Route path="/map" element={<MapVisualization />} />
            <Route path="/voting" element={<CommunityVoting />} />
            <Route path="/collaboration" element={<CollaborationDashboard />} />
            <Route path="/impact" element={<ImpactMonitoring />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ar-view" element={<ARView />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
