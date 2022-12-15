import React from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";

const OrderItems = ({ order }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Items</Card.Title>
        <ListGroup variant="flush">
          {order.orderItems.map((item) => {
            return (
              <ListGroup.Item key={item.title} className="order-item">
                <Row className="align-items-center">
                  <Col md={6}>
                    <img
                      src={`${process.env.REACT_APP_ASSET_URL}/${item.image}`}
                      alt={item.title}
                      className="img-fluid rounded img-thumbnail"
                      style={{ maxWidth: "100px" }}
                    />
                  </Col>
                  <Col md={3}>
                    <span>{item.quantity}</span>
                  </Col>
                  <Col md={3}>
                    <span>${item.price}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default OrderItems;
