import React from "react";
import Login from "../components/Login";
import { useAuth } from "../../Provider/AuthProvider";
import { Link } from "react-router-dom";
import Logout from "../components/Logout";

function Navbar() {
  const [authUser, setAuthUser] = useAuth();

  return (
    <>
      <div className="navbar bg-neutral-900 px-5 bg md:px-5 w-full">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-neutral-900 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {authUser ? (
                <>
                <li>
                  <Link to={"/showProfile"} className="text-violet-600">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={"/interview"} className="text-violet-600">
                    Interview
                  </Link>
                </li>
                </>
              ) : null}
            </ul>
          </div>
          <Link to={"/"} className="btn btn-ghost text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500 p-0">CodeEdu</Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {authUser ? (
                <>
                <li>
                  <Link to={"/showProfile"} className="text-violet-600">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={"/interview"} className="text-violet-600">
                    Interview
                  </Link>
                </li>
                </>
              ) : null}
            </ul>
          </div>
          {authUser ? (
            <Logout></Logout>
          ) : (
            <a
              className="btn mx-2 bg-transparent border-black bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 hover:text-white transition-all duration-300"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Login
            </a>
          )}
          <Login></Login>
        </div>
      </div>
    </>
  );
}

export default Navbar;
