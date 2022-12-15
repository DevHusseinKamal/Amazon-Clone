import React from "react";

import PayPalOrder from "./PayPalOrder";

const PayPal = (props) => {
  return (
    <PayPalOrder
      orderId={props.orderId}
      setIsPaidDone={props.setIsPaidDone}
      totalPrice={props.totalPrice}
    />
  );
};

export default PayPal;
