import React from "react";
import { Link } from "react-router-dom";

const DepartmentSection = ({ categoriesList, category, filterUrl }) => {
  const insertedList = categoriesList.map((list) => {
    return (
      <li key={list}>
        <Link
          to={filterUrl({ category: list })}
          className={`${category === list ? "fw-bold" : ""}`}>
          {list}
        </Link>
      </li>
    );
  });

  return (
    <div>
      <h3>Department</h3>
      <ul>
        <li>
          <Link
            to={filterUrl({ category: "all" })}
            className={`${category === "all" ? "fw-bold" : ""}`}>
            Any
          </Link>
        </li>
        {insertedList}
      </ul>
    </div>
  );
};

export default DepartmentSection;
