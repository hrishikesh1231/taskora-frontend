import React, { useState } from "react";
import "./EditProfile.css";

const EditProfile = ({ user, onUpdate, updating }) => {
  const [form, setForm] = useState({
    name: user.name || user.username || "",   // ✅ FIX
    email: user.email || "",
    state: user.state || "",
    district: user.district || "",
    avatar: null,
  });

  const [preview, setPreview] = useState(user.avatar || "");

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setForm({ ...form, avatar: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">

      {/* Profile Picture */}
      <div className="avatar-section">
        <label className="label">Profile Picture</label>

        <div className="avatar-preview">
          <img
            src={
              preview ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
          />
        </div>

        <input type="file" name="avatar" onChange={handleChange} />
      </div>

      {/* Name */}
      <div className="form-group">
        <label className="label">Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="label">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* State */}
      <div className="form-group">
        <label className="label">State</label>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
        />
      </div>

      {/* District */}
      <div className="form-group">
        <label className="label">District</label>
        <input
          name="district"
          value={form.district}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={updating}>
        {updating ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default EditProfile;