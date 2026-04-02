import React, { useState, useContext } from "react";
import "./Login.css";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    toast.dismiss();
    toast.info("Logging in...", { autoClose: 1200 });

    try {
      // 🔑 IMPORTANT:
      // - Use relative URL
      // - Trust login response
      // const res = await axios.post("/login", formData);
      const res = await API.post("https://taskora-backend-aejx.onrender.com/api/auth/login", formData);

      // ✅ Set user directly from login response
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.dismiss();
      toast.success(`Welcome ${res.data.user.username} 🎉`, {
        autoClose: 1500,
        onClose: () => navigate("/"),
      });

      setFormData({ username: "", password: "" });
    } catch (err) {
      toast.dismiss();
      toast.error(
        err.response?.data?.msg || "Invalid username or password ❌",
        { autoClose: 2000 },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin} autoComplete="off">
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          autoComplete="new-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>

        <a href="/signUp">Sign Up</a>
        <br />
        <a href="/forgot-password" className="forgot-link">
          Forgot Password?
        </a>
      </form>
    </div>
  );
};

export default SignIn;
