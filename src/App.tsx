import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import NotPage from "./pages/404";
import Register from './pages/register';
import Home from './Home';
import Settings from './components/settings';
import ProfileActivity from './components/ProfileActivity';

function App() {
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="bg-[#09090B] min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileActivity />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
