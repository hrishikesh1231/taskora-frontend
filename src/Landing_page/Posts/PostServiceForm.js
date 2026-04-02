import React, { useContext, useState } from "react";
import "./PostServiceForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { CountsContext } from "../../context/CountsContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostServiceForm = () => {

  const { setCity } = useContext(CityContext);
  const { incrementService } = useContext(CountsContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    state: "",
    district: "",
    taluka: "",
    location: "",
    date: "",
    contact: ""
  });

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post("https://taskora-backend-aejx.onrender.com/addService", formData, {
        withCredentials: true
      });

      incrementService();

      toast.success(res.data?.message || "Service posted successfully 🎉");

      toast.info("3 tokens deducted 💰");

      setTimeout(() => {

        setCity(formData.district);
        navigate(`/services/${formData.district}`);

      }, 2000);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "❌ Harmful content detected. Posting this service is not allowed."
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="service-form-container">

      <h2>Post a Service</h2>

      <form onSubmit={handleSubmit}>

        <label>Service Title</label>
        <input
          type="text"
          name="title"
          placeholder="Example: Need shop helper"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Salary / Pay</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
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

        <label>Taluka</label>
        <input
          type="text"
          name="taluka"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <label>Start Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting Service..." : "Post Service"}
        </button>

      </form>

    </div>

  );

};

export default PostServiceForm;