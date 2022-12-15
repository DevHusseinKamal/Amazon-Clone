import React, { Fragment } from "react";
import { Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import ProductItem from "./ProductItem";

import "./ProductsList.css";

const ProductsList = ({ products, location }) => {
  const insertedProducts = products.map((product) => {
    return <ProductItem key={product._id} product={product} />;
  });

  const isInHomePage = location.pathname === "/";

  if (products.length === 0 && !isInHomePage) {
    return <h1 className="text-center">You don't create any Product.</h1>;
  }

  return (
    <Fragment>
      {
        <Helmet>
          <title>
            {isInHomePage
              ? "Amazon.com. Spend less. Smile more."
              : "Admin of Amazon"}
          </title>
        </Helmet>
      }
      {!isInHomePage && <h2 className="products-h2">My Products</h2>}
      <div className={`products-container ${isInHomePage && "products-top"}`}>
        <Row>{insertedProducts}</Row>
      </div>
    </Fragment>
  );
};

export default ProductsList;
