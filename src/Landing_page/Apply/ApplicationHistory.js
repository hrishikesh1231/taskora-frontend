import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicationHistory.css";

const ApplicationHistory = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/my-applications",
          { withCredentials: true }
        );

        // ✅ FILTER OUT DELETED GIGS HERE
        const filteredApps = res.data.filter(app => app.gig);
        setApplications(filteredApps);

      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchContracts = async () => {
      try {
        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/api/contracts/my",
          { withCredentials: true }
        );
        setMyContracts(res.data);
      } catch (err) {
        console.error("Error fetching contracts:", err);
      }
    };

    fetchApplications();
    fetchContracts();

  }, []);

  // Find contract for gig
  const findContractForGig = (gigId) => {

    return myContracts.find((c) => {

      if (!c.gig) return false;

      if (typeof c.gig === "object" && c.gig._id) {
        return c.gig._id.toString() === gigId.toString();
      }

      return c.gig.toString() === gigId.toString();

    });

  };

  // Delete application
  const handleDelete = async (appId) => {

    if (!window.confirm("Delete this application?")) return;

    try {

      await axios.delete(
        `https://taskora-backend-aejx.onrender.com/application/${appId}`,
        { withCredentials: true }
      );

      setApplications((prev) =>
        prev.filter((a) => a._id !== appId)
      );

      alert("Application deleted");

    } catch (err) {

      alert(
        err.response?.data?.error ||
        "Delete failed"
      );

    }

  };

  if (loading) {
    return <p className="loading">⏳ Loading your applications...</p>;
  }

  return (

    <div className="history-container">

      <h2>📌 My Application History</h2>

      {applications.length > 0 ? (

        applications.map((app) => {

          const contract = app.gig
            ? findContractForGig(app.gig._id)
            : null;

          return (

            <div key={app._id} className="history-card">

              <h3>{app.gig?.title}</h3>

              <p>
                <strong>Description:</strong>{" "}
                {app.gig?.description}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {app.gig?.category}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {app.gig?.state}
              </p>

              <p>
                <strong>District:</strong>{" "}
                {app.gig?.district}
              </p>

              <p>
                <strong>Taluka:</strong>{" "}
                {app.gig?.taluka}
              </p>

              <p>
                <strong>📍 Location:</strong>{" "}
                {app.gig?.location}
              </p>

              <p>
                <strong>Gig Date:</strong>{" "}
                {app.gig?.date
                  ? new Date(app.gig.date)
                      .toLocaleDateString("en-IN")
                  : "—"}
              </p>

              <p>
                <strong>Your Message:</strong>{" "}
                {app.message || "—"}
              </p>

              <p>
                <strong>Your Charges:</strong>{" "}
                ₹{app.charges || "—"}
              </p>

              {/* Image preview */}
              {app.pictures &&
                app.pictures.length > 0 && (

                <div className="preview-container">

                  {app.pictures.map((pic, idx) => (

                    <img
                      key={idx}
                      src={pic}
                      alt="upload"
                      className="preview-img"
                    />

                  ))}

                </div>

              )}

              <p className="applied-date">

                Applied on{" "}

                {new Date(app.createdAt)
                  .toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}

              </p>

              {/* CONTRACT SECTION */}
              {contract && (

                <div className="contract-section">

                  <p>
                    <strong>Selection Status:</strong>{" "}
                    {contract.status}
                  </p>

                  {!contract.applicantConfirmed &&
                    contract.status !== "rejected" && (

                    <div className="contract-buttons">

                      <button
                        className="confirm-btn"
                        onClick={async () => {

                          await axios.post(
                            `https://taskora-backend-aejx.onrender.com/api/contracts/${contract._id}/confirm`,
                            {},
                            { withCredentials: true }
                          );

                          window.location.reload();

                        }}
                      >
                        ✅ Confirm
                      </button>

                      <button
                        className="reject-btn"
                        onClick={async () => {

                          await axios.post(
                            `https://taskora-backend-aejx.onrender.com/api/contracts/${contract._id}/reject`,
                            {},
                            { withCredentials: true }
                          );

                          window.location.reload();

                        }}
                      >
                        ❌ Reject
                      </button>

                    </div>

                  )}

                  {contract.applicantConfirmed && (

                    <div>

                      <p style={{ color: "green" }}>
                        ✔ You confirmed
                      </p>

                      {app.gig?.contact && (
                        <p>
                          <strong>📞 Contact:</strong>{" "}
                          {app.gig.contact}
                        </p>
                      )}

                      <button
                        className="visit-contract-btn"
                        onClick={() =>
                          navigate("/my-contracts")
                        }
                      >
                        🔍 View Contract
                      </button>

                    </div>

                  )}

                  {contract.status === "rejected" && (
                    <p style={{ color: "red" }}>
                      ❌ You rejected this contract
                    </p>
                  )}

                </div>

              )}

              <button
                className="delete-history-btn"
                onClick={() => handleDelete(app._id)}
              >
                🗑 Delete History
              </button>

            </div>

          );

        })

      ) : (

        <p className="no-history">
          ❌ You haven’t applied to any gigs yet.
        </p>

      )}

    </div>

  );

};

export default ApplicationHistory;