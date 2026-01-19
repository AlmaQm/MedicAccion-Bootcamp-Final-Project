export function claseDia(fechaKey, medicamentos) {
  const meds = medicamentos[fechaKey] || [];
  if (meds.length === 0) return "";

  const fecha = new Date(fechaKey);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const todasCompletas = meds.every(
    m => (m.tomadas || 0) >= (m.total_tomas || 1)
  );

  if (todasCompletas) return "dia-completo"; // verde
  if (fecha < hoy) return "dia-incompleto"; // rojo
  return "dia-registrado"; // azul
}