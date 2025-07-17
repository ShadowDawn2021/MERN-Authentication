import React, { useState } from "react";
import { assets } from "../assets/assets";
import Header from "../components/Header";

function Login() {
  const [isRegister, setIsRegister] = useState(true);

  function handleLogin(e) {
    e.preventDefault(); // Prevent page refresh
    // Add login/register logic here
  }

  function toggleFormMode() {
    setIsRegister((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2e7d32] via-[#00bcd4] to-[#1e3a8a]">
      <Header />

      <div className="flex flex-1 items-center justify-center px-6 sm:px-0">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
          >
            <img
              src={assets.logo}
              alt="Logo"
              className="w-28 sm:w-32 mx-auto mb-2"
            />

            <h2 className="text-xl font-semibold text-center mb-2">
              {isRegister ? "Register" : "Log In"}
            </h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition duration-300"
            >
              {isRegister ? "Register" : "Log In"}
            </button>

            <button
              type="button"
              onClick={toggleFormMode}
              className="text-sm text-cyan-700 hover:underline transition duration-300"
            >
              {isRegister
                ? "Already have an account? Log In"
                : "Create an account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
