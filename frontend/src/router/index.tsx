import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Checkout from "../component/Checkout";
import Layout from "../component/Layout";
import Token from "../component/Token";
import Success from "../component/Success";

const routes = [
  {
    path: "/",
    component: <Checkout />,
  },
  {
    path: "/success",
    component: <Success />,
  },
  {
    path: "/token",
    component: <Token />,
  },
  {
    path: "*",
    component: <Checkout />,
  },
];

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((r, i) => (
          <Route key={i} path={r.path} element={r.component} />
        ))}
      </Route>
    </Routes>
  );
}
