import { useContext } from "react";
import Header from "../components/Header";
import { AppContext } from "../context/AppContext";

function Account() {
  const { userData } = useContext(AppContext);
  return (
    <>
      <div>
        <Header />
        <h1>Account</h1>
        <ul>
          <li>
            <strong>Name:</strong> {userData.name}
          </li>
          <li>
            <strong>Email</strong> {userData.email}
          </li>
          <li>
            <strong>Email Verified:</strong>
            {userData.isVerified ? "Yes" : "No"}
          </li>
        </ul>
      </div>
    </>
  );
}

export default Account;
