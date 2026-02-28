import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/NavBar/logo.png";
import "../App.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // For active link highlighting

  const hoverEffect = { scale: 1.05, transition: { duration: 0.2 } };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/detectionCenter", label: "DetectionCenter" },
    { path: "/features", label: "Features" },
    { path: "/signinfo", label: "Sign Information" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 shadow z-50">
      <header className="absolute inset-x-0 top-0 bg-white">
        <nav
          className="flex items-center justify-between p-2 lg:px-8 text-black shadow"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <span className="sr-only">Logo</span>
            <img src={Logo} alt="Logo" className="h-20 w-auto" />
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((index) => !index)}
              className="-m-1 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 bg-white shadow"
            >
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

          {/* Mobile menu */}
          {menuOpen && (
            <div className="absolute top-14 right-4 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={hoverEffect}
                  className={`block px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer ${
                    location.pathname === item.path ? "bg-amber-300" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <NavLink to={item.path}>
                    <div className="text-black">{item.label}</div>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          )}

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={hoverEffect}
                className={`text-sm font-semibold px-3 py-2 cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-amber-300 rounded-md"
                    : ""
                }`}
              >
                <NavLink to={item.path}>
                  <div className="text-black">{item.label}</div>
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <motion.div
              whileHover={{
                scale: 1.05,
                backgroundColor: "#fcd34d",
                transition: { duration: 0.2 },
              }}
              className="rounded-md"
            >
              <NavLink
                to="/detectionCenter"
                className="bg-amber-300 p-2 rounded-md text-sm font-semibold inline-block"
              >
                <div className="text-black"> Launch Detection</div>
              </NavLink>
            </motion.div>
          </div>
        </nav>
      </header>
    </div>
  );
}
