import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import { userActions } from "../../store/user/user-slice";

import CheckoutSteps from "../../UI/CheckoutSteps/CheckoutSteps";
import MessageBox from "../../UI/MessageBox/MessageBox";

const paymantData = [{ id: "PayPal" }, { id: "Stripe" }];

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const address = useSelector((state) => state.user.user).address;
  const method = useSelector((state) => state.user.method);

  const [paymentMethodName, setPaymentMethodName] = useState(method || "");
  const [error, setError] = useState("");

  useEffect(() => {
    const userAddress = address || {};
    if (Object.values(userAddress).length === 0) {
      navigate("/shipping");
    }
  }, [address, navigate]);

  const changePaymentHandler = (event) => {
    setPaymentMethodName(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!paymentMethodName) {
      setError("Invalid entry, please choose your method.");
      return;
    }

    localStorage.setItem("method", JSON.stringify(paymentMethodName));
    dispatch(userActions.savePaymentMethod(paymentMethodName));
    navigate("/placeorder");
  };

  const insertedScreen = paymantData.map((item) => {
    return (
      <div key={item.id} className="mb-3">
        <Form.Check
          type="radio"
          id={item.id}
          label={item.id}
          value={item.id}
          checked={paymentMethodName === item.id}
          onChange={changePaymentHandler}
        />
      </div>
    );
  });

  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container-small m-auto mt-3">
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <h2 className="my-3">Payment Method</h2>
        <Form onSubmit={submitHandler}>
          {insertedScreen}
          <Button
            variant="primary"
            className="add"
            type="submit"
            disabled={!paymentMethodName}>
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentScreen;
