// frontend/src/pages/ApplyGigForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ toast for popup
import "react-toastify/dist/ReactToastify.css";
import "./ApplyGigForm.css";

const MAX_PHOTOS = 5;

const initialState = {
  name: "",
  message: "",
  contact: "",
  charges: "",
  pictures: [], // File objects
  previews: [], // Object URLs for previews
};

const ApplyGigForm = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  // cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pictures") {
      const newFiles = Array.from(files || []);
      setFormData((prev) => {
        const combinedFiles = [...prev.pictures, ...newFiles].slice(
          0,
          MAX_PHOTOS,
        );

        // create previews for new files
        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        const combinedPreviews = [...prev.previews, ...newPreviews].slice(
          0,
          MAX_PHOTOS,
        );

        if (prev.pictures.length + newFiles.length > MAX_PHOTOS) {
          toast.warn(`⚠️ You can upload a maximum of ${MAX_PHOTOS} photos.`, {
            autoClose: 2000,
          });
        }

        return {
          ...prev,
          pictures: combinedFiles,
          previews: combinedPreviews,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // remove picture by index (and revoke its object URL)
  const handleRemovePic = (index) => {
    setFormData((prev) => {
      const newPics = prev.pictures.filter((_, i) => i !== index);
      const removedUrl = prev.previews[index];
      const newPreviews = prev.previews.filter((_, i) => i !== index);
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      return {
        ...prev,
        pictures: newPics,
        previews: newPreviews,
      };
    });
  };

  // reset form and revoke all preview urls
  const resetForm = (navigateBack = false) => {
    formData.previews.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    setFormData({ ...initialState });
    if (navigateBack) {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("message", formData.message);
    data.append("contact", formData.contact);
    data.append("charges", formData.charges);

    formData.pictures.forEach((pic) => {
      data.append("pictures", pic);
    });

    try {
      await axios.post(`https://taskora-backend-aejx.onrender.com/applyGig/${gigId}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // show success toast and reset form
      toast.success("✅ Application submitted successfully!", {
        autoClose: 2200,
        onClose: () => {
          // navigate(-1); // optional: uncomment if you want to go back after toast
        },
      });

      // Clear inputs & previews immediately
      resetForm(false);
    } catch (err) {
      console.error("❌ Error applying:", err);

      let backendMessage = "Failed to apply";

      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          backendMessage = err.response.data;
        } else if (err.response.data.error) {
          backendMessage = err.response.data.error;
        } else if (err.response.data.message) {
          backendMessage = err.response.data.message;
        }
      }

      console.log("BACKEND ERROR:", backendMessage);

      toast.error(`❌ ${backendMessage}`, {
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h2 className="form-title">Apply for this Gig</h2>
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

          {/* Preview Selected Images with Delete Button */}
          <div className="preview-container">
            {formData.previews.length > 0 &&
              formData.previews.map((url, idx) => (
                <div key={idx} className="preview-wrapper">
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemovePic(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>

          <input
            type="text"
            name="contact"
            placeholder="Your whatsapp Number"
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

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                // revoke created preview urls and go back
                resetForm(true);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyGigForm;

