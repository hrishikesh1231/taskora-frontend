import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryGigs.css";

const CategoryGigs = () => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigsByCategory = async () => {
      try {
        const res = await axios.get(
          `https://taskora-backend-aejx.onrender.com/api/gigs?category=${decodedCategory}`
        );
        setGigs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigsByCategory();
  }, [decodedCategory]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="category-gigs-page">
      <h2>{decodedCategory} Gigs</h2>

      {gigs.length === 0 ? (
        <p>No gigs found in this category</p>
      ) : (
        gigs.map((gig) => (
          <div key={gig._id} className="gig-card">
            <h4>{gig.title}</h4>
            <p>{gig.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryGigs;
