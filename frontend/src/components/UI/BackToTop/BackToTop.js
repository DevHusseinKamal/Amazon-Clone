import React from "react";

import "./BackToTop.css";

const BackToTop = () => {
  const toTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className="d-block to-top__btn" onClick={toTopHandler}>
      Back to top
    </button>
  );
};

export default BackToTop;
