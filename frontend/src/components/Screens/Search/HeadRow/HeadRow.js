import React from "react";
import { Row } from "react-bootstrap";
import ResultCol from "./ResultCol";
import SortCol from "./SortCol";

const HeadRow = ({
  productsCount,
  category,
  price,
  rating,
  order,
  onChange,
}) => {
  return (
    <Row className="d-flex justify-content-center align-items-center mb-3">
      <ResultCol
        productsCount={productsCount}
        category={category}
        price={price}
        rating={rating}
      />
      <SortCol order={order} onChange={onChange} />
    </Row>
  );
};

export default HeadRow;
