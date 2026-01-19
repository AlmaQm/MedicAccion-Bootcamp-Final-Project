import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Calendario from './pages/Calendario.jsx';
import Perfil from './pages/Perfil.jsx';
import Login from './pages/Login.jsx';
import Progresos, { ProgresosIndex, PremiosView } from "./pages/Progresos.jsx";
import Logout from './components/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Register from './pages/Register.jsx';
import TesseractOCR from './pages/TesseractOCR.jsx';
import Chatbot from './pages/Chatbot.jsx';


export default function App() {
  return (
    <div>
      <main>
        <Routes>
          <Route element={<ProtectedRoute />} >
            <Route path="/" element={<Home />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/tesseractOCR" element={<TesseractOCR />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/progresos" element={<Progresos />}>
              <Route index element={<ProgresosIndex />} />
              <Route path="premios" element={<PremiosView />} />
            </Route>
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Logout metodo="register" />} />
          <Route path="/registration" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

    </div>
  );
}







