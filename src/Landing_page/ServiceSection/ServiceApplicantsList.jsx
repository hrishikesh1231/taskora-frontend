

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ApplicantList.css";

const ServiceApplicantsList = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // ================= FETCH =================
  useEffect(() => {

    const fetchApplicants = async () => {

      try {

        const res = await axios.get(
          `https://taskora-backend-aejx.onrender.com/service/${id}/applicants`,
          { withCredentials: true }
        );

        setApplications(res.data.applications || []);
        setCount(res.data.count || 0);

      } catch (err) {

        toast.error(
          err.response?.data?.error ||
          "Failed to load applicants"
        );

        if ([403,404].includes(err.response?.status)) {
          setTimeout(() => navigate("/my-services"),1200);
        }

      } finally {

        setLoading(false);

      }

    };

    fetchApplicants();

  }, [id,navigate]);

  // ================= UI HELPERS =================

  const toggleExpand = (appId) =>
    setExpanded((prev)=>({...prev,[appId]:!prev[appId]}));

  const openImage = (img)=>setSelectedImage(img);
  const closeImage = ()=>setSelectedImage(null);

  // ================= SELECT =================

  const handleSelect = async (app) => {

    if(!app?._id) return toast.error("Invalid application");

    try{

      await axios.post(
        "https://taskora-backend-aejx.onrender.com/api/contracts/select",
        {
          applicationId: app._id,
          type:"service"
        },
        { withCredentials:true }
      );

      toast.success("Applicant selected 🎉");

      setApplications(prev =>
        prev.map(a =>
          a._id===app._id ? {...a,status:"selected"} : a
        )
      );

    }catch(err){

      toast.error(
        err.response?.data?.error ||
        "Select failed"
      );

    }

  };

  if(loading){

    return(
      <div className="applicants-page">
        <p>Loading applicants…</p>
      </div>
    );

  }

  const alreadySelected =
    applications.some(a=>a.status==="selected");

  return (

    <div className="applicants-page">

      <div className="top-row">

        <h2>Service Applicants ({count})</h2>

        <button
          onClick={()=>navigate(-1)}
          className="back-btn"
        >
          ← Back
        </button>

      </div>

      {applications.length===0 ? (

        <p>No applications yet.</p>

      ):(

        <div className="apps-list">

          {applications.map(app=>{

            const isExpanded = expanded[app._id];

            const applicant = app.applicant;

            const applicantName =
              applicant?.username || "Unknown";

            return(

              <div
                key={app._id}
                className={`app-card ${
                  app.status==="selected"
                  ? "selected-card"
                  : ""
                }`}
              >

                {/* LEFT */}

                <div className="app-left">

                  <Link to={`/profile/${applicant?._id}`}>

                    <div className="app-avatar clickable-avatar">
                      {applicantName.charAt(0).toUpperCase()}
                    </div>

                  </Link>

                </div>

                {/* RIGHT */}

                <div className="app-main">

                  {/* HEADER */}

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
                      {new Date(app.createdAt)
                        .toLocaleString("en-IN")}
                    </span>

                  </div>

                  {/* VISIT PROFILE */}

                  <Link
                    to={`/profile/${applicant?._id}`}
                    className="visit-profile-btn"
                  >
                    Visit Profile →
                  </Link>

                  {/* LOCATION */}

                  <div className="app-location">

                    <p>
                      <strong>State:</strong>{" "}
                      {applicant?.state || "N/A"}
                    </p>

                    <p>
                      <strong>District:</strong>{" "}
                      {applicant?.district || "N/A"}
                    </p>

                  </div>

                  {/* MESSAGE */}

                  <div className="app-message-box">

                    <strong>Message:</strong>

                    <p>{app.message}</p>

                  </div>

                  {/* META */}

                  <div className="app-meta">

                    <p>
                      <strong>Contact:</strong> 🔒Hidden
                    </p>

                    <p>
                      <strong>Charges:</strong> ₹ {app.charges}
                    </p>

                    <p>
                      <strong>Applicant Tokens:</strong>{" "}
                      {applicant?.tokens ?? "N/A"}
                    </p>

                  </div>

                  {/* SELECT BUTTON */}

                  {app.status==="selected" ? (

                    <button
                      className="select-btn selected-btn"
                      disabled
                    >
                      ✅ Selected
                    </button>

                  ):!alreadySelected ? (

                    <button
                      className="select-btn"
                      onClick={()=>handleSelect(app)}
                    >
                      Select
                    </button>

                  ):null}

                  {/* IMAGES */}

                  {app.pictures?.length>0 && (

                    <div className="show-more-container">

                      <button
                        className="show-more-btn"
                        onClick={() =>
                          toggleExpand(app._id)
                        }
                      >
                        {isExpanded
                          ? "Show Less ▲"
                          : "Show More ▼"}
                      </button>

                      {isExpanded && (

                        <div className="app-pictures">

                          {app.pictures.map((p,idx)=>{

                            const imgUrl =
                              p.startsWith("http")
                              ? p
                              : `https://taskora-backend-aejx.onrender.com/uploads/${p}`;

                            return(

                              <img
                                key={idx}
                                src={imgUrl}
                                alt="preview"
                                className="app-thumb"
                                onClick={() =>
                                  openImage(imgUrl)
                                }
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

      {/* IMAGE MODAL */}

      {selectedImage && (

        <div
          className="image-modal"
          onClick={closeImage}
        >

          <span className="close-btn">
            &times;
          </span>

          <img
            src={selectedImage}
            alt="full"
            className="modal-image"
          />

        </div>

      )}

    </div>

  );

};

export default ServiceApplicantsList;