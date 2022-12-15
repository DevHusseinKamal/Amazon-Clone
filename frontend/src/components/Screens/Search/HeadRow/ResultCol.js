import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const ResultCol = ({ productsCount, category, price, rating }) => {
  const navigate = useNavigate();

  const clearSearchHandler = () => navigate("/search");

  return (
    <Col md={6} sm={12}>
      <div className="d-flex align-items-center search-screen__results">
        {productsCount === 0 ? "No" : productsCount}{" "}
        {productsCount === 1 ? "Result" : "Results"}
        <span className="ms-1 me-2">
          {category !== "all" && " : " + category}
          {price !== "all" && " : " + price}
          {rating !== "all" && " : Rating " + rating + " & up"}
        </span>
        {category !== "all" || rating !== "all" || price !== "all" ? (
          <Button
            variant="secondary"
            className="d-flex align-items-center"
            onClick={clearSearchHandler}>
            <AiOutlineClose />
          </Button>
        ) : null}
      </div>
    </Col>
  );
};

export default ResultCol;
