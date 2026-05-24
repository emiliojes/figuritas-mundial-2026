import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Collection from './pages/Collection';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Spares from './pages/Spares';
import TradeGroups from './pages/TradeGroups';
import TradeGroupDetail from './pages/TradeGroupDetail';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <LangProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout><Collection /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos"
            element={
              <ProtectedRoute>
                <Layout><Groups /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos/:id"
            element={
              <ProtectedRoute>
                <Layout><GroupDetail /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/repetidas"
            element={
              <ProtectedRoute>
                <Layout><Spares /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/intercambio"
            element={
              <ProtectedRoute>
                <Layout><TradeGroups /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/intercambio/:id"
            element={
              <ProtectedRoute>
                <Layout><TradeGroupDetail /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </LangProvider>
  );
}

export default App;
