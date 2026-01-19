import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCES_TOKEN } from "../constants";


export default function Logout({metodo}) {
//al registrarse, borramos cache para evitar que envie token si se habia iniciado sesion con anterioridad
  useEffect(() => {
    // Aquí cierras sesión
    //localStorage.removeItem(REFRESH_TOKEN);
    //localStorage.removeItem(ACCES_TOKEN);
    localStorage.clear()

  }, []);

  // Después de ejecutar el logout, redirige
  if(metodo == "register"){
    return <Navigate to="/registration" replace />;
  }

  return <Navigate to="/login" replace />;
}