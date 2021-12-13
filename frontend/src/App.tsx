import React from "react";
import { BrowserRouter } from "react-router-dom";
import Checkout from "./component/Checkout";
import Success from "./component/Success";
import Router from "./router";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
