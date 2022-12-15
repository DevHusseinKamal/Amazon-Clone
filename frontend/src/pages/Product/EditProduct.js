import React, { Fragment, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "../../util/hooks/use-form";
import { useHttp } from "../../util/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

import {
  fetchCategories,
  fetchProducts,
} from "../../components/store/product/product-actions";
import { fetchCart } from "../../components/store/user/user-actions";

import Input from "../../components/UI/FormElements/Input";
import ImageUpload from "../../components/UI/FormElements/Upload/ImageUpload";
import MessageBox from "../../components/UI/MessageBox/MessageBox";
import {
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";

import "./EditProduct.css";

const EditProduct = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);

  const { sendRequest, isLoading, error } = useHttp();
  const { formState, inputHandler, setFormData } = useForm({
    title: {
      value: "",
      isValid: false,
    },
    category: {
      value: "",
      isValid: false,
    },
    brand: {
      value: "",
      isValid: false,
    },
    price: {
      value: 0,
      isValid: false,
    },
    countInStock: {
      value: 0,
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
  });

  const isInCreatePage = location.pathname === "/create-product";
  const prodId = !isInCreatePage && params.prodId;

  useEffect(() => {
    if (!isInCreatePage) {
      setFormData(
        {
          price: { value: 0, isValid: false },
          countInStock: { value: 0, isValid: false },
        },
        false
      );
    }
  }, [isInCreatePage, setFormData]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isInCreatePage) {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("brand", formState.inputs.brand.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("countInStock", formState.inputs.countInStock.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);

      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products`,
          "POST",
          formData,
          { Authorization: "Bearer " + token }
        );

        dispatch(fetchCart(token));
        dispatch(
          fetchProducts(`${process.env.REACT_APP_BACKEND_URL}/products`)
        );
        dispatch(
          fetchProducts(
            `${process.env.REACT_APP_BACKEND_URL}/products/user`,
            false,
            true,
            token
          )
        );
        dispatch(fetchCategories());

        navigate("/");
      } catch (err) {}
    } else {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products/${prodId}`,
          "PATCH",
          JSON.stringify({
            price: formState.inputs.price.value,
            countInStock: formState.inputs.countInStock.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          }
        );

        dispatch(fetchCart(token));
        dispatch(
          fetchProducts(`${process.env.REACT_APP_BACKEND_URL}/products`)
        );
        dispatch(
          fetchProducts(
            `${process.env.REACT_APP_BACKEND_URL}/products/user`,
            false,
            true,
            token
          )
        );

        navigate("/");
      } catch (err) {}
    }
  };

  return (
    <Fragment>
      {
        <Helmet>
          <title>
            {location.pathname === "/create-product"
              ? "Create Product"
              : "Edit Product"}
          </title>
        </Helmet>
      }
      <Container className="edit-product container-small my-3">
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <Form onSubmit={submitHandler}>
          {isInCreatePage && (
            <Row>
              <Col md={6} sm={12}>
                <Input
                  onInput={inputHandler}
                  name="title"
                  type="text"
                  label="Title"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorMessage="Title in required."
                  input={true}
                />
              </Col>
              <Col md={6} sm={12}>
                <Input
                  onInput={inputHandler}
                  name="category"
                  type="text"
                  label="Category"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorMessage="Category in required."
                  input={true}
                />
              </Col>
            </Row>
          )}
          <Row>
            {isInCreatePage && (
              <Col md={4} sm={12}>
                <Input
                  onInput={inputHandler}
                  name="brand"
                  type="text"
                  label="Brand"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorMessage="Brand in required."
                  input={true}
                />
              </Col>
            )}
            <Col md={!isInCreatePage ? 6 : 4} sm={6} xs={6}>
              <Input
                onInput={inputHandler}
                name="price"
                type="number"
                label="Price"
                validators={[VALIDATOR_MIN(10)]}
                errorMessage="At least $10."
                input={true}
              />
            </Col>
            <Col md={!isInCreatePage ? 6 : 4} sm={6} xs={6}>
              <Input
                onInput={inputHandler}
                name="countInStock"
                type="number"
                label="Count In Stock"
                validators={[VALIDATOR_MIN(1)]}
                errorMessage="Counts in required."
                input={true}
              />
            </Col>
          </Row>
          {isInCreatePage && (
            <Fragment>
              <Row md={12}>
                <Col>
                  <Input
                    onInput={inputHandler}
                    name="description"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorMessage="Description in required."
                    input={false}
                  />
                </Col>
              </Row>
              <Row>
                <ImageUpload
                  name="image"
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorMessage="Please upload product image."
                />
              </Row>
            </Fragment>
          )}
          <hr />
          <div className="text-center">
            <Button
              type="submit"
              className="edit-product__submit-button px-4 py-2 mb-2"
              disabled={!formState.isValid || isLoading}>
              {isInCreatePage ? "Create Product" : "Edit Product"}
            </Button>
          </div>
        </Form>
      </Container>
    </Fragment>
  );
};

export default EditProduct;
