import React from "react";

export default function ProgressBar({ porcentaje }) {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.barra, width: `${porcentaje}%` }}></div>
      <span style={styles.texto}>{porcentaje}%</span>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "20px",
    backgroundColor: "#e0e0e0",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    marginTop: "5px",
  },
  barra: {
    height: "100%",
    backgroundColor: "#4caf50",
    transition: "width 0.3s ease",
  },
  texto: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    textAlign: "center",
    lineHeight: "20px",
    fontWeight: "bold",
    color: "#000",
  },
};
