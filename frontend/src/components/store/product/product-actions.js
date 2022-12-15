import { uiActions } from "../ui/ui-slice";
import { productActions } from "./product-slice";

export const fetchProducts = (url, single, isAdmin, token) => {
  return async (dispatch) => {
    let headers;
    if (token) {
      headers = { Authorization: token ? "Bearer " + token : null };
    }

    try {
      dispatch(uiActions.setLoading());
      const response = await fetch(url, {
        headers,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      dispatch(uiActions.removeLoading());
      if (single) {
        dispatch(productActions.getProduct(responseData.product));
      } else {
        dispatch(
          productActions.getProducts({
            products: responseData.products,
            isAdmin,
          })
        );
      }
    } catch (err) {
      dispatch(uiActions.removeLoading());
      dispatch(uiActions.setError(err.message));
    }
  };
};

export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      dispatch(uiActions.setLoading());
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/products/categories`
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      dispatch(productActions.getCategories(responseData.categories));
      dispatch(uiActions.removeLoading());
    } catch (err) {
      dispatch(uiActions.removeLoading());
      dispatch(uiActions.setError(err.message));
    }
  };
};
