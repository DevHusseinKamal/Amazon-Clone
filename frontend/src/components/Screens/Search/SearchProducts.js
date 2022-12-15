import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";

import ProductItem from "../../ProductsList/ProductItem";
import MessageBox from "../../UI/MessageBox/MessageBox";

const SearchProducts = ({ products }) => {
  const insertedProducts =
    products.length === 0 ? (
      <MessageBox>No Products Found</MessageBox>
    ) : (
      <Row>
        {products.map((product) => {
          return (
            <Col sm={6} lg={4} key={product._id} className="mb-3">
              <ProductItem product={product} />
            </Col>
          );
        })}
      </Row>
    );

  return <Fragment>{insertedProducts}</Fragment>;
};

export default SearchProducts;
