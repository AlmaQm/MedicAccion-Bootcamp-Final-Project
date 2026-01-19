import React from "react";
import "../styles/Remedio.css";

export default function RemedioModal({ onClose, children }) {
    return (
        <div className="remedio-overlay">
            <div className="remedio-modal">
                <button className="remedio-close" onClick={onClose}>
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
