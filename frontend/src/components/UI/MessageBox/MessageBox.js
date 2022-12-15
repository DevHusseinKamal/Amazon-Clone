import React from "react";
import { Alert } from "react-bootstrap";

import "./MessageBox.css";

const MessageBox = (props) => {
  return (
    <Alert
      variant={props.variant || "info"}
      className="d-flex justify-content-center align-items-center text-center message-box"
      style={{ marginTop: "5px" }}>
      {props.children}
    </Alert>
  );
};

export default MessageBox;
