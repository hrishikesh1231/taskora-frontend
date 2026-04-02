import React, { useEffect, useState } from "react";
import "../Posts/PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const EditGigForm = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: "",
    district: "",
    taluka: "",
    location: "",
    category: "",
    date: "",
    contact: ""
  });

  // ======================
  // LOAD GIG DATA
  // ======================
  useEffect(() => {

    const fetchGig = async () => {
      try {

        const res = await axios.get(`https://taskora-backend-aejx.onrender.com/gig/${id}`);
        const gig = res.data;

        setFormData({
          title: gig.title,
          description: gig.description,
          state: gig.state,
          district: gig.district,
          taluka: gig.taluka,
          location: gig.location,
          category: gig.category,
          date: gig.date.split("T")[0],
          contact: gig.contact
        });

      } catch (err) {
        toast.error("Failed to load gig");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();

  }, [id]);

  // ======================
  // INPUT CHANGE
  // ======================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // ======================
  // UPDATE GIG
  // ======================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      await axios.put(`https://taskora-backend-aejx.onrender.com/gig/${id}`, formData);

      toast.success("Gig updated successfully ✅");

      setTimeout(() => {
        navigate("/my-gigs");
      }, 1500);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Update blocked by AI or server error"
      );

    } finally {
      setSaving(false);
    }

  };

  if (loading) return <p>Loading gig...</p>;

  return (

    <div className="form-container">

      <h2>Edit Gig</h2>

      <form onSubmit={handleSubmit}>

        {/* CATEGORY */}
        <label>Gig Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Event">Event Help</option>
          <option value="Delivery">Delivery</option>
          <option value="Repair">Repair</option>
          <option value="Other">Other</option>
        </select>

        {/* TITLE */}
        <label>Gig Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <label>Gig Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* STATE */}
        <label>Select State</label>
        <select
          name="state"
          value={formData.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              state: e.target.value,
              district: ""
            })
          }
          required
        >
          <option value="">-- Select State --</option>

          {Object.keys(indiaStatesDistricts).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {/* DISTRICT */}
        <label>Select District</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">-- Select District --</option>

          {formData.state &&
            indiaStatesDistricts[formData.state].map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
        </select>

        {/* TALUKA */}
        <label>Taluka</label>
        <input
          type="text"
          name="taluka"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        {/* AREA */}
        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* DATE */}
        <label>Work Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* CONTACT */}
        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Gig"}
        </button>

      </form>

    </div>
  );
};

export default EditGigForm;