import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import CartItems from "./CartItems";

import "./CartScreen.css";

const CartScreen = ({ cartItems }) => {
  const isLoading = useSelector((state) => state.ui.isLoading);

  const isCartItemsEmpty = cartItems.length === 0;

  const insertedPrices = (
    <h3>
      Subtotal ({cartItems.reduce((acc, cur) => acc + cur.quantity, 0)} Items) :
      ${cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)}
    </h3>
  );

  return (
    <div className="cart">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h2>Shopping Cart</h2>
      <Row>
        <CartItems
          isCartItemsEmpty={isCartItemsEmpty}
          cartItems={cartItems}
          isLoading={isLoading}
        />
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>{insertedPrices}</ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      disabled={isCartItemsEmpty}
                      className="proceed-btn">
                      <Link to="/shipping" className="d-block px-1 py-2">
                        Proceed to Checkout
                      </Link>
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
