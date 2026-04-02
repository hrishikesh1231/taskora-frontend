import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProfile from "./components/EditProfile";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://taskora-backend-aejx.onrender.com/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setUpdating(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("categories", formData.categories);

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const res = await axios.put(
        "https://taskora-backend-aejx.onrender.com/update-profile",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully ✅");
      setUser(res.data.user);

    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="update-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="update-container">
      <h2>Edit Profile</h2>

      <EditProfile
        user={user}
        onUpdate={handleUpdate}
        updating={updating}
      />
    </div>
  );
};

export default UpdateProfile;