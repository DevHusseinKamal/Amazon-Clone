export const ratingAverage = (product, newRating) =>
  (product.reviews.reduce((acc, cur) => acc + cur.rating, 0) + newRating) /
  (product.numOfReviews + 1);
