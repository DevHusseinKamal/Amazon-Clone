import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = (props) => {
  const { user, isLoggedIn } = useSelector((state) => state.user);

  const insertedList = props.categoriesList.map((list) => {
    return (
      <li key={list} onClick={props.onClick}>
        <Link
          to={`search?category=${list}`}
          className="d-block text-decoration-none text-capitalize">
          {list}
        </Link>
      </li>
    );
  });

  return (
    <div className={props.className}>
      <div className="d-flex align-items-center sidebar__header">
        <FaUserCircle />
        <h3>Hello, {isLoggedIn ? user.name : "User"}</h3>
      </div>
      <div className="sidebar__categories">
        <h4>Categories</h4>
        <ul>{insertedList}</ul>
      </div>
    </div>
  );
};

export default Sidebar;
