import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useHttp } from "../../../util/hooks/use-http";

import { userActions } from "../../store/user/user-slice";
import CheckoutSteps from "../../UI/CheckoutSteps/CheckoutSteps";
import PlaceOrderCart from "./PlaceOrderCart";
import MessageBox from "../../UI/MessageBox/MessageBox";
import LoadingBox from "../../UI/LoadingBox/LoadingBox";

import "./PlaceOrderScreen.css";

const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, cart, method, token } = useSelector((state) => state.user);
  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const userAddress = user?.address || {};
    if (Object.values(userAddress).length === 0 || !method) {
      navigate("/shipping");
    }
  }, [method, navigate, user?.address]);

  const cartPrices = round2(
    cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  );

  const shippingPrice = cartPrices > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * cartPrices);

  const totalPrice = cartPrices + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    const orderItems = cart.map((item) => {
      return {
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
      };
    });
    const postalCode = +user.address.postalCode;
    const shippingAddress = {
      ...user.address,
      name: user.name,
      postalCode: postalCode,
    };
    const order = {
      orderItems,
      shippingAddress,
      paymentMethod: method,
      itemsPrice: cartPrices,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
    };
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/orders`,
        "POST",
        JSON.stringify(order),
        { "Content-Type": "application/json", Authorization: "Bearer " + token }
      );

      dispatch(userActions.clearCart());
      navigate(`/order/${responseData.order._id}`);
    } catch (err) {}
  };

  return (
    <div>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <h2 className="my-3">Preview Order</h2>
      <Row>
        {!isLoading && error && (
          <MessageBox variant="danger">{error}</MessageBox>
        )}
        {!error && Object.values(user).length !== 0 && (
          <Fragment>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name: </strong> {user.name} <br />
                    <strong>Address: </strong> {user.address.address},{" "}
                    {user.address.city}, {user.address.postalCode},{" "}
                    {user.address.country}
                  </Card.Text>
                  <Link to="/shipping">Edit</Link>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method: </strong>
                    {method} <br />
                  </Card.Text>
                  <Link to="/payment">Edit</Link>
                </Card.Body>
              </Card>
              <PlaceOrderCart cart={cart} />
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${cartPrices.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Order Total</strong>
                        </Col>
                        <Col>
                          <strong>${totalPrice.toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          className="add mb-2"
                          onClick={placeOrderHandler}
                          disabled={cart.length === 0 || isLoading}>
                          Place Order
                        </Button>
                      </div>
                      {isLoading && <LoadingBox />}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
