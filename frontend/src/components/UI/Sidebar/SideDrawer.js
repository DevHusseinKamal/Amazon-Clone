import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Sidebar from "./Sidebar";

import "./SideDrawer.css";

export const Overlay = (props) => {
  return <div className="backdrop" onClick={props.onClick}></div>;
};

const SideDrawer = (props) => {
  const content = (
    <Fragment>
      {props.show && <Overlay onClick={props.onClose} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={300}
        classNames="side-drawer">
        <Sidebar
          className="side-drawer"
          onClick={props.onClose}
          categoriesList={props.categoriesList}
        />
      </CSSTransition>
    </Fragment>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

export default SideDrawer;
