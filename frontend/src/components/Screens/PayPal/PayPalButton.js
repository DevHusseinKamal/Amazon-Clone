import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

import PropTypes from "prop-types";

const PayPalButton = ({ onApprove }) => {
  return (
    <PayPalButtons
      style={{ layout: "horizontal" }}
      onApprove={onApprove}
      className="mt-1"
    />
  );
};

PayPalButton.propTypes = {
  onApprove: PropTypes.func.isRequired,
};

export default PayPalButton;
