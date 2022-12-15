import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import store from "./components/store/store";
import AmazonProvider from "./components/context/AmazonProvider";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const stripePromise = loadStripe(
  "pk_test_51LWSTxKFMQyOyh3mZXi7ng4w2VWuMZH1woFB8MHqFJBF0TuQBRSH2249rG3QBTuA4BeKlbtrzxysmkNo6qmvXM3n00ukFXo4jH"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AmazonProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </BrowserRouter>
      </HelmetProvider>
    </AmazonProvider>
  </Provider>
);
