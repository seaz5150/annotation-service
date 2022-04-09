import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@popperjs/core";
import "bootstrap";
import moment from "moment";
import { Provider } from "react-redux";
import { store } from "./state/Store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
