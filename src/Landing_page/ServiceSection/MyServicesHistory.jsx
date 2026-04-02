


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../Gigs/GigSection.css";
import { AuthContext } from "../../context/AuthContext";
import { CountsContext } from "../../context/CountsContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyServicesHistory = () => {

  const { user } = useContext(AuthContext);
  const { decrementService } = useContext(CountsContext);

  const [services, setServices] = useState([]);

  // ================= FETCH MY SERVICES =================
  useEffect(() => {

    const fetchMyServices = async () => {

      try {

        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/my-services",
          { withCredentials: true }
        );

        setServices(res.data);

      } catch (err) {

        console.error("❌ Error fetching my services:", err);

      }

    };

    fetchMyServices();

  }, []);

  // ================= DELETE SERVICE =================
  const handleDelete = (id) => {

    toast(

      ({ closeToast }) => (

        <div>

          <p>⚠️ Are you sure you want to delete this service?</p>

          <button
            style={{
              marginRight: "10px",
              background: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer"
            }}

            onClick={async () => {

              try {

                await axios.delete(
                  "https://taskora-backend-aejx.onrender.com/service/" + id,
                  { withCredentials: true }
                );

                toast.success("✅ Service deleted successfully!");

                setServices((prev) =>
                  prev.filter((s) => s._id !== id)
                );

                decrementService();

              } catch (err) {

                toast.error(
                  err.response?.data?.error ||
                  "Failed to delete service ❌"
                );

              }

              closeToast();

            }}
          >
            Yes
          </button>

          <button
            style={{
              background: "gray",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer"
            }}
            onClick={closeToast}
          >
            Cancel
          </button>

        </div>

      ),

      { autoClose: false }

    );

  };

  return (

    <div className="gig-section">

      <h2>My Posted Services</h2>

      {services.length > 0 ? (

        services.map((service) => (

          <div key={service._id} className="gig-card">

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <p>
              <strong>Salary:</strong> {service.salary}
            </p>

            <p>
              <strong>State:</strong> {service.state}
            </p>

            <p>
              <strong>District:</strong> {service.district}
            </p>

            <p>
              <strong>Taluka:</strong> {service.taluka || "N/A"}
            </p>

            <p>
              <strong>Area / Locality:</strong>{" "}
              {service.location || "N/A"}
            </p>

            <p>
              <strong>Contact:</strong> {service.contact}
            </p>

            <p>
              <strong>Service Start Date:</strong>{" "}
              {new Date(service.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </p>

            {/* COORDINATES */}

            {service.geoLocation &&
              service.geoLocation.coordinates && (

              <p>
                <strong>Coordinates:</strong>{" "}
                {service.geoLocation.coordinates[1]},
                {service.geoLocation.coordinates[0]}
              </p>

            )}

            <p>
              <strong>Posted At:</strong>{" "}
              {new Date(service.createdAt).toLocaleString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </p>

            <Link to={"/edit-service/" + service._id}>
              <button className="edit-btn">
                ✏️ Edit Service
              </button>
            </Link>

            <button
              className="delete-btn"
              onClick={() => handleDelete(service._id)}
            >
              Delete Service
            </button>

            <Link to={"/service/" + service._id + "/applicants"}>
              <button className="btn btn-outline-primary">
                👥 View Applicants
              </button>
            </Link>

          </div>

        ))

      ) : (

        <p className="no-gigs">
          You haven’t posted any services yet.
        </p>

      )}

    </div>

  );

};

export default MyServicesHistory;