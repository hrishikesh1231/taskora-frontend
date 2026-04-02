import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ServiceForm.css";

const EditServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD SERVICE =================
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`https://taskora-backend-aejx.onrender.com/service/${id}`, {
          withCredentials: true,
        });

        setFormData({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          category: res.data.category,
          date: res.data.date.split("T")[0],
          contact: res.data.contact,
        });
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SAVE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`https://taskora-backend-aejx.onrender.com/service/${id}`, formData, {
        withCredentials: true,
      });

      toast.success("✅ Service updated successfully");
      navigate("/my-services");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update service ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading service...</p>;
  if (!formData) return <p>Service not found ❌</p>;

  return (
    <div className="form-container">
      <h2>Edit Service</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Event">Event</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Teaching">Teaching</option>
          <option value="Technical">Technical</option>
          <option value="Service">Service</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditServiceForm;
