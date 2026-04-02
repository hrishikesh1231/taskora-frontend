import React, { useContext, useState } from "react";
import "./PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { CountsContext } from "../../context/CountsContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostGigForm = () => {

  const { setCity } = useContext(CityContext);
  const { incrementGig } = useContext(CountsContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post("https://taskora-backend-aejx.onrender.com/addGig", formData);

      incrementGig();

      toast.success(res.data?.message || "Gig posted successfully 🎉", {
        autoClose: 2000,
      });

      toast.info("5 tokens deducted 💰", {
        autoClose: 2000,
      });

      setTimeout(() => {

        setCity(formData.district);
        navigate(`/gigs/${formData.district}`);

      }, 2000);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "❌ Harmful content detected. Posting this gig is not allowed."
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="form-container">

      <h2>Post a Gig</h2>

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
          placeholder="Example: Need a cleaner for 2 hours"
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
          onChange={(e) => {
            setFormData({
              ...formData,
              state: e.target.value,
              district: ""
            });
          }}
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
        <label>Enter Taluka</label>
        <input
          type="text"
          name="taluka"
          placeholder="Example: Sawantwadi"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        {/* AREA */}
        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          placeholder="Example: Amboli Road"
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
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        {/* CONTACT */}
        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          placeholder="9876543210"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting Gig..." : "Post Gig"}
        </button>

      </form>

    </div>
  );
};

export default PostGigForm;