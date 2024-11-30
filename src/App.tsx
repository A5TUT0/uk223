import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import NotPage from "./pages/404";
import Register from './pages/register';
import Home from './Home';

function App() {
  return (
    <div className="bg-[#09090B] min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
