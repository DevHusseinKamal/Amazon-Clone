import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHttp } from "../../../util/hooks/use-http";

import { dateConverter } from "../../../util/date-converter";
import LoadingBox from "../../UI/LoadingBox/LoadingBox";
import MessageBox from "../../UI/MessageBox/MessageBox";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";

const OrderScreen = () => {
  const orderId = useParams().orderId;

  const [order, setOrder] = useState({});
  const [isPaidDone, setIsPaidDone] = useState(false);

  const token = useSelector((state) => state.user.token);

  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        if (isPaidDone) {
          const order = {
            ...responseData.order,
            isPaid: true,
            paidAt: new Date(),
          };
          setOrder(order);
          setIsPaidDone(false);
          return;
        }
        setOrder(responseData.order);
      } catch (err) {}
    };

    getOrder();
  }, [isPaidDone, orderId, sendRequest, token]);

  const deliveredAt = dateConverter(order.deliveredAt);
  const paidAt = dateConverter(order.paidAt);

  return (
    <Fragment>
      {isLoading && !error && <LoadingBox />}
      {!isLoading && error && <MessageBox variant="danger">{error}</MessageBox>}
      {!isLoading && !error && Object.values(order).length !== 0 && (
        <div>
          <Helmet>
            <title>Your Order</title>
          </Helmet>
          <h2 className="my-3">Your Order</h2>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name: </strong>
                    {order.shippingAddress.name} <br />
                    <strong>Address: </strong>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </Card.Text>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </Card.Text>
                  {order.isPaid ? (
                    <MessageBox variant="success">Paid at {paidAt}</MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
                </Card.Body>
              </Card>
              <OrderItems order={order} />
            </Col>
            <OrderSummary
              order={order}
              orderId={orderId}
              setIsPaidDone={setIsPaidDone}
            />
          </Row>
        </div>
      )}
    </Fragment>
  );
};

export default OrderScreen;
