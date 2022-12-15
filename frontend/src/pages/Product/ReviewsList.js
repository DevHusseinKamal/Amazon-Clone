import React from "react";
import { Col, ListGroup, Row } from "react-bootstrap";

import { dateConverter } from "../../util/date-converter";
import Rating from "../../components/UI/Rating/Rating";

const ReviewsList = ({ reviews }) => {
  const review =
    reviews && reviews.length > 0
      ? reviews.map((review) => {
          return (
            <ListGroup.Item key={Math.random().toString()}>
              <strong>{review.userName}</strong>
              <Rating rating={review.rating} />
              <p>{dateConverter(review.createdAt)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          );
        })
      : null;

  return (
    <Row>
      <Col className="my-5">
        <ListGroup>{review}</ListGroup>
      </Col>
    </Row>
  );
};

export default ReviewsList;
