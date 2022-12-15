import React, { useEffect, Suspense, Fragment, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import {
  fetchCategories,
  fetchProducts,
} from "./components/store/product/product-actions";
import { fetchCart } from "./components/store/user/user-actions";
import { userActions } from "./components/store/user/user-slice";
import { amazonContext } from "./components/context/amazon-context";

import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import LoadingBox from "./components/UI/LoadingBox/LoadingBox";

const Cart = React.lazy(() => import("./pages/Cart/Cart"));
const Home = React.lazy(() => import("./pages/Home/Home"));
const Signup = React.lazy(() => import("./pages/Signup/Signup"));
const AddressScreen = React.lazy(() =>
  import("./components/Screens/Address/AddressScreen")
);
const PaymentScreen = React.lazy(() =>
  import("./components/Screens/Payment/PaymentScreen")
);
const PlaceOrderScreen = React.lazy(() =>
  import("./components/Screens/PlaceOrder/PlaceOrderScreen")
);
const OrderScreen = React.lazy(() =>
  import("./components/Screens/Order/OrderScreen")
);
const OrderHistoryScreen = React.lazy(() =>
  import("./pages/OrderHistory/OrderHistoryScreen")
);
const SearchScreen = React.lazy(() =>
  import("./components/Screens/Search/SearchScreen")
);
const Product = React.lazy(() => import("./pages/Product/Product"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));
const EditProduct = React.lazy(() => import("./pages/Product/EditProduct"));

let logoutTimer;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeDropdownHandler } = useContext(amazonContext);
  const { token, tokenExpirationDate, isLoggedIn } = useSelector(
    (state) => state.user
  );
  const { categories } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(`${process.env.REACT_APP_BACKEND_URL}/products`));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData?.token && new Date(storedData?.expiration) > new Date()) {
      dispatch(fetchCart(storedData.token));
      dispatch(
        fetchProducts(
          `${process.env.REACT_APP_BACKEND_URL}/products/user`,
          false,
          true,
          storedData.token
        )
      );
      dispatch(
        userActions.login({
          user: storedData.user,
          token: storedData.token,
          tokenExpirationDate: new Date(storedData.expiration),
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const reminingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        navigate("/signup", { replace: true });
        dispatch(userActions.clearCart());
        dispatch(userActions.logout());
      }, reminingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [dispatch, navigate, token, tokenExpirationDate]);

  const isInHomePage = location.pathname === "/";

  let routes;
  if (isLoggedIn) {
    routes = (
      <Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/admin-product" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<AddressScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:orderId" element={<OrderScreen />} />
        <Route path="/orders-history" element={<OrderHistoryScreen />} />
        <Route
          path="/search"
          element={<SearchScreen categoriesList={categories} />}
        />
        <Route path="/product/:prodId" element={<Product />} />
        <Route path="/create-product" element={<EditProduct />} />
        <Route path="/edit-product/:prodId" element={<EditProduct />} />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:prodId" element={<Product />} />
        <Route
          path="/search"
          element={<SearchScreen categoriesList={categories} />}
        />
      </Fragment>
    );
  }

  return (
    <div onClick={closeDropdownHandler}>
      <Navbar categoriesList={categories} />
      <main>
        {isInHomePage && <Header />}
        <Container fluid>
          <Suspense fallback={<LoadingBox />}>
            <Routes>
              {routes}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
    </div>
  );
};

export default App;
