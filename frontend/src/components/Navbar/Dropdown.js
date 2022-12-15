import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { userActions } from "../store/user/user-slice";

import "./Dropdown.css";

let incId = 0;

const navData = [
  { path: "/orders-history", title: "Order History" },
  { path: "/create-product", title: "Create Product" },
  { path: "/admin-product", title: "Your Products" },
];

const Dropdown = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(userActions.logout());
    navigate("/signup", { replace: true });
  };

  const insertedNavLinks = navData.map((link) => {
    incId++;
    return (
      <li key={incId} onClick={props.onClose}>
        <Link to={link.path}>{link.title}</Link>
      </li>
    );
  });

  return (
    <div className="dropdown">
      <ul>
        {insertedNavLinks}
        <hr />
        <li onClick={props.onClose}>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
