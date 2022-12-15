import { userActions } from "./user-slice";
import { uiActions } from "../ui/ui-slice";

export const fetchCart = (token) => {
  return async (dispatch) => {
    try {
      dispatch(uiActions.setLoading());
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/cart`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      dispatch(userActions.getCart(responseData.cart));
      dispatch(uiActions.removeLoading());
    } catch (err) {
      dispatch(uiActions.setError(err.message));
      dispatch(uiActions.removeLoading());
    }
  };
};

export const updateCart = (prodId, isAdd, query, token) => {
  return async (dispatch) => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/user/${prodId}`;
    let method;
    if (isAdd) {
      method = "POST";
    } else {
      url = `${process.env.REACT_APP_BACKEND_URL}/user/${prodId}/${
        query ? "?directDelete=" + query : ""
      }`;
      method = "DELETE";
    }

    try {
      dispatch(uiActions.setLoading());
      const response = await fetch(url, {
        method: method,
        headers: { Authorization: "Bearer " + token },
      });

      const responseData = await response.json();

      dispatch(uiActions.removeLoading());
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (err) {
      dispatch(uiActions.setError(err.message));
    }
  };
};
