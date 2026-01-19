
import { createContext, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MedContext = createContext();

export const MedProvider = ({ children }) => {
   const [medicamentos, setMedicamentos] = useState({});

   // --- Registrar toma de medicamento
   const registrarToma = async (med) => {
      const ahora = new Date();
      const fechaKey = med.fecha;
      const nuevasTomadas = (med.tomadas || 0) + 1;

      setMedicamentos(prev => {
         const medsDelDia = (prev[fechaKey] || []).map(mItem =>
            mItem.id === med.id
               ? { ...mItem, tomadas: nuevasTomadas, ultima_toma: ahora.toISOString() }
               : mItem
         );

         // Verificar si todas las tomas del día están completadas
         const todasCompletas = medsDelDia.every(m => (m.tomadas || 0) >= (m.total_tomas || 1));

         if (todasCompletas) {
            toast.success(`¡Día de ${med.nombre} completado!`, {
               position: "top-right",
               autoClose: 3000,
               theme: "colored"
            });
         }

         // Verificar si es el último día del medicamento
         const fechasMedicamento = Object.keys(prev).filter(f =>
            prev[f].some(mItem => mItem.nombre === med.nombre)
         );
         const ultimaFecha = fechasMedicamento.sort().reverse()[0];

         if (fechaKey === ultimaFecha && todasCompletas) {
            medsDelDia.forEach(mItem => {
               if (mItem.id === med.id && !mItem.desbloquearPremio) {
                  mItem.desbloquearPremio = true;
                  toast.info(`🏆 ¡Premio desbloqueado por completar ${med.nombre}!`, {
                     position: "top-right",
                     autoClose: 4000,
                     theme: "colored"
                  });
               }
            });
         }

         return { ...prev, [fechaKey]: medsDelDia };
      });

      try {
         await api.put(`/api/medicamentos-programados/${med.id}/`, {
            tomadas: nuevasTomadas,
            ultima_toma: ahora.toISOString()
         });
      } catch (err) {
         toast.error("Error al registrar la toma", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored"
         });
      }
   };

   return (
      <MedContext.Provider value={{ medicamentos, setMedicamentos, registrarToma }}>
         {children}
      </MedContext.Provider>
   );
};
