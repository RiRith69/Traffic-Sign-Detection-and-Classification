import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import "../App.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-2 lg:px-8 text-black shadow  "
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <span className="sr-only">Logo</span>
            <img src={Logo} alt="Logo" className="h-15 w-auto" />
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((index) => !index)}
              className="-m-1 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-6 h-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          {menuOpen && (
            <div className="absolute top-14 right-4 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <div className="text-black">Home</div>
              </NavLink>
              <NavLink
                to="/detectionCenter"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <div className="text-black">DectectionCenter</div>
              </NavLink>
              <NavLink
                to="/features"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <div className="text-black">Features</div>
              </NavLink>
              <NavLink
                to="/signinfo"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <div className="text-black">Sign Information</div>
              </NavLink>
            </div>
          )}

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:gap-x-12">
            <NavLink to="/" className="text-sm font-semibold">
              <div className="text-black">Home</div>
            </NavLink>
            <NavLink to="/detectionCenter" className="text-sm font-semibold">
              <div className="text-black">DetectionCenter</div>
            </NavLink>
            <NavLink to="/features" className="text-sm font-semibold">
              <div className="text-black">Features</div>
            </NavLink>
            <NavLink to="/signinfo" className="text-sm font-semibold">
              <div className="text-black">Sign Information</div>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <NavLink
              to="/detectionCenter"
              className="bg-amber-300 p-2 rounded-md text-sm font-semibold"
            >
              <div className="text-black"> Launch Detection</div>
            </NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
}
