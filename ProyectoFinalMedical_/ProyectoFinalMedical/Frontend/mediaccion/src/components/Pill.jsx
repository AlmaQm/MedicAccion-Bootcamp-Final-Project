import React from "react";

const Pill = ({ size = 16 }) => {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#f87171",
      }}
    ></span>
  );
};

export default Pill;