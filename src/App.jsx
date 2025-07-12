import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { SwapDashboard } from './pages/SwapDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AnnouncementBanner 
        announcement={{
          id: 'welcome',
          title: 'Welcome to Skill Swap!',
          message: 'Join our community and start exchanging skills with others.'
        }}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/swaps" element={user ? <SwapDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="border-t bg-background/50 backdrop-blur py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Skill Swap Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Skill Swap</span>
            </div>
            <p className="text-muted-foreground mb-2">&copy; 2025 Skill Swap Platform. Built with React, Firebase, TailwindCSS by Teerth, Gaurav, Saksham, and Jasmin.</p>
            <a 
              href="https://github.com/teerthjj912/skill-swap-odoo-hackathon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 underline decoration-dotted underline-offset-4"
            >
              Original GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 