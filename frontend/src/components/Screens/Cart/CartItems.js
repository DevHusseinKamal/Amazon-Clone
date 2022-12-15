import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Col, ListGroup, Row } from "react-bootstrap";

import { updateCart } from "../../store/user/user-actions";
import { productActions } from "../../store/product/product-slice";
import { userActions } from "../../store/user/user-slice";

import MessageBox from "../../UI/MessageBox/MessageBox";

const CartItems = ({ isCartItemsEmpty, cartItems, isLoading }) => {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");

  const products = useSelector((state) => state.products.products);
  const token = useSelector((state) => state.user.token);

  const addToCartHandler = (prodId) => {
    const product = products.find((p) => p._id === prodId);

    dispatch(updateCart(prodId, true, false, token));

    setProductId(prodId);
    dispatch(userActions.addToCart({ id: prodId, product }));
    dispatch(productActions.updateProductStock({ id: prodId, opt: "+" }));
  };

  const removeFromCart = (prodId, query) => {
    const quantity = cartItems.find((item) => item._id === prodId).quantity;

    dispatch(updateCart(prodId, false, query, token));
    if (query) {
      dispatch(productActions.updateProductStock({ id: prodId, quantity }));
    } else {
      dispatch(productActions.updateProductStock({ id: prodId, opt: "-" }));
    }
    setProductId(prodId);
    dispatch(userActions.removeFromCart({ id: prodId, query }));
  };

  const insertedCart = isCartItemsEmpty ? (
    <MessageBox>
      Your Amazon Cart is empty.
      <Link to="/" className="ms-2">
        Go Shopping
      </Link>
    </MessageBox>
  ) : (
    <ListGroup>
      {cartItems.map((item) => {
        return (
          <ListGroup.Item key={item._id}>
            {isLoading && productId === item._id && (
              <div className="cart-overlay" />
            )}
            <Row className="align-items-center">
              <Col md={4}>
                <img
                  src={`${process.env.REACT_APP_ASSET_URL}/${item.image}`}
                  alt={item.title}
                  className="img-fluid rounded img-thumbnail"
                />{" "}
                <Link to={`/product/${item._id}`}>{item.title}</Link>
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <Button
                  variant="light"
                  onClick={removeFromCart.bind(null, item._id, false)}>
                  <i className="fas fa-minus-circle" />
                </Button>{" "}
                <span className="mx-1">Qty: {item.quantity}</span>
                <Button
                  variant="light"
                  disabled={item.countInStock === 0}
                  onClick={addToCartHandler.bind(null, item._id)}>
                  <i className="fas fa-plus-circle" />
                </Button>
              </Col>
              <Col md={3} className="fw-bold">
                <h5>${item.price}</h5>
              </Col>
              <Col md={2}>
                <Button
                  variant="light"
                  onClick={removeFromCart.bind(null, item._id, true)}
                  style={{ color: "#f00" }}>
                  <i className="fas fa-trash" />
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );

  return (
    <Col md={!isCartItemsEmpty && 8} className="cart-item">
      {insertedCart}
    </Col>
  );
};

export default CartItems;
