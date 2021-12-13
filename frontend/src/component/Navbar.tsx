import React from "react";
import { Link } from "react-router-dom";
import Wallet from "./Wallet";

const routes = [
  {
    path: "/",
    name: "Checkout",
  },
  {
    path: "/token",
    name: "Token",
  },
];

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-green-400 to-blue-500 p-5 text-white mb-10">
      <div className="container mx-auto flex justify-between items-center ">
        <Link to="/">LOGO</Link>
        <div className="flex items-center gap-10">
          {routes.map((r, i) => (
            <Link key={i} to={r.path}>
              {r.name}
            </Link>
          ))}
          <Wallet />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
