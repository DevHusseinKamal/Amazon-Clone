import React from "react";
import { Col } from "react-bootstrap";
import { useScreen } from "../../../../util/hooks/use-screen";

const SortCol = ({ order, onChange }) => {
  const { screen } = useScreen();

  return (
    <Col md={6} sm={12} className={`${screen < 767 ? "mt-2" : "text-end"}`}>
      Sort By{" "}
      <select value={order} onChange={onChange} className="sort-select">
        <option value="newset">Newset Arrivals</option>
        <option value="lowset">Price: Low to High</option>
        <option value="highset">Price: High to Low</option>
        <option value="toprated">Avg. Customer Reviews</option>
      </select>
    </Col>
  );
};

export default SortCol;
