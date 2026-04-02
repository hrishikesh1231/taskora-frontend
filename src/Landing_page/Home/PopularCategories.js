import React from "react";
import { useNavigate } from "react-router-dom";
import "./PopularCategories.css";

import {
  FaBroom,
  FaBolt,
  FaTruck,
  FaPaintRoller,
  FaWrench,
  FaChalkboardTeacher
} from "react-icons/fa";

const categories = [
  { name: "Home Cleaning", icon: <FaBroom /> },
  { name: "Plumbing Repair", icon: <FaWrench /> },
  { name: "Electric Work", icon: <FaBolt /> },
  { name: "Delivery Help", icon: <FaTruck /> },
  { name: "Painting", icon: <FaPaintRoller /> },
  { name: "Tutoring", icon: <FaChalkboardTeacher /> },
];

const PopularCategories = () => {

  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/gigs/category/${encodeURIComponent(category)}`);
  };

  return (
    <section className="categories-section" id="services">

      <h2 className="categories-title">
        Popular <span>Taskora</span> Services
      </h2>

      <div className="categories-grid">

        {categories.map((cat) => (

          <div
            key={cat.name}
            className="category-card"
            onClick={() => handleClick(cat.name)}
          >

            <div className="icon">
              {cat.icon}
            </div>

            <h3>{cat.name}</h3>

          </div>

        ))}

      </div>

    </section>
  );
};

export default PopularCategories;