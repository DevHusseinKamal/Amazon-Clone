import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingBox = () => {
  return <Spinner animation="border" role="status" className="d-flex m-auto mt-2" />;
};

export default LoadingBox;
