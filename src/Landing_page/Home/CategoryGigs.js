import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryGigs.css";

const CategoryGigs = () => {
  const { category } = useParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(
          `https://taskora-backend-aejx.onrender.com/api/gigs?category=${encodeURIComponent(category)}`
        );
        setGigs(res.data);
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [category]);

  if (loading) {
    return (
      <div className="gigs-page">
        <p className="no-gigs">Loading gigs...</p>
      </div>
    );
  }

  return (
    <div className="gigs-page">
      <h2 className="gigs-title">{category} Gigs</h2>

      {gigs.length === 0 ? (
        <p className="no-gigs">No gigs found for this category</p>
      ) : (
        <div className="gigs-grid">
          {gigs.map((gig) => (
            <div className="gig-card" key={gig._id}>
              <h3 className="gig-title">{gig.title}</h3>

              <p className="gig-desc">{gig.description}</p>

              <div className="gig-meta">
                <span className="gig-duration">
                  for {gig.date ? "few days" : "short term"}
                </span>

                <span className="gig-location">
                  {gig.location || gig.district}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGigs;
