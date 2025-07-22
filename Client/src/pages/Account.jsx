import { useContext, useState } from "react";
import Header from "../components/Header";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function Account() {
  const { userData, backendUrl } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        backendUrl + "/api/auth/update-profile",
        { name, email },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Profile updated!");
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong: " + err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(userData.name);
    setEmail(userData.email);
  };

  return (
    <>
      <Header />

      <div className="max-w-2xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 border-b pb-2">Account</h1>
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="font-semibold text-gray-700">Name:</label>
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-2 py-1 rounded w-full sm:w-2/3"
              />
            ) : (
              <span>{userData.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="font-semibold text-gray-700">Email:</label>
            {isEditing ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2 py-1 rounded w-full sm:w-2/3"
              />
            ) : (
              <span>{userData.email}</span>
            )}
          </div>

          {/* Email Verified */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email Verified:</span>
            <span
              className={`font-medium ${
                userData.isVerified ? "text-green-600" : "text-red-500"
              }`}
            >
              {userData.isVerified ? "Yes" : "No"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
