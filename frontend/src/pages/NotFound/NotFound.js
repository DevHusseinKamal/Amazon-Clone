import React from "react";

import MessageBox from "../../components/UI/MessageBox/MessageBox";

import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="text-center fs-2 not-found">
      <MessageBox variant="danger">
        Error <span className="ms-1">404</span>, Page not Found!
      </MessageBox>
    </div>
  );
};

export default NotFound;
