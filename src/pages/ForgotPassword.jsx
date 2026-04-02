import React, { useState } from "react";

import API from "../api";   // adjust path if needed

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  const res = await API.post("https://taskora-backend-aejx.onrender.com/api/auth/forgot-password", { email });
  alert(res.data.message);
} catch (err) {
  alert(err.response?.data?.message || "Something went wrong ❌");
}
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;