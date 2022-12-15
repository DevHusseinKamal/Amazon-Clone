import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./PagenationBtns.css";

const PagenationBtns = ({ pages, page, filterUrl }) => {
  const insertedPagenationBtns = [...Array(pages).keys()].map((p) => {
    return (
      <Link to={filterUrl({ page: p + 1 })} key={p + 1} className="mx-1">
        <Button
          variant="outline-dark"
          className={`${+page === p + 1 ? "active-btn" : ""} mb-3`}>
          {p + 1}
        </Button>
      </Link>
    );
  });

  return <div>{pages > 1 && insertedPagenationBtns}</div>;
};

export default PagenationBtns;
