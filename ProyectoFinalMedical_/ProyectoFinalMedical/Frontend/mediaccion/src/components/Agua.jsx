import React from "react";
import "../styles/Agua.css";

export default function AguaModal({ onClose, children }) {
    return (
        <div className="remedio-overlay" onClick={onClose}>
            <div className="remedio-modal" onClick={(e) => e.stopPropagation()}>
                <button className="remedio-close" onClick={onClose} aria-label="Cerrar">✕</button>

                {children}
            </div>
        </div>
    );}
