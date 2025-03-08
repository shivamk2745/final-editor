import React, { useState } from "react";
import Login from "./Login";  
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar() {
  // Uncomment this when you're ready to use real authentication
  // const [authUser, setAuthUser] = useAuth();
  const authUser = true; // For testing purposes
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-neutral-900/95 border-b border-neutral-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">
              CodeEDU
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex space-x-4">
              {authUser && (
                <Link to="/showProfile" className="px-3 py-2 rounded-md text-2xl font-medium text-violet-400 hover:text-violet-300 hover:bg-neutral-800 transition-colors duration-200">
                  Profile
                </Link>
              )}
              <Link to="#" className="px-3 py-2 rounded-md text-2xl font-medium text-violet-400 hover:text-violet-300 hover:bg-neutral-800 transition-colors duration-200">
                Item 2
              </Link>
            </div>
            
            {/* Auth Button */}
            <div className="ml-4 flex items-center">
              {authUser ? (
                <Logout />
              ) : (
                <button
                  className="px-5 py-3 rounded-md text-base font-medium bg-gradient-to-r from-cyan-300 to-violet-500 hover:from-cyan-400 hover:to-violet-600 text-neutral-900 hover:text-white transition-colors duration-300"
                  onClick={() => document.getElementById("my_modal_3").showModal()}
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-neutral-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-7 w-7`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-7 w-7`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-neutral-900 border-t border-neutral-800">
          {authUser && (
            <Link
              to="/showProfile"
              className="block px-3 py-2 rounded-md text-lg font-medium text-violet-400 hover:text-white hover:bg-neutral-800"
              onClick={toggleMenu}
            >
              Profile
            </Link>
          )}
          <Link
            to="#"
            className="block px-3 py-2 rounded-md text-lg font-medium text-violet-400 hover:text-white hover:bg-neutral-800"
            onClick={toggleMenu}
          >
            Item 2
          </Link>
          
          {/* Mobile auth button */}
          <div className="pt-4 pb-3">
            {authUser ? (
              <div className="px-3">
                <Logout />
              </div>
            ) : (
              <button
                className="w-full px-4 py-3 rounded-md text-lg font-medium bg-gradient-to-r from-cyan-300 to-violet-500 hover:from-cyan-400 hover:to-violet-600 text-neutral-900 hover:text-white transition-colors duration-300"
                onClick={() => {
                  document.getElementById("my_modal_3").showModal();
                  toggleMenu();
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Import the Login modal component */}
      <Login />
    </nav>
  );
}

export default Navbar;