import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useHttp } from "../../../util/hooks/use-http";

import PayPalButton from "./PayPalButton";
import LoadingBox from "../../UI/LoadingBox/LoadingBox";
import MessageBox from "../../UI/MessageBox/MessageBox";

const PayPalOrder = (props) => {
  const token = useSelector((state) => state.user.token);
  const { sendRequest, isLoading, error } = useHttp();

  const initialOptionsOrder = {
    "client-id": "test",
    currency: "USD",
    intent: "capture",
  };

  const onApproveOrderHandler = async (data, actions) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/keys/paypal/${props.orderId}`,
        "GET",
        null,
        { Authorization: "Bearer " + token }
      );

      props.setIsPaidDone(true);
    } catch (err) {}
  };

  return (
    <Fragment>
      {isLoading && !error && <LoadingBox />}
      {!isLoading && error && <MessageBox variant="danger">{error}</MessageBox>}
      <PayPalScriptProvider options={initialOptionsOrder}>
        <PayPalButton onApprove={onApproveOrderHandler} />
      </PayPalScriptProvider>
    </Fragment>
  );
};

export default PayPalOrder;
