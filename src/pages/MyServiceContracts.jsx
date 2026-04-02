


import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyContracts.css";

const MyServiceContracts = () => {

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Rating States
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // ================= FETCH =================
  const fetchContracts = async () => {

    try {

      const res = await axios.get(
        "https://taskora-backend-aejx.onrender.com/api/contracts/my",
        { withCredentials: true }
      );

      // Only service contracts
      const serviceContracts = res.data.filter(
        (c) => c.service && c.service !== null
      );

      setContracts(serviceContracts);

    } catch (err) {

      console.error("Error fetching contracts:", err.response?.data);

      toast.error("Failed to load contracts");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ================= CONFIRM =================
  const confirmContract = async (id) => {

    try {

      await axios.post(
        `https://taskora-backend-aejx.onrender.com/api/contracts/${id}/confirm`,
        {},
        { withCredentials: true }
      );

      toast.success("Contract confirmed successfully ✅");

      fetchContracts();

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Error confirming contract"
      );

    }

  };

  // ================= REJECT =================
  const rejectContract = async (id) => {

    try {

      await axios.post(
        `https://taskora-backend-aejx.onrender.com/api/contracts/${id}/reject`,
        {},
        { withCredentials: true }
      );

      toast.success("Contract rejected ❌");

      fetchContracts();

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Error rejecting contract"
      );

    }

  };

  // ================= DELETE =================
  const deleteContract = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contract history?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://taskora-backend-aejx.onrender.com/api/contracts/${id}`,
        { withCredentials: true }
      );

      toast.success("Contract history deleted 🗑");

      setContracts((prev) =>
        prev.filter((c) => c._id !== id)
      );

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Failed to delete contract"
      );

    }

  };

  // ================= STATUS =================
  const getStatusClass = (status) => {

    if (status === "both_confirmed") return "status confirmed";
    if (status === "recruiter_confirmed") return "status waiting";
    if (status === "expired") return "status expired";
    if (status === "rejected") return "status rejected";

    return "status pending";

  };

  // ⭐ Rating Modal
  const openRatingModal = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setReview("");
  };

  // ⭐ Submit Review
  const submitReview = async () => {

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {

      await axios.post(
        "https://taskora-backend-aejx.onrender.com/api/reviews",
        {
          contractId: selectedContract._id,
          rating,
          comment: review,
        },
        { withCredentials: true }
      );

      toast.success("Review submitted ⭐");

      closeModal();
      fetchContracts();

    } catch (err) {

      alert(
        err.response?.data?.error ||
        "Failed to submit review"
      );

    }

  };

  return (

    <div className="contracts-container">

      <h2 className="contracts-title">
        My Service Contracts
      </h2>

      {loading ? (

        <p className="loading">Loading contracts...</p>

      ) : contracts.length === 0 ? (

        <p className="no-contracts">
          No service contracts found.
        </p>

      ) : (

        contracts.map((contract) => {

          const service = contract.service;

          const phone = contract.isRecruiter
            ? contract.applicantContact
            : service?.contact;

          const message =
            `Hi, I'm contacting you regarding the service contract for "${service?.title}" on TaskOra.`;

          return (

            <div className="contract-card" key={contract._id}>

              {/* HEADER */}

              <div className="contract-header">

                <h3 className="contract-title">
                  {service?.title || "Service Contract"}
                </h3>

                <span className={getStatusClass(contract.status)}>
                  {contract.status.replace("_", " ")}
                </span>

              </div>

              {/* SERVICE DETAILS */}

              {service && (

                <div className="gig-details">

                  <p>
                    <strong>Description:</strong> {service.description}
                  </p>

                  <p>
                    <strong>Salary:</strong> ₹{service.salary}
                  </p>

                  <p>
                    <strong>State:</strong> {service.state}
                  </p>

                  <p>
                    <strong>District:</strong> {service.district}
                  </p>

                  <p>
                    <strong>Location:</strong> {service.location}
                  </p>

                  <p>
                    <strong>Work Date:</strong>{" "}
                    {new Date(service.date).toLocaleDateString("en-IN")}
                  </p>

                </div>

              )}

              {/* RECRUITER */}

              <div className="recruiter-info">

                <p>
                  <strong>Recruiter:</strong>{" "}
                  {contract.recruiter?.username || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {contract.recruiter?.email || "N/A"}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="contract-actions">

                {contract.status === "recruiter_confirmed" && (

                  <>

                    <button
                      className="confirm-btn"
                      onClick={() => confirmContract(contract._id)}
                    >
                      Confirm Contract
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => rejectContract(contract._id)}
                    >
                      Reject
                    </button>

                  </>

                )}

                {contract.status === "both_confirmed" && (

                  <>

                    <div className="completed-text">
                      ✅ Contract Confirmed
                    </div>

                    {phone && (

                      <a
                        href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-btn"
                      >
                        💬 Chat on WhatsApp
                      </a>

                    )}

                    <button
                      className="rating-btn"
                      onClick={() => openRatingModal(contract)}
                    >
                      ⭐ Give Rating
                    </button>

                  </>

                )}

                {contract.status === "expired" && (

                  <div className="expired-text">
                    ⏳ Contract Expired
                  </div>

                )}

                {contract.status === "rejected" && (

                  <div className="rejected-text">
                    ❌ Contract Rejected
                  </div>

                )}

                <button
                  className="delete-contract-btn"
                  onClick={() => deleteContract(contract._id)}
                >
                  🗑 Delete History
                </button>

              </div>

            </div>

          );

        })

      )}

      {/* ⭐ Rating Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="rating-modal">

            <h3>Give Rating</h3>

            <div className="stars">

              {[1,2,3,4,5].map((star)=>(
                <span
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={()=>setRating(star)}
                >
                  ★
                </span>
              ))}

            </div>

            <textarea
              placeholder="Write your review..."
              value={review}
              onChange={(e)=>setReview(e.target.value)}
            />

            <div className="modal-actions">

              <button onClick={closeModal}>
                Cancel
              </button>

              <button onClick={submitReview}>
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default MyServiceContracts;