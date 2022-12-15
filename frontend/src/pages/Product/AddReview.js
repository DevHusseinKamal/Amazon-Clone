import React, { useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../util/hooks/use-http";

import { productActions } from "../../components/store/product/product-slice";
import MessageBox from "../../components/UI/MessageBox/MessageBox";

const AddReview = ({ prodId, userName }) => {
  const token = useSelector((state) => state.user.token);
  const selectRef = useRef();
  const textareaRef = useRef();
  const dispatch = useDispatch();
  const { sendRequest, isLoading, error } = useHttp();

  const submitHandler = async (event) => {
    event.preventDefault();

    const formIsNotValid =
      selectRef.current?.value === "true" ||
      textareaRef.current?.value.length < 6;

    if (formIsNotValid) {
      return;
    }

    const entredRating = +selectRef.current.value;
    const entredcomment = textareaRef.current.value;

    const review = {
      rating: entredRating,
      comment: entredcomment,
    };

    dispatch(
      productActions.updateReviews({
        prodId,
        review: { ...review, userName, createdAt: new Date().toString() },
      })
    );

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/product/${prodId}`,
        "PATCH",
        JSON.stringify(review),
        { Authorization: "Bearer " + token, "Content-Type": "application/json" }
      );
    } catch (err) {}

    selectRef.current.value = true;
    textareaRef.current.value = "";
  };

  return (
    <Row>
      <Col className="mt-4">
        <h2>Write a Customer Review</h2>
        {!isLoading && error && (
          <MessageBox variant="danger">{error}</MessageBox>
        )}
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="form-lable fw-bold mb-2" htmlFor="rating">
              Rating
            </label>
            <select
              aria-label="rating"
              className="form-select"
              id="rating"
              ref={selectRef}>
              <option value>Select...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="mb-3 form-floating">
            <textarea
              cols="30"
              rows="10"
              id="floatingTextarea"
              className="form-control"
              ref={textareaRef}
            />
            <label htmlFor="floatingTextarea">Comments</label>
          </div>
          <div className="mb-3">
            <Button type="submit" className="add" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default AddReview;
