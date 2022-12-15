import React, { useState } from "react";
import { amazonContext } from "./amazon-context";

const AmazonProvider = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setShowDropdown((prevEvent) => !prevEvent);
  };

  const closeDropdownHandler = (event) => {
    if (showDropdown && !event.target.classList.contains("dropdown-section")) {
      setShowDropdown(false);
    }
  };

  const amazonContextValue = {
    showDropdown,
    toggleDropdownHandler,
    closeDropdownHandler,
  };

  return (
    <amazonContext.Provider value={amazonContextValue}>
      {props.children}
    </amazonContext.Provider>
  );
};

export default AmazonProvider;
