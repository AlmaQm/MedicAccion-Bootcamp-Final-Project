export function validarUsuario(value) {
    const USER_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9]|[._-](?=[A-Za-z0-9])){1,18}[A-Za-z0-9]$/;

    if (!USER_REGEX.test(value)) {
        return "El usuario debe de tener entre 3 y 20 caracteres, y terminar con letra o numero";
    } 
    
    return "";
}

export function validarContraseña(value) {
    const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:_\-])[A-Za-z\d@$!%*?&.,;:_\-]{8,}$/;

    if (!PASS_REGEX.test(value)) {
        return false;
    }

    return true;
}

export function validarNombre(value) {
    const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

    if (!NAME_REGEX.test(value)) {
        return "El nombre solo puede contener letras y espacios, mínimo 2 caracteres"
    }

    return "";
}

export function validarApellido(value) {
    const LASTNAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

    if (!LASTNAME_REGEX.test(value)) {
        return "El apellido solo puede contener letras y espacios, mínimo 2 caracteres"
    }

    return "";
}

export function validarEmail(value) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EMAIL_REGEX.test(value)) {
        return "Correo electrónico no válido"
    }

    return "";
}

export function validarFechaNacimiento(value){
    return "";
}

export function actualizarPlaceholderTelefono(country, phone) {
    const pais = document.getElementById(country);
    const telefono = document.getElementById(phone);
    if (!pais || !telefono) return;

    function updatePlaceholder() {
        const code = pais.value || "";
        telefono.placeholder = "Número de teléfono";
    }

    pais.addEventListener("change", updatePlaceholder);
    updatePlaceholder();

    // devolver cleanup para poder quitar el listener
    return () => {
        pais.removeEventListener("change", updatePlaceholder);
    };
}

export function validarTelefonoNumero(countryCode, number){
    const cleaned = number.replace(/\D/g, "");

    switch (countryCode) {
    case "+34":
        if (!/^[6789]\d{0,8}$/.test(cleaned)) {
            return "Número español inválido. Debe empezar por 6,7,8 o 9 y tener 9 dígitos.";
        }
        break;
    case "+49":
        if (!/^\d{0,11}$/.test(cleaned)) {
            return "Número alemán inválido. Máx 11 dígitos.";
        }
        break;
    default:
        return "Código de país no soportado.";
    }

    return "";
}

export function validarCamposRepetidos(name, value, copyValue){
    switch (name) {
    case "first_name":
        if (value === copyValue) {
            return "El nombre no puede ser el mismo que antes";
        }
        return validarNombre(value);

    case "last_name":
        if (value === copyValue) {
            return "El apellido no puede ser el mismo que antes";
        }
        return validarApellido(value);

    case "email":
        if (value === copyValue) {
            return "El email no puede ser el mismo que antes";
        }
        return validarEmail(value);

    case "fecha_nacimiento":
        if (value === copyValue) {
            return "La fecha de nacimiento no puede ser el mismo que antes";
        }
        return validarFechaNacimiento(value);
    
    case "telefono":
        if (value === copyValue) {
            return "el número de telefono es el mismo que antes";
        }
        //Si se añaden mas paises hay que cambiar la variable
        const p = "+34"
        return validarTelefonoNumero(p, value);

    default:
      return "";
  }
}