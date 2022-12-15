import { useCallback, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS": {
      return { ...state, isLoading: false };
    }
    case "FETCH_FAIL": {
      return { ...state, isLoading: false, error: action.message };
    }
    case "RESET_ERROR": {
      return { ...state, error: "" };
    }
    default:
      return state;
  }
};

const initState = {
  isLoading: false,
  error: "",
};

export const useHttp = () => {
  const [{ isLoading, error }, dispatch] = useReducer(reducer, initState);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await fetch(url, {
        method,
        body,
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        dispatch({
          type: "FETCH_FAIL",
          message:
            responseData.message || "Something was wrong, please try again.",
        });
        throw new Error(responseData.message);
      }

      dispatch({ type: "FETCH_SUCCESS" });
      return responseData;
    },
    []
  );

  const resetError = () => dispatch({ type: "RESET_ERROR" });

  return {
    sendRequest,
    resetError,
    isLoading,
    error,
  };
};
