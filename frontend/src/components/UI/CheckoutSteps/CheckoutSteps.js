import React from "react";
import { Col, Row } from "react-bootstrap";

import "./CheckoutSteps.css";

const CheckoutSteps = (props) => {
  return (
    <Row className="checkout-steps mx-2">
      <Col className={props.step1 ? "checkout-steps__active" : ""}>
        Shipping
      </Col>
      <Col className={props.step2 ? "checkout-steps__active" : ""}>Payment</Col>
      <Col className={props.step3 ? "checkout-steps__active" : ""}>
        Place Order
      </Col>
    </Row>
  );
};

export default CheckoutSteps;
