import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function NavBar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(false);
      setIsLoggedin(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  // Detect clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 top-0 relative">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer"
      />

      {userData ? (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-cyan-500 text-gray-800 font-medium hover:bg-green-500 transition duration-300 shadow-md hover:shadow-lg"
          >
            {userData.name[0].toUpperCase()}
          </button>

          {showDropdown && (
            <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 text-sm border border-gray-200">
              {!userData.isVerified && (
                <li
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/verify-email");
                  }}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/account");
                }}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Account
              </li>
              <li
                onClick={handleLogout}
                className="py-2 px-4 hover:bg-red-100 cursor-pointer text-red-600"
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-full px-6 py-2 bg-cyan-500 text-gray-800 font-medium hover:bg-green-500 transition duration-300 shadow-md hover:shadow-lg"
        >
          Log In
        </button>
      )}
    </div>
  );
}

export default NavBar;
