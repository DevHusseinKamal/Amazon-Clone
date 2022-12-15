import React from "react";

const SVGCart = () => {
  return (
    <svg width="50" height="30px">
      <path
        d="M1,3 L10,3 L20,20 L40,20 L47,8"
        stroke="#fff"
        strokeWidth="3"
        fill="transparent"
      />
      <circle r="1" cx="22" cy="27" stroke="#fff" strokeWidth="4" fill="#fff" />
      <circle r="1" cx="38" cy="27" stroke="#fff" strokeWidth="4" fill="#fff" />
    </svg>
  );
};

export default SVGCart;
