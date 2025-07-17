import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function toggleFormMode() {
    setIsRegister((prev) => !prev);
    setPasswordError("");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords does not match");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2e7d32] via-[#00bcd4] to-[#1e3a8a]">
      <Header />

      <div className="flex flex-1 items-center justify-center px-6 sm:px-0">
        <div className="w-full max-w-sm">
          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
          >
            <img
              src={assets.logo}
              alt="Logo"
              onClick={() => navigate("/")}
              className="w-28 sm:w-32 mx-auto mb-2 cursor-pointer"
            />

            <h2 className="text-xl font-semibold text-center mb-2">
              {isRegister ? "Register" : "Log In"}
            </h2>

            {isRegister && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isRegister && (
              <>
                <input
                  type="password"
                  name="confirm password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);

                    if (password && value !== password) {
                      setPasswordError("Passwords do not match");
                    } else {
                      setPasswordError("");
                    }
                  }}
                  required
                  className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {passwordError && (
                  <p className="text-sm text-red-600 -mt-2">{passwordError}</p>
                )}
              </>
            )}

            {!isRegister && (
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-sm text-cyan-700 hover:underline transition duration-300 text-left"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              disabled={isRegister && passwordError}
              className={`${
                isRegister && passwordError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
              } text-white py-2 rounded-md transition duration-300`}
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
