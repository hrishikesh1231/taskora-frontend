import React, { useState } from "react";
import API from "../api";   // adjust path if needed
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  const res = await API.post(`https://taskora-backend-aejx.onrender.com/api/auth/reset-password/${token}`, { password });

  alert(res.data.message);
  navigate("/login");
} catch (err) {
  alert(err.response?.data?.message || "Something went wrong ❌");
}
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;