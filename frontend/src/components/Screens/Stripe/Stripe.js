import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useHttp } from "../../../util/hooks/use-http";
import { Form } from "react-bootstrap";

import MessageBox from "../../UI/MessageBox/MessageBox";
import LoadingBox from "../../UI/LoadingBox/LoadingBox";

import "./Stripe.css";

const CardField = ({ onChange }) => (
  <div className="mt-1">
    <CardElement onChange={onChange} />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className="submit-button mt-1 py-2"
    type="submit"
    disabled={processing || disabled}>
    {processing ? "Processing..." : children}
  </button>
);

const ErrorMessage = ({ children }) => (
  <div className="error-message" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const CheckoutStripe = ({ orderId, setIsPaidDone }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const token = useSelector((state) => state.user.token);

  const { sendRequest, error: httpError, isLoading } = useHttp();

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement("card").focus();
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
      return;
    }
    setIsPaidDone(true);

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/keys/stripe/${orderId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {}
  };

  return (
    <Form onSubmit={submitHandler}>
      {isLoading && !httpError && <LoadingBox />}
      {!isLoading && httpError && (
        <MessageBox variant="danger">{httpError}</MessageBox>
      )}
      <CardField
        onChange={(e) => {
          setError(e.error);
          setCardComplete(e.complete);
        }}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <SubmitButton processing={processing} error={error} disabled={!stripe}>
        Pay by Stripe
      </SubmitButton>
    </Form>
  );
};

export default CheckoutStripe;
