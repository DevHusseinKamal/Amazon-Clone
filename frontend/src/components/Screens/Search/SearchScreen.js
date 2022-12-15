import React, { Fragment, useEffect, useReducer } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useHttp } from "../../../util/hooks/use-http";

import LoadingBox from "../../UI/LoadingBox/LoadingBox";
import MessageBox from "../../UI/MessageBox/MessageBox";
import DepartmentSection from "./DepartmentSection";
import PriceSection from "./PriceSection";
import ReviewSection from "./ReviewSection";
import PagenationBtns from "./PagenationBtns";
import SearchProducts from "./SearchProducts";
import HeadRow from "./HeadRow/HeadRow";

import "./SearchScreen.css";

const searchReducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS": {
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        productsCount: action.payload.productsCount,
      };
    }
    default:
      return state;
  }
};

const SearchScreen = ({ categoriesList }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(searchReducer, {
    products: [],
    page: 1,
    pages: 2,
    productsCount: 0,
  });

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newset";
  let page = +sp.get("page") || 1;
  if (category !== "all") {
    page = 1;
  }

  const changeHandler = (event) => {
    if (page > 1) {
      page = 1;
    }
    navigate(filterUrl({ order: event.target.value }));
  };

  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products/search?page=${page}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );

        dispatch({ type: "SUCCESS", payload: responseData });
      } catch (err) {}
    };

    fetchProducts();
  }, [category, order, page, price, rating, sendRequest]);

  const filterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const filterOrder = filter.order || order;
    let filterPage = filter.page || page;
    if (filterCategory !== "all") {
      filterPage = 1;
    }

    return `/search?page=${filterPage}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`;
  };

  return (
    <div className="search-screen">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <DepartmentSection
            categoriesList={categoriesList}
            category={category}
            filterUrl={filterUrl}
          />
          <PriceSection price={price} filterUrl={filterUrl} page={page} />
          <ReviewSection rating={rating} filterUrl={filterUrl} page={page} />
        </Col>
        <Col md={9}>
          {isLoading && !error && <LoadingBox />}
          {!isLoading && error && (
            <MessageBox variant="danger">{error}</MessageBox>
          )}
          {!isLoading && !error && (
            <Fragment>
              <HeadRow
                productsCount={state.productsCount}
                category={category}
                price={price}
                rating={rating}
                order={order}
                onChange={changeHandler}
              />
              <SearchProducts products={state.products} />
              {state.products.length !== 0 && (
                <PagenationBtns
                  pages={state.pages}
                  page={page}
                  filterUrl={filterUrl}
                />
              )}
            </Fragment>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchScreen;
