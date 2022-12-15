import React, { Fragment, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { MdMenu } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

import logo from "../../assets/Amazon_Logo.png";
import SVGCart from "../../assets/SVG-Cart";
import SideDrawer from "../UI/Sidebar/SideDrawer";
import Dropdown from "./Dropdown";

import "./Navbar.css";
import { amazonContext } from "../context/amazon-context";

const Navbar = ({ categoriesList }) => {
  const location = useLocation();
  const { showDropdown, toggleDropdownHandler } = useContext(amazonContext);

  const [isSideDrawerShow, setIsSideDrawerShow] = useState(false);

  const cartItems = useSelector((state) => state.user.cart);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);

  let quantities;
  if (cartItems.length > 0) {
    quantities = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);
  } else {
    quantities = 0;
  }

  const showSideDrawerHandler = () => {
    document.body.style.overflowY = "hidden";
    setIsSideDrawerShow(true);
  };

  const closeSideDrawerHandler = () => {
    document.body.style.overflowY = "initial";
    setIsSideDrawerShow(false);
  };

  return (
    <Fragment>
      <SideDrawer
        show={isSideDrawerShow}
        onClose={closeSideDrawerHandler}
        categoriesList={categoriesList}
      />
      <nav className="navbar__nav">
        <ul className={`${location.pathname === "/" ? "home-page" : ""}`}>
          <li>
            <MdMenu
              className="navbar-menu__link"
              onClick={showSideDrawerHandler}
            />
            <Link to="/">
              <img src={logo} alt="Amazon Logo" />
            </Link>
          </li>
          <li>
            <input type="text" />
            <AiOutlineSearch />
          </li>
          <li>
            {!isLoggedIn && (
              <Link to="signup" className="navbar-signup__link">
                Signup
              </Link>
            )}
            {isLoggedIn && (
              <button
                className="d-flex align-items-evenly flex-column navbar-button__dropdown dropdown-section"
                onClick={toggleDropdownHandler}>
                <small className="dropdown-section">Hello</small>
                <h6 className="dropdown-section">
                  {user.name} <IoMdArrowDropdown className="dropdown-section" />
                </h6>
              </button>
            )}
            {isLoggedIn && (
              <Link to="cart" className="navbar-cart__link">
                <SVGCart />
                Cart
                <span className="d-block text-center">{quantities}</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
      {showDropdown && <Dropdown onClose={toggleDropdownHandler} />}
    </Fragment>
  );
};

export default Navbar;
