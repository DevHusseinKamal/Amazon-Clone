import React from "react";

export const amazonContext = React.createContext({
  showDropdown: false,
  toggleDropdownHandler: () => {},
  closeDropdownHandler: () => {},
});
