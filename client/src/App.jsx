import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import History from './pages/History';
import Analytics from './pages/Analytics';
import AiAnalysis from './pages/AiAnalysis';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import DataPortability from './pages/DataPortability';
import AiChatbot from './components/AiChatbot';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <ThemeProvider>
          <Router>
            <div style={{ position: 'relative' }}>
              <Routes>
                <Route path="/" element={<Landing />} />

                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />

                <Route path="/history" element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                } />
                <Route path="/analytics" element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                } />

                <Route path="/ai-analysis" element={
                  <PrivateRoute>
                    <AiAnalysis />
                  </PrivateRoute>
                } />

                <Route path="/subscriptions" element={
                  <PrivateRoute>
                    <Subscriptions />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                <Route path="/data-portability" element={
                  <PrivateRoute>
                    <DataPortability />
                  </PrivateRoute>
                } />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />

              </Routes>
              <AiChatbot />
            </div>
          </Router>
        </ThemeProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
