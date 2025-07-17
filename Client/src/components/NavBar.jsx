import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

function NavBar() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  return (
    <div className="w-full  flex justify-between items-center p-4 sm:p-6 sm:px-24 top-0">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32"
      />

      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 rounded-full px-6 py-2 bg-cyan-500 text-gray-800 font-medium hover:bg-green-500 transition duration-300 shadow-md hover:shadow-lg"
      >
        Login
      </button>
      <p>Hey! {userData ? userData.name : ""}</p>
    </div>
  );
}

export default NavBar;
