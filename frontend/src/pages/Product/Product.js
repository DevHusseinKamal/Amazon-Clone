import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import { productActions } from "../../components/store/product/product-slice";
import { userActions } from "../../components/store/user/user-slice";
import { updateCart } from "../../components/store/user/user-actions";
import { fetchProducts } from "../../components/store/product/product-actions";

import ReviewsList from "./ReviewsList";
import Rating from "../../components/UI/Rating/Rating";
import AddReview from "./AddReview";
import LoadingBox from "../../components/UI/LoadingBox/LoadingBox";
import MessageBox from "../../components/UI/MessageBox/MessageBox";

import "./Product.css";

const Product = () => {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const { user, isLoggedIn, token } = useSelector((state) => state.user);
  const { isLoading, error } = useSelector((state) => state.ui);

  const prodId = useParams().prodId;

  useEffect(() => {
    if (product._id !== prodId) {
      dispatch(productActions.resetProduct());
    }
  }, [dispatch, prodId, product._id]);

  useEffect(() => {
    dispatch(
      fetchProducts(
        `${process.env.REACT_APP_BACKEND_URL}/products/${prodId}`,
        true
      )
    );
  }, [dispatch, prodId]);

  const addToCartHandler = (prodId) => {
    dispatch(productActions.updateProductStock({ id: prodId, opt: "+" }));
    dispatch(userActions.addToCart({ id: prodId, product }));

    dispatch(updateCart(prodId, true, false, token));
  };

  const productIsInStock = isLoggedIn && product.countInStock > 0 && (
    <ListGroup.Item>
      <div className="d-grid">
        <Button
          variant="primary"
          onClick={addToCartHandler.bind(null, product._id)}
          disabled={isLoading}>
          Add to Cart
        </Button>
      </div>
    </ListGroup.Item>
  );

  return (
    <Fragment>
      {Object.values(product).length === 0 && isLoading && <LoadingBox />}
      {!isLoading && Object.values(product).length === 0 && error && (
        <MessageBox variant="danger">{error}</MessageBox>
      )}
      {Object.values(product).length > 0 && (
        <Fragment>
          <Row className="mt-3">
            <Col md={6}>
              <img
                className="img-large"
                src={`${process.env.REACT_APP_ASSET_URL}/${product.image}`}
                alt={product.title}
              />
            </Col>
            <Col md={3} className="mb-2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.title}</title>
                  </Helmet>
                  <h1>{product.title}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.totalRating}
                    numReviews={product.numOfReviews}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="fw-bold">Price:</span>{" "}
                  <p className="d-inline mb-0 fs-4">${product.price}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="fw-bold"> Description:</span>{" "}
                  <p>{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} className="mb-2">
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavilable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {productIsInStock}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <ReviewsList reviews={product.reviews} />
          {isLoggedIn && <AddReview prodId={prodId} userName={user.name} />}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Product;
