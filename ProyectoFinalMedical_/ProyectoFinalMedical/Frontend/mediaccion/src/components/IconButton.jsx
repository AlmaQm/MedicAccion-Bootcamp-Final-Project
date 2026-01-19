// src/components/IconButton.jsx
import React from "react";
import '../styles/Progresos.css';

export default function IconButton({ children, onClick }) {
  return (
    <div className="icon-button" onClick={onClick}>
      {children}
    </div>
  );
}
