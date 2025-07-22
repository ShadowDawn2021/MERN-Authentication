import React, { useContext, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function VerifyEmail() {
  const { backendUrl, userData } = useContext(AppContext);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const handleSendOTP = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-email`,
        { userId: userData._id },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setOtpSent(true); // Show OTP input field
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error sending OTP"
      );
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!OTP) return toast.warn("Please enter the OTP");
    console.log("Sending for verification:", {
      userId: userData._id,
      OTP,
    });
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        {
          userId: userData._id,
          OTP,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Email successfully verified!");
        setOTP(""); // Clear OTP input
        setOtpSent(false); // Hide OTP form if needed
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error verifying OTP"
      );
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="mb-6 text-gray-700">Your email is not yet verified.</p>

        <button
          onClick={handleSendOTP}
          className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition mb-4"
        >
          Verify now
        </button>

        {otpSent && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className="border p-2 rounded text-center"
              maxLength={6}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit OTP
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default VerifyEmail;
