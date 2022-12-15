import React, { useEffect, useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

import "./Rating.css";

const Rating = ({ rating, numReviews, caption }) => {
  const [insertedRating, setInsertedRating] = useState([]);

  useEffect(() => {
    setInsertedRating([]);
    for (let i = 1; i <= 5; i++) {
      setInsertedRating((prevRating) => {
        return [
          ...prevRating,
          <span key={i}>
            {rating >= i ? (
              <BsStarFill />
            ) : rating >= i - 0.5 ? (
              <BsStarHalf />
            ) : (
              <BsStar />
            )}
          </span>,
        ];
      });
    }
  }, [rating]);

  return (
    <div className="rating d-flex">
      {insertedRating}
      {numReviews !== undefined && (
        <span className="review ms-2">
          {numReviews} {numReviews === 1 ? "review" : "reviews"}
        </span>
      )}
      {caption && <span className="ms-2">{caption}</span>}
    </div>
  );
};

export default Rating;
