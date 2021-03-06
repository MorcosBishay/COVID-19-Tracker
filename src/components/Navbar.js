import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg"
      style={{ padding: "0px 50px" }}
    >
      <Link to="/" className="navbar-brand">
        COVID19 Tracker
      </Link>
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/patient" className="nav-link">
              Add patient
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/map" className="nav-link">
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
