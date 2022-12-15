import React from "react";
import { Link } from "react-router-dom";

const prices = [
  { title: "$1 to $1000", value: "1-1000" },
  { title: "$1001 to $2000", value: "1001-2000" },
  { title: "$2001 to $3000", value: "2001-3000" },
];

const PriceSection = ({ price, page, filterUrl }) => {
  const insertedPrices = prices.map((p) => {
    return (
      <li key={p.value}>
        <Link
          to={filterUrl({ price: p.value, page: page > 1 ? 1 : page })}
          className={`${price === p.value ? "fw-bold" : ""}`}>
          {p.title}
        </Link>
      </li>
    );
  });

  return (
    <div>
      <h3>Price</h3>
      <ul>
        <li>
          <Link
            to={filterUrl({ price: "all" })}
            className={`${price === "all" ? "fw-bold" : ""}`}>
            Any
          </Link>
        </li>
        {insertedPrices}
      </ul>
    </div>
  );
};

export default PriceSection;
