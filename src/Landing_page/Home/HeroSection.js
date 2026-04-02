import React, { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./HeroSection.css";
import AutocompleteInput from "../../Update_pro/AutocompleteInput";

const API_BASE = "https://taskora-backend-aejx.onrender.com";

const fetchLocations = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
    if (!res.ok) throw new Error("Bad response " + res.status);
    return await res.json();
  } catch (err) {
    console.error("Error fetching locations:", err);
    return [];
  }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [cityInput, setCityInput] = useState("");
  const { setCity } = useContext(CityContext);
  const { user } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleSearch = () => {
    const city = cityInput.trim();
    if (!city) return;

    setCity(city);
    setCityInput("");
    navigate(`/gigs/${city}`);
  };

  // ✅ LOGIN CHECK FIRST
  const handlePostClick = (type) => {
    if (!user) {
      toast.error("Login first or Sign up to continue 🔐");
      navigate("/login");
      return;
    }

    setModalType(type);
    setShowModal(true);
  };

  const handleAgree = () => {
    setShowModal(false);

    if (modalType === "gig") {
      navigate("/postGig");
    } else {
      navigate("/postService");
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="left">
          <h1 className="hero-title">
            Discover <span className="blue-text">Daily</span>{" "}
            <span className="green-text">Tasks</span>
          </h1>

          <h5 className="hero-subtitle">
            Hyperlocal task seeker at your service 🚀
          </h5>

          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="icon" />

              <AutocompleteInput
                label=""
                name="city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                fetchSuggestions={fetchLocations}
              />

              <button onClick={handleSearch} className="search-btn">
                Search
              </button>
            </div>
          </div>

          <div className="post-container">
            <div className="post-row">
              <button
                className="post-btn gig-btn"
                onClick={() => handlePostClick("gig")}
              >
                Post Gig
              </button>

              <button
                className="post-btn service-btn"
                onClick={() => handlePostClick("service")}
              >
                Post Service
              </button>
            </div>

            {/* 🤖 AI AUTO POST */}
            <button
              className="post-btn ai-btn"
              onClick={() => {
                if (!user) {
                  toast.error("Login first to use AI posting 🤖");
                  navigate("/login");
                  return;
                }

                navigate("/ai-post");
              }}
            >
              🤖 Auto Post
            </button>
          </div>
        </div>
      </div>

      {/* ✅ PREMIUM MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {modalType === "gig" ? (
              <>
                <h3>🚀 What is a Gig?</h3>
                <p>
                  A <strong>Gig</strong> is a short-term task or quick job,
                  usually completed within a day or two.
                </p>
                <p>
                  <strong>Examples:</strong> Cleaning, Delivery, Repair, Event
                  Help
                </p>
              </>
            ) : (
              <>
                <h3>💼 What is a Service?</h3>
                <p>
                  A <strong>Service</strong> is for long-term or permanent
                  hiring.
                </p>
                <p>
                  <strong>Examples:</strong> Shop Worker, Office Assistant,
                  Delivery Staff
                </p>
              </>
            )}

            <div className="modal-actions">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>

              <button onClick={handleAgree} className="agree-btn">
                Agree & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
