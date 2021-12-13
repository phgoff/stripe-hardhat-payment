import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="cotainer max-w-md mx-auto mt-5 rounded-lg overflow-hidden shadow-2xl">
        <Outlet />
      </div>
    </>
  );
}
