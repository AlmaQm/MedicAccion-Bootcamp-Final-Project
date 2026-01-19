import { useState } from "react";
import api from "../api";
import { ACCES_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import logoimg from "../assets/logo_svg.svg";
import { Link } from "react-router-dom";
import '../styles/Login.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await api.post("/api/token/",{username, password})
      if (res.status === 200) {
        toast.success(`Inicio de sesión correcto`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
        localStorage.setItem(ACCES_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        // Persist the username so Home can show a personalized greeting
        localStorage.setItem('username', username);
        setTimeout(() => {
          navigate("/");
        }, 999);
      }
    }catch(error){
      toast.error("Error al iniciar sesión", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    }
  }
  return (
    <>
    <div className="waves"></div>
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">MedicAcción</h1>
            <img
                src={logoimg}
                alt="MediAccion Logo"
                style={{ height: "100px", marginRight: "8px" }}
            />
        <p className="login-subtitle">Tu calendario médico personal</p>

        <h2>{username}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            id="user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>
        <p className="register-footer">
          ¿No tienes cuenta? <Link className="register-link" to="/register">Registrate!</Link>
        </p>
        <footer className="login-footer">
          <small>© {new Date().getFullYear()} MedicAcción</small>
        </footer>
      </div>
    </div>
    <ToastContainer />
    </>
  );
};

export default Login;