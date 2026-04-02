import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicationHistory.css";

const ServiceApplicationHistory = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchApplications = async () => {
      try {

        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/my-service-applications",
          { withCredentials: true }
        );

        setApplications(res.data);

      } catch (err) {

        console.error("Error fetching service applications:", err);

      } finally {

        setLoading(false);

      }
    };

    const fetchContracts = async () => {
      try {

        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/api/service-contracts/my",
          { withCredentials: true }
        );

        setMyContracts(res.data);

      } catch (err) {

        console.error("Error fetching service contracts:", err);

      }
    };

    fetchApplications();
    fetchContracts();

  }, []);

  // 🔎 Find contract for service
  const findContractForService = (serviceId) => {

    return myContracts.find((c) => {

      if (!c.service) return false;

      if (typeof c.service === "object" && c.service._id) {
        return c.service._id.toString() === serviceId.toString();
      }

      return c.service.toString() === serviceId.toString();

    });

  };

  // 🗑 Delete history
  const handleDelete = async (appId) => {

    if (!window.confirm("Delete this application?")) return;

    try {

      await axios.delete(
        `https://taskora-backend-aejx.onrender.com/service-application/${appId}`,
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
    return <p className="loading">⏳ Loading your service applications...</p>;
  }

  return (

    <div className="history-container">

      <h2>📌 My Service Application History</h2>

      {applications.length > 0 ? (

        applications.map((app) => {

          const contract = app.service
            ? findContractForService(app.service._id)
            : null;

          return (

            <div key={app._id} className="history-card">

              <h3>{app.service?.title || "Deleted Service"}</h3>

              <p>
                <strong>Description:</strong>{" "}
                {app.service?.description || "—"}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {app.service?.salary || "—"}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {app.service?.state || "—"}
              </p>

              <p>
                <strong>District:</strong>{" "}
                {app.service?.district || "—"}
              </p>

              <p>
                <strong>Taluka:</strong>{" "}
                {app.service?.taluka || "—"}
              </p>

              <p>
                <strong>📍 Location:</strong>{" "}
                {app.service?.location || "—"}
              </p>

              <p>
                <strong>Service Start Date:</strong>{" "}
                {app.service?.date
                  ? new Date(app.service.date)
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

              {/* IMAGE PREVIEW */}
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
                            `https://taskora-backend-aejx.onrender.com/api/service-contracts/${contract._id}/confirm`,
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
                            `https://taskora-backend-aejx.onrender.com/api/service-contracts/${contract._id}/reject`,
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

                      {app.service?.contact && (

                        <p>
                          <strong>📞 Contact:</strong>{" "}
                          {app.service.contact}
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

              {/* DELETE HISTORY */}
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
          ❌ You haven’t applied to any services yet.
        </p>

      )}

    </div>

  );

};

export default ServiceApplicationHistory;