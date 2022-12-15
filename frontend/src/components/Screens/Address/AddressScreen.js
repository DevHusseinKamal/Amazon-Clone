import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useForm } from "../../../util/hooks/use-form";
import { useHttp } from "../../../util/hooks/use-http";

import { userActions } from "../../store/user/user-slice";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../util/validators";
import CheckoutSteps from "../../UI/CheckoutSteps/CheckoutSteps";
import MessageBox from "../../UI/MessageBox/MessageBox";
import Input from "../../UI/FormElements/Input";

const AddressScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const { sendRequest, isLoading, error } = useHttp();
  const { formState, inputHandler } = useForm(
    {
      fullName: { value: "", isValid: false },
      address: { value: "", isValid: false },
      city: { value: "", isValid: false },
      postalCode: { value: 0, isValid: false },
      country: { value: "", isValid: false },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      return;
    }

    const userAddress = {
      address: formState.inputs.address.value,
      city: formState.inputs.city.value,
      postalCode: formState.inputs.postalCode.value,
      country: formState.inputs.country.value,
    };
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/shipping`,
        "PATCH",
        JSON.stringify(userAddress),
        { "Content-Type": "application/json", Authorization: "Bearer " + token }
      );
      dispatch(userActions.updateUser(userAddress));

      navigate("/payment");
    } catch (err) {}
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 />
      <div className="container-small m-auto mt-3">
        {!isLoading && error && (
          <MessageBox variant="danger">{error}</MessageBox>
        )}
        <h2 className="my-3">Shipping Address</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Input
              name="fullName"
              type="text"
              label="Full Name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Please enter your full name."
              input={true}
              initialInput={user?.name}
              initialValidity={true}
            />
          </Form.Group>
          <Form.Group>
            <Input
              name="address"
              type="text"
              label="Address"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(10)]}
              errorMessage="Please enter a valid address."
              input={true}
              initialInput={user?.address?.address}
              initialValidity={user?.address?.address ? true : false}
            />
          </Form.Group>
          <Form.Group>
            <Input
              name="city"
              type="text"
              label="City"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Please enter your city."
              input={true}
              initialInput={user?.address?.city}
              initialValidity={user?.address?.city ? true : false}
            />
          </Form.Group>
          <Form.Group>
            <Input
              name="postalCode"
              type="number"
              label="Postal Code"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorMessage="Please enter city postal code."
              input={true}
              initialInput={user?.address?.postalCode}
              initialValidity={user?.address?.postalCode ? true : false}
            />
          </Form.Group>
          <Form.Group>
            <Input
              name="country"
              type="text"
              label="Country"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Please enter your country."
              input={true}
              initialInput={user?.address?.country}
              initialValidity={user?.address?.country ? true : false}
            />
          </Form.Group>
          <div className="mb-3">
            <Button
              variant="primary"
              className="add"
              type="submit"
              disabled={!formState.isValid}>
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddressScreen;
