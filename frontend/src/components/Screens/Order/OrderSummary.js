import React from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import PayPal from "../PayPal/PayPal";
import CheckoutStripe from "../Stripe/Stripe";

const OrderSummary = ({ order, orderId, setIsPaidDone }) => {
  const token = useSelector((state) => state.user.token);

  const getInvoiceHandler = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/orders/invoice`, {
      method: "POST",
      body: JSON.stringify({ orderId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.blob())
      .catch((err) => {});
  };

  return (
    <Col md={4}>
      <Card>
        <Card.Body>
          <Card.Title>Order Summary</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${order.itemsPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <strong>Order Total</strong>
                </Col>
                <Col>
                  <strong>${order.totalPrice.toFixed(2)}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              {!order.isPaid && order.paymentMethod === "Stripe" && (
                <CheckoutStripe
                  orderId={orderId}
                  setIsPaidDone={setIsPaidDone}
                />
              )}
              {!order.isPaid && order.paymentMethod === "PayPal" && (
                <PayPal
                  orderId={orderId}
                  setIsPaidDone={setIsPaidDone}
                  totalPrice={order.totalPrice}
                />
              )}
            </ListGroup.Item>
            {order.isPaid && (
              <Button variant="success" onClick={getInvoiceHandler}>
                Download Invoice
              </Button>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default OrderSummary;
