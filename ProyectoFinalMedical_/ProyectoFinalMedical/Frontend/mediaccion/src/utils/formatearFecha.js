// /src/utils/formatearFecha.js

// Convierte una fecha a formato YYYY-MM-DD en zona local
export const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const d = new Date(fecha);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
