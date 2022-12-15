import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Button, Card, Col } from "react-bootstrap";
import { useHttp } from "../../util/hooks/use-http";

import { userActions } from "../store/user/user-slice";
import { productActions } from "../store/product/product-slice";

import { fetchCategories } from "../store/product/product-actions";
import { updateCart } from "../store/user/user-actions";

import Rating from "../UI/Rating/Rating";
import MessageBox from "../UI/MessageBox/MessageBox";

import "./ProductItem.css";

const ProductItem = ({ product }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [productId, setProductId] = useState("");

  const token = useSelector((state) => state.user.token);
  const products = useSelector((state) => state.products.products);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.ui.isLoading);

  const addToCartHandler = (prodId) => {
    const product = products.find((p) => p._id === prodId);

    setProductId(prodId);
    dispatch(productActions.updateProductStock({ id: prodId, opt: "+" }));
    dispatch(userActions.addToCart({ id: prodId, product }));
    dispatch(updateCart(prodId, true, false, token));
  };

  useEffect(() => {
    if (!isLoading) {
      setProductId("");
    }
  }, [productId, isLoading]);

  const { sendRequest, isLoading: httpLoading, error } = useHttp();

  const isInAdminPage = location.pathname === "/admin-product";

  const setAddToCartBtn = isLoggedIn ? (
    <Button
      className="add"
      onClick={addToCartHandler.bind(null, product._id)}
      disabled={
        product.countInStock === 0 || (isLoading && productId === product._id)
      }>
      {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  ) : null;

  const deleteHandler = async () => {
    dispatch(productActions.removeProduct(product._id));
    dispatch(userActions.removeFromCart({ id: product._id, query: true }));
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/${product._id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + token }
      );
      dispatch(fetchCategories());
    } catch (err) {}
  };

  return (
    <Fragment>
      {!httpLoading && error && (
        <MessageBox variant="danger">{error}</MessageBox>
      )}
      <Col
        sm={6}
        md={4}
        lg={3}
        className="mb-3 mx-auto"
        style={{ minWidth: "235px", zIndex: 9 }}>
        <Card>
          {isInAdminPage && (
            <div>
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${product.image}`}
                className="card-img-top"
                alt={product.name}
              />
            </div>
          )}
          {!isInAdminPage && (
            <div>
              <Link to={`/product/${product._id}`}>
                <img
                  src={`${process.env.REACT_APP_ASSET_URL}/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                />
              </Link>
            </div>
          )}
          <Card.Body>
            <Card.Title>{product.title}</Card.Title>
            <Rating
              rating={product.totalRating}
              numReviews={product.numOfReviews}
            />
            <Card.Text>${product.price}</Card.Text>
            {!isInAdminPage ? (
              setAddToCartBtn
            ) : (
              <div className="d-flex justify-content-between">
                <Button variant="outline-primary">
                  <Link to={`/edit-product/${product._id}`}>Edit</Link>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={deleteHandler}
                  disabled={httpLoading}>
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  );
};

export default ProductItem;
