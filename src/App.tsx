import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import GuestLoginPage from './pages/GuestLoginPage';
import RequestPage from './pages/RequestPage';
import CategoryRequestPage from './pages/CategoryRequestPage';
import PDFDetailPage from './pages/PDFDetailPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import ClickSpark from './components/common/ClickSpark';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Get the base URL for GitHub Pages deployment
  const basename = import.meta.env.MODE === 'production' ? '/pdf-library-hub' : '';
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <div className="min-h-screen">
          {/* Global click spark overlay */}
          <ClickSpark />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pdf/:id" element={<PDFDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/guest-login" element={<GuestLoginPage />} />
              <Route path="/request" element={<RequestPage />} />
              <Route path="/request-category" element={<CategoryRequestPage />} />
              <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
