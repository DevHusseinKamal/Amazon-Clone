import React from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const PlaceOrderCart = ({ cart }) => {
  const insertedCart = cart.map((item) => {
    return (
      <ListGroup.Item key={item._id} className="order-item">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${item.image}`}
              alt={item.title}
              className="img-fluid rounded img-thumbnail"
              style={{ maxWidth: "100px" }}
            />{" "}
            <Link to={`/product/${item._id}`}>{item.title}</Link>
          </Col>
          <Col md={3}>
            <span>{item.quantity}</span>
          </Col>
          <Col md={3}>${item.price}</Col>
        </Row>
      </ListGroup.Item>
    );
  });

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Items</Card.Title>
        <ListGroup variant="flush">{insertedCart}</ListGroup>
        <Link to="/cart">Edit</Link>
      </Card.Body>
    </Card>
  );
};

export default PlaceOrderCart;
