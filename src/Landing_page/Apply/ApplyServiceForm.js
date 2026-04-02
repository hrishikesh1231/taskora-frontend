

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ApplyGigForm.css";

const MAX_PHOTOS = 5;

const ApplyServiceForm = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    message: "",
    contact: "",
    charges: "",
    pictures: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pictures") {
      setFormData((prev) => {
        const newFiles = Array.from(files);
        const combined = [...prev.pictures, ...newFiles];

        if (combined.length > MAX_PHOTOS) {
          toast.warn(`⚠️ You can upload a maximum of ${MAX_PHOTOS} photos.`, {
            autoClose: 2000,
          });
          return { ...prev, pictures: combined.slice(0, MAX_PHOTOS) };
        }

        return { ...prev, pictures: combined };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemovePic = (index) => {
    setFormData((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("message", formData.message);
    data.append("contact", formData.contact);
    data.append("charges", formData.charges);

    formData.pictures.forEach((pic) => {
      data.append("pictures", pic);
    });

    try {
      await axios.post(
        `https://taskora-backend-aejx.onrender.com/applyService/${serviceId}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Service Application submitted successfully!", {
        autoClose: 2000,
        onClose: () => navigate(-1),
      });

    } catch (err) {
      console.error("❌ Error applying:", err);

      // 🔥 Only improvement: show backend error message
      const backendMessage =
        err.response?.data?.error || "❌ Failed to apply";

      toast.error(backendMessage, {
        autoClose: 2500,
      });
    }
  };

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h2 className="form-title">Apply for this Service</h2>

        <form onSubmit={handleSubmit} className="apply-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />

          <textarea
            name="message"
            placeholder="Why should you be selected?"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-textarea"
          />

          <input
            type="file"
            name="pictures"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="form-input-file"
          />

          <div className="preview-container">
            {formData.pictures.length > 0 &&
              formData.pictures.map((pic, idx) => (
                <div key={idx} className="preview-wrapper">
                  <img
                    src={URL.createObjectURL(pic)}
                    alt={`preview-${idx}`}
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemovePic(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>

          <input
            type="text"
            name="contact"
            placeholder="Your Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="text"
            name="charges"
            placeholder="Expected Charges (e.g. ₹500/day)"
            value={formData.charges}
            onChange={handleChange}
            required
            className="form-input"
          />

          <button type="submit" className="submit-btn">
            Submit Application
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyServiceForm;