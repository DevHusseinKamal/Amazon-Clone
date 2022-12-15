import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import ProductsList from "../../components/ProductsList/ProductsList";
import BackToTop from "../../components/UI/BackToTop/BackToTop";

const Home = () => {
  const location = useLocation();

  const products = useSelector((state) => state.products.products);
  const userProducts = useSelector((state) => state.products.userProducts);

  const isInHomePage = location.pathname === "/";

  return (
    <Fragment>
      <ProductsList
        products={isInHomePage ? products : userProducts}
        location={location}
      />
      {isInHomePage && products.length !== 0 && <BackToTop />}
    </Fragment>
  );
};

export default Home;
