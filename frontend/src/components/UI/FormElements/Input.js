import React, { useEffect, useReducer } from "react";
import { BsExclamation } from "react-icons/bs";

import { validate } from "../../../util/validators";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialInput || "",
    isTouched: false,
    isValid: props.initialValidity || false,
  });

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const blurHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const { name, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(value, isValid, name);
  }, [isValid, onInput, value, name]);

  const hasError = !inputState.isValid && inputState.isTouched;

  return (
    <div className="d-flex flex-column my-3">
      <label htmlFor={props.name} className="mb-2">
        {props.label}
      </label>
      {props.input && (
        <input
          type={props.type}
          id={props.name}
          name={props.name}
          className={`p-2 ${hasError && "input__invalid"}`}
          value={inputState.value}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
      )}
      {!props.input && (
        <textarea
          cols="40"
          id={props.name}
          name={props.name}
          className={`px-2 py-3 ${hasError && "input__invalid"}`}
          value={inputState.value}
          onChange={changeHandler}
          onBlur={blurHandler}></textarea>
      )}
      {!inputState.isValid && inputState.isTouched && (
        <div className="d-flex align-items-center mt-1 invalid">
          <BsExclamation /> {props.errorMessage}
        </div>
      )}
    </div>
  );
};

export default Input;
