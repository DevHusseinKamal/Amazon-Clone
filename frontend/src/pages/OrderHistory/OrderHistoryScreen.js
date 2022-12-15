import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useHttp } from "../../util/hooks/use-http";

import { dateConverter } from "../../util/date-converter";
import LoadingBox from "../../components/UI/LoadingBox/LoadingBox";
import MessageBox from "../../components/UI/MessageBox/MessageBox";

const tableData = [
  { id: "2", title: "DATE" },
  { id: "3", title: "TOTAL" },
  { id: "4", title: "PAID" },
  { id: "5", title: "DELIVERED" },
  { id: "6", title: "ACTIONS" },
];

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.user.token);
  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const { orders } = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/orders`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );

        setOrders(orders);
      } catch (err) {}
    };

    getOrder();
  }, [sendRequest, token]);

  const insertedTable = tableData.map((data) => {
    return <th key={data.id}>{data.title}</th>;
  });

  let insertedOrders = orders.map((order) => {
    return (
      <tr key={order._id} className="order-table">
        <td>{dateConverter(order.createdAt).slice(0, 10)}</td>
        <td>${order.totalPrice.toFixed(2)}</td>
        <td>
          {order.isPaid ? dateConverter(order.paidAt).slice(0, 10) : "No"}
        </td>
        <td>{order.isDelivered ? dateConverter(order.delivededAt) : "No"}</td>
        <td>
          <Button type="button" variant="light">
            <Link
              to={`/order/${order._id}`}
              className="d-block p-2 text-decoration-none">
              Details
            </Link>
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      {isLoading && !error && <LoadingBox />}
      {!isLoading && error && <MessageBox variant="danger">{error}</MessageBox>}
      {!isLoading && !error && orders.length === 0 && (
        <h2 className="text-center">You did not buy from Amazon yet.</h2>
      )}
      {!isLoading && !error && orders.length > 0 && (
        <Fragment>
          <h2>Order History</h2>
          <table className="table">
            <thead>
              <tr>{insertedTable}</tr>
            </thead>
            <tbody>{insertedOrders}</tbody>
          </table>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderHistoryScreen;
