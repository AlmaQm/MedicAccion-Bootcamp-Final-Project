// LimpiarTexto.jsx Tesseract OCR:
import React from "react";
import { remove as removeAccents } from "diacritics";
import Fuse from "fuse.js";

/**
 * Lista base de medicamentos comunes en España.
 */
const MEDICAMENTOS_ESPANA = [
  'omeprazol', 'ibuprofeno', 'paracetamol', 'frenadol'
];

/**
 * Patrones regex solicitados
 */
const PATTERNS = {
  // Dosis: 500mg, 20 mg, 10mg/ml, 5 g, etc.
  dosis: /(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|UI|u|µg)(?:\/(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|µg))?/gi,

  // Vía de administración
  via: /(?:vía|via)\s*(oral|intravenosa|intramuscular|subcutánea|subcutanea|tópica|topica|oftálmica|oftalmica|ótica|otica)/gi,
};

/**
 * Configuración fuzzy
 */
const fuse = new Fuse(MEDICAMENTOS_ESPANA, {
  includeScore: true,
  threshold: 0.4,
});

/**
 * Normaliza y limpia un texto OCR en varias etapas:
 * 1. Limpieza fuerte de ruido
 * 2. Limpieza suave
 * 3. Normalización NLP
 * 4. Extracción regex de patrones clave
 * 5. Detección fuzzy del medicamento
 */
export function cleanOcrText(ocrText) {
  if (!ocrText) return "";

  let text = ocrText;

  // ============================================================
  // 1) LIMPIEZA DE RUIDO OCR (fuerte)
  // ============================================================
  text = text
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,\-\/]/g, " ") // remueve símbolos
    .replace(/\s+/g, " ");

  // ============================================================
  // 2) LIMPIEZA SUAVE
  // ============================================================
  text = text
    .trim()
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ");

  // ============================================================
  // 3) NORMALIZACIÓN NLP
  // ============================================================
  const normalized = removeAccents(text.toLowerCase());

  // ============================================================
  // 4) EXTRACCIÓN DE INFORMACIÓN CON REGEX
  // ============================================================

  // --- Dosis ---
  let dosis = [];
  let matchDosis;
  while ((matchDosis = PATTERNS.dosis.exec(normalized)) !== null) {
    dosis.push(matchDosis[0]);
  }

  // --- Vía de administración ---
  let vias = [];
  let matchVia;
  while ((matchVia = PATTERNS.via.exec(normalized)) !== null) {
    vias.push(matchVia[0]);
  }

  // ============================================================
  // 5) FUZZY MATCH PARA DETECTAR MEDICAMENTO
  // ============================================================
  const palabras = normalized.split(/\s+/);

  let medicamentoDetectado = null;

  for (const word of palabras) {
    const res = fuse.search(word);
    if (res.length > 0 && res[0].score < 0.35) {
      medicamentoDetectado = res[0].item;
      break;
    }
  }

  // ============================================================
  // 6) OUTPUT FINAL
  // ============================================================
  return {
    original: ocrText,
    limpio: text,
    normalizado: normalized,
    medicamento: medicamentoDetectado ?? "No identificado",
    dosis: dosis.length > 0 ? dosis : null,
    via: vias.length > 0 ? vias : null,
  };
}
