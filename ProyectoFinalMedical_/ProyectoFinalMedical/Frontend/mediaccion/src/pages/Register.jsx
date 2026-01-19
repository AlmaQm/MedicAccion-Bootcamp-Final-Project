import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  validarUsuario,
  validarContraseña,
  validarNombre,
  validarApellido,
  validarEmail,
  validarFechaNacimiento,
  actualizarPlaceholderTelefono,
  validarTelefonoNumero,
} from "../utils/Validaciones";
import '../styles/Register.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    profile: {
      date_birth: "",
      roles: "user",
      genero: "",
      pais: "+34",
      telefono: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passChangeMessage, setPassChangeMessage] = useState("");
  const [passChangeMessageType, setPassChangeMessageType] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const navigate = useNavigate();

  /** 🔹 Inicializar placeholder teléfono */
  useEffect(() => {
    const cleanup = actualizarPlaceholderTelefono("pais", "telefono");
    return cleanup;
  }, []);

  /** 🔹 Deshabilitar botón si:
   * - Hay errores
   * - Hay error en teléfono
   * - No coinciden contraseñas
   * - Falta algún campo obligatorio
   */
  useEffect(() => {
    const hasFieldErrors = Object.values(errors).some((e) => e !== "");
    const passDontMatch = formData.password !== confirmPassword;
    const missingFields = !formData.username || !formData.email || !formData.profile.genero;

    setIsDisabled(
      hasFieldErrors ||
        phoneError ||
        passDontMatch ||
        missingFields
    );
  }, [errors, confirmPassword, phoneError, formData]);

  /** 🔸 VALIDACIONES en un diccionario */
  const validators = {
    username: validarUsuario,
    first_name: validarNombre,
    last_name: validarApellido,
    email: validarEmail,
    date_birth: validarFechaNacimiento,
  };

  /** 🔹 handleChange optimizado */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const isProfileField = ["date_birth", "roles", "genero", "pais", "telefono"].includes(name);

    // Actualizar formData
    setFormData((prev) =>
      isProfileField
        ? { ...prev, profile: { ...prev.profile, [name]: value } }
        : { ...prev, [name]: value }
    );

    // Validación automática
    if (validators[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validators[name](value),
      }));
    }

    // Validar contraseña
    if (name === "password") {
      if (!validarContraseña(value)) {
        setPasswordMessage(
          "Debe tener min 8 caracteres, mayúscula, minúscula, número y símbolo"
        );
        setPasswordMessageType("error");
      } else {
        setPasswordMessage("Contraseña válida");
        setPasswordMessageType("ok");
      }
    }

    // Validar teléfono
    if (name === "telefono") {
      const soloNumeros = value.replace(/[^0-9]/g, "");
      const error = validarTelefonoNumero(formData.profile.pais, soloNumeros);
      setPhoneError(error);
    }
  };

  /** 🔹 Confirmación de contraseña */
  const handleChangePassword = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (val !== formData.password) {
      setPassChangeMessage("Las contraseñas no coinciden");
      setPassChangeMessageType("error");
    } else {
      setPassChangeMessage("Las contraseñas coinciden");
      setPassChangeMessageType("ok");
    }
  };

  /** 🔹 Submit final */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/users/crear/", formData);

       if (response.status === 201) {
        toast.success(`Registro completado con éxito 🩺`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
      setTimeout(() => {
        navigate("/login");
      }, 999);
    } catch (error) {
      toast.error("Error al registrarse", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    }
  };

  return (
    <>
    <div className="waves"></div>
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear cuenta</h2>
        <p className="register-subtitle">Regístrate para gestionar tus recordatorios médicos</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
          {errors.first_name && <ErrorLabel msg={errors.first_name} />}

          <label>Apellidos</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Tus apellidos"
            required
          />
          {errors.last_name && <ErrorLabel msg={errors.last_name} />}

          <label>Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Crea tu usuario"
            required
          />
          {errors.username && <ErrorLabel msg={errors.username} />}

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña"
            required
          />
          {passwordMessage && (
            <Message type={passwordMessageType} msg={passwordMessage} />
          )}

          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChangePassword}
            placeholder="Repite la contraseña"
            required
          />
          {passChangeMessage && (
            <Message type={passChangeMessageType} msg={passChangeMessage} />
          )}

          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
          {errors.email && <ErrorLabel msg={errors.email} />}

          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="date_birth"
            value={formData.date_birth}
            onChange={handleChange}
            required
          />
          {errors.date_birth && <ErrorLabel msg={errors.date_birth} />}

          <label>Genero</label>
          <select 
            className="genero" 
            name="genero" 
            id="genero" 
            value={formData.profile.genero} 
            onChange={handleChange}
            >
              <option value="" disabled>Selecciona genero...</option>
              <option value="no_decir">Prefiero no decirlo</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
          </select>

          <label>Teléfono</label>
          <div className="phone-combo" id="phone">
            <div className="select-wrap" aria-hidden="false">
              <select 
                name="pais" 
                id="pais" 
                aria-label="Seleccionar país"
                value={formData.profile.pais || '+34'}
                onChange={(e) =>
                handleChange({
                  target: { name: "pais", value: e.target.value },
                })
              }
                >
                  <option value="+34">🇪🇸 +34</option>
              </select>
            </div>
            
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.profile.telefono}
              onChange={handleChange}
              required
            />
          </div>
          {phoneError && <ErrorLabel msg={phoneError} />}


          <button type="submit" className="register-btn" disabled={isDisabled}>Registrarse</button>
        </form>
        
        <p className="login-footer">
          ¿Ya tienes cuenta? <Link className="register-link" to="/login">Inicia sesión</Link>
        </p>
        <footer className="login-footer">
          <small>© {new Date().getFullYear()} MediAcción</small>
        </footer>
      </div>
    </div>
    <ToastContainer />
    </>
  );
}

/* 🔹 Componentes pequeños para limpiar JSX */
const ErrorLabel = ({ msg }) => (
  <label style={{ color: "red", fontSize: "12px", display: "block" }}>{msg}</label>
);

const Message = ({ msg, type }) => (
  <label style={{ color: type === "error" ? "red" : "green", fontSize: "12px" }}>
    {msg}
  </label>
);