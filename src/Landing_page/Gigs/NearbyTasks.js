import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./GigSection.css";

import { AuthContext } from "../../context/AuthContext";

const NearbyTasks = () => {

  const [gigsData, setGigsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {

        const res = await axios.get(
          `https://taskora-backend-aejx.onrender.com/api/gigs/nearby?lat=${lat}&lng=${lng}`
        );

        const sortedGigs = res.data.sort(
          (a, b) => a.distance - b.distance
        );

        setGigsData(sortedGigs);

      } catch (err) {

        console.error("Error fetching nearby gigs:", err);
        setGigsData([]);

      }

      setLoading(false);

    });

  }, []);

  const handleApplyClick = (gig) => {
    navigate(`/applyGig/${gig._id}`);
  };

  return (

    <div className="gig-section">

      <h2>📍 Nearby Tasks</h2>

      {loading && <p>Finding nearby tasks...</p>}

      {!loading && gigsData.length === 0 && (
        <p className="no-gigs">No nearby tasks found</p>
      )}

      {gigsData.map((gig) => {

        const isOwner =
          user &&
          gig.postedBy &&
          String(gig.postedBy._id) === String(user._id);

        return (

          <div key={gig._id} className="gig-card">

            <h3 className="gig-title">
              {gig.title}
            </h3>

            <p className="gig-description">
              {gig.description}
            </p>

            <div className="gig-details">

              <p>
                📏 <strong>Distance:</strong>{" "}
                {(gig.distance / 1000).toFixed(2)} km
              </p>

              <p>
                🛠 <strong>Work Start Date:</strong>{" "}
                {new Date(gig.date).toLocaleDateString("en-IN")}
              </p>

              <p>
                🕒 <strong>Posted On:</strong>{" "}
                {new Date(gig.createdAt).toLocaleDateString("en-IN")}
              </p>

              <p>
                🌍 <strong>State:</strong> {gig.state}
              </p>

              <p>
                📍 <strong>District:</strong> {gig.district}
              </p>

              <p>
                🏘 <strong>Taluka:</strong> {gig.taluka || "N/A"}
              </p>

              <p>
                👤 <strong>Posted By:</strong>{" "}
                <i>@{gig.postedBy?.username || "User"}</i>
              </p>

              <div className="gig-info">

                <p>🔒 Contact number visible after applying</p>

                <p>💬 WhatsApp chat available after applying</p>

                <p>📍 Exact location visible after applying</p>

                <p>🗺 Maps location available after applying</p>

              </div>

            </div>

            {user ? (

              !isOwner && (
                <button
                  className="apply-button"
                  onClick={() => handleApplyClick(gig)}
                >
                  Apply Now
                </button>
              )

            ) : (

              <button
                className="apply-button"
                onClick={() => navigate("/login")}
              >
                Login to Apply
              </button>

            )}

          </div>

        );

      })}

    </div>

  );

};

export default NearbyTasks;