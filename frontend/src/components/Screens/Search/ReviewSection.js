import React from "react";
import { Link } from "react-router-dom";

import Rating from "../../UI/Rating/Rating";

const ratings = [
  { title: "4 Stars & up", rating: 4 },
  { title: "3 Stars & up", rating: 3 },
  { title: "2 Stars & up", rating: 2 },
  { title: "1 Stars & up", rating: 1 },
];

const ReviewSection = ({ rating, page, filterUrl }) => {
  const insertedReviews = ratings.map((review) => {
    return (
      <li key={review.title}>
        <Link
          to={filterUrl({ rating: review.rating, page: page > 1 ? 1 : page })}
          className={`${+rating === +review.rating ? "fw-bold" : ""}`}>
          <Rating rating={review.rating} caption={" & up"} />
        </Link>
      </li>
    );
  });

  return (
    <div>
      <h3>Avg. Customer Review</h3>
      <ul>
        {insertedReviews}
        <li>
          <Link
            to={filterUrl({ rating: "all" })}
            className={`${rating === "all" ? "fw-bold" : ""}`}>
            <Rating rating={0} caption={" & up"} />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ReviewSection;
