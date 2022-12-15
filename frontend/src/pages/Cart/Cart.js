import React from "react";
import { useSelector } from "react-redux";

import CartScreen from "../../components/Screens/Cart/CartScreen";

const Cart = () => {
  const cart = useSelector((state) => state.user.cart);

  return <CartScreen cartItems={cart} />;
};

export default Cart;
