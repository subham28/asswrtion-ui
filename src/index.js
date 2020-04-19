import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import GenreatePassword from "./components/GenreatePassword";
//import App from "./App";
import HomePage from "./components/HomePage";
import * as serviceWorker from "./serviceWorker";

const Routing = (
  <Router>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route path="/generate" component={GenreatePassword} />
    </div>
  </Router>
);
ReactDOM.render(
  Routing,
  // <React.StrictMode>
  //   <Routing />
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
