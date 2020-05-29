import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import AppContainer from "./AppContainer";
import App from "./App";
import store from "./store";

// save store to window for debug purposes
if (process.env.NODE_ENV !== "production") {
  window.kaiAppStore = store;
}

const render = (AComponent) => {
  ReactDOM.render(
    <AppContainer store={store} TheApp={AComponent}></AppContainer>,
    document.getElementById("root")
  );
};

render(App);
