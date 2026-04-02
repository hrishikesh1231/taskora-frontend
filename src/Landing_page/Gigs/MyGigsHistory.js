
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CountsContext } from "../../context/CountsContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./MyGigsHistory.css";
const MyGigsHistory = () => {

  const { user } = useContext(AuthContext);
  const { decrementGig } = useContext(CountsContext);

  const [gigs, setGigs] = useState([]);

  // FETCH MY GIGS
  useEffect(() => {

    const fetchMyGigs = async () => {
      try {

        const res = await axios.get(
          "https://taskora-backend-aejx.onrender.com/my-gigs",
          { withCredentials: true }
        );

        setGigs(res.data);

      } catch (err) {
        console.error("❌ Error fetching my gigs:", err);
      }
    };

    fetchMyGigs();

  }, []);

  // DELETE GIG
  const handleDelete = (id) => {

    toast(
      ({ closeToast }) => (
        <div>

          <p>⚠️ Are you sure you want to delete this gig?</p>

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
                  "https://taskora-backend-aejx.onrender.com/gig/" + id,
                  { withCredentials: true }
                );

                toast.success("✅ Gig deleted successfully!");

                setGigs((prev) =>
                  prev.filter((g) => g._id !== id)
                );

                decrementGig();

              } catch (err) {

                toast.error(
                  err.response?.data?.error ||
                  "Failed to delete gig ❌"
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

      <h2>My Posted Tasks</h2>

      {gigs.length > 0 ? (

        gigs.map((gig) => (

          <div key={gig._id} className="gig-card">

            <h3>{gig.title}</h3>

            <p>{gig.description}</p>

            <p>
              <strong>Category:</strong> {gig.category}
            </p>

            <p>
              <strong>State:</strong> {gig.state}
            </p>

            <p>
              <strong>District:</strong> {gig.district}
            </p>

            <p>
              <strong>Taluka:</strong> {gig.taluka || "N/A"}
            </p>

            <p>
              <strong>Area / Locality:</strong> {gig.location || "N/A"}
            </p>

            <p>
              <strong>Contact:</strong> {gig.contact}
            </p>

            <p>
              <strong>Work Date:</strong>{" "}
              {new Date(gig.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </p>

            {gig.coordinates && gig.coordinates.coordinates && (
              <p>
                <strong>Coordinates:</strong>{" "}
                {gig.coordinates.coordinates[1]},
                {gig.coordinates.coordinates[0]}
              </p>
            )}

            <p>
              <strong>Posted At:</strong>{" "}
              {new Date(gig.createdAt).toLocaleString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </p>

            <Link to={"/edit-gig/" + gig._id}>
              <button className="edit-btn">
                ✏️ Edit Post
              </button>
            </Link>

            <button
              className="delete-btn"
              onClick={() => handleDelete(gig._id)}
            >
              Delete
            </button>

            <Link to={"/gig/" + gig._id + "/applicants"}>
              <button className="btn btn-outline-primary">
                👥 View Applicants
              </button>
            </Link>

          </div>

        ))

      ) : (

        <p className="no-gigs">
          You haven’t posted any tasks yet.
        </p>

      )}

    </div>

  );

};

export default MyGigsHistory;