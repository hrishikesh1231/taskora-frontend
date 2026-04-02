import React, { useEffect, useState, useContext } from "react";
import "./EditProfile.css";
import axios from "axios";
import { toast } from "react-toastify";
import defaultAvatar from "./olly.jpg";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://taskora-backend-aejx.onrender.com";

const EditProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    state: "",
    district: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [preview, setPreview] = useState(defaultAvatar);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/current-user`, {
          withCredentials: true,
        });

        const user = res.data.user;

        setFormData({
          username: user.username || "",
          email: user.email || "",
          state: user.state || "",
          district: user.district || "",
        });

        setOriginalEmail(user.email || "");

        if (user.avatar) {
          setPreview(user.avatar);
        }
      } catch (err) {
        toast.error("❌ Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setEmailChanged(value !== originalEmail);
    }
  };

  // ================= VERIFY EMAIL =================
  const handleVerifyEmail = async () => {
    if (!formData.email) {
      toast.error("Enter email first");
      return;
    }

    try {
      setSendingOtp(true);

      await axios.post(
        `${API_BASE}/send-update-email-otp`,
        { email: formData.email },
        { withCredentials: true }
      );

      toast.success("📩 OTP sent");

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          type: "update-email",
        },
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    try {
      if (emailChanged) {
        toast.warning("⚠️ Please verify email first");
        return;
      }

      const res = await axios.put(
        `${API_BASE}/update-profile`,
        {
          username: formData.username,
          state: formData.state,
          district: formData.district,
        },
        { withCredentials: true }
      );

      if (res.data.logout) {
        toast.info("🔐 Username changed, login again");
        navigate("/login");
        return;
      }

      await refreshUser();
      toast.success("✅ Profile updated");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Edit Profile</h2>

      {/* Profile Image */}
      <div className="profile-pic-container">
        <img src={preview} alt="profile" className="profile-pic" />
      </div>

      {/* Username */}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <div className="email-row">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {emailChanged && (
            <button
              className="verify-btn"
              onClick={handleVerifyEmail}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending..." : "Verify"}
            </button>
          )}
        </div>
      </div>

      {/* State */}
      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
      </div>

      {/* District */}
      <div className="form-group">
        <label>District</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
