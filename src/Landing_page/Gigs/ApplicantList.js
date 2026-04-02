

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ApplicantList.css";

const ApplicantsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [selectingId, setSelectingId] = useState(null);

  const fetchApplicants = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://taskora-backend-aejx.onrender.com/gig/${id}/applicants`,
        { withCredentials: true }
      );

      setApplications(res.data.applications || []);
      setCount(res.data.count || 0);
      setHasActiveContract(!!res.data.hasActiveContract);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load applicants");
      if ([403, 404].includes(err.response?.status)) {
        setTimeout(() => navigate("/my-gigs"), 1200);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const toggleExpand = (appId) =>
    setExpanded((prev) => ({ ...prev, [appId]: !prev[appId] }));

  const openImage = (img) => setSelectedImage(img);
  const closeImage = () => setSelectedImage(null);

  const handleSelect = async (app) => {
    if (!app?._id) {
      toast.error("Invalid application");
      return;
    }

    try {
      setSelectingId(app._id);

      await axios.post(
        "https://taskora-backend-aejx.onrender.com/api/contracts/select",
        { applicationId: app._id, type: "gig" },
        { withCredentials: true }
      );

      toast.success("Applicant selected 🎉");
      await fetchApplicants();
    } catch (err) {
      toast.error(err.response?.data?.error || "Select failed");
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="applicants-page">
        <p>Loading applicants…</p>
      </div>
    );
  }

  return (
    <div className="applicants-page">
      <div className="top-row">
        <h2>Applicants ({count})</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="apps-list">
          {applications.map((app) => {
            const isExpanded = expanded[app._id];
            const applicant = app.applicant;
            const applicantName = applicant?.username || "Unknown";
            const isSelected = app.status === "selected";
            const isRejected = app.status === "rejected";
            const disableSelect =
              hasActiveContract || selectingId === app._id || isRejected;

            return (
              <div
                key={app._id}
                className={`app-card ${isSelected ? "selected-card" : ""}`}
              >
                <div className="app-left">
                  <Link to={`/profile/${applicant?._id}`}>
                    <div className="app-avatar clickable-avatar">
                      {applicantName.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                </div>

                <div className="app-main">
                  <div className="app-header">
                    <div className="header-left">
                      <Link
                        to={`/profile/${applicant?._id}`}
                        className="applicant-name-link"
                      >
                        {applicantName}
                      </Link>
                    </div>

                    <span className="applied-date">
                      {new Date(app.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    to={`/profile/${applicant?._id}`}
                    className="visit-profile-btn"
                  >
                    Visit Profile →
                  </Link>

                  <div className="app-location">
                    <p>
                      <strong>State:</strong> {applicant?.state || "N/A"}
                    </p>
                    <p>
                      <strong>District:</strong> {applicant?.district || "N/A"}
                    </p>
                  </div>

                  <div className="app-message-box">
                    <strong>Message:</strong>
                    <p>{app.message}</p>
                  </div>

                  <div className="app-meta">
                    <p><strong>Contact:</strong> 🔒Hidden</p>
                    <p><strong>Charges:</strong> ₹ {app.charges}</p>
                    <p>
                      <strong>Applicant Tokens:</strong> {applicant?.tokens ?? "N/A"}
                    </p>
                  </div>

                  {isSelected ? (
                    <button className="select-btn selected-btn" disabled>
                      ✅ Selected
                    </button>
                  ) : isRejected ? (
                    <button className="select-btn rejected-btn" disabled>
                      Rejected
                    </button>
                  ) : (
                    <button
                      className="select-btn"
                      onClick={() => handleSelect(app)}
                      disabled={disableSelect}
                    >
                      {selectingId === app._id ? "Selecting..." : "Select"}
                    </button>
                  )}

                  {app.pictures?.length > 0 && (
                    <div className="show-more-container">
                      <button
                        className="show-more-btn"
                        onClick={() => toggleExpand(app._id)}
                      >
                        {isExpanded ? "Show Less ▲" : "Show More ▼"}
                      </button>

                      {isExpanded && (
                        <div className="app-pictures">
                          {app.pictures.map((p, idx) => {
                            const imgUrl = p.startsWith("http")
                              ? p
                              : `https://taskora-backend-aejx.onrender.com/uploads/${p}`;
                            return (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt="preview"
                                className="app-thumb"
                                onClick={() => openImage(imgUrl)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <span className="close-btn">&times;</span>
          <img src={selectedImage} alt="full" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;