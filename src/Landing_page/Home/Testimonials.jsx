import React from "react";
import "./Testimonials.css";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Designer",
    text: "TaskOra has been a game-changer for my freelance business.",
    initials: "SJ",
    color: "#4a90e2",
  },
  {
    name: "Mike Chen",
    role: "Handyman",
    text: "The platform makes it easy to find people needing home repairs.",
    initials: "MC",
    color: "#2ecc71",
  },
  {
    name: "Emma Davis",
    role: "Event Planner",
    text: "I love offering my event planning services locally.",
    initials: "ED",
    color: "#f5a623",
  },
  {
    name: "Sarah Johnson",
    role: "Freelance Designer",
    text: "TaskOra has been a game-changer for my freelance business.",
    initials: "SJ",
    color: "#4a90e2",
  },
  {
    name: "Mike Chen",
    role: "Handyman",
    text: "The platform makes it easy to find people needing home repairs.",
    initials: "MC",
    color: "#2ecc71",
  },
  {
    name: "Emma Davis",
    role: "Event Planner",
    text: "I love offering my event planning services locally.",
    initials: "ED",
    color: "#f5a623",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-container">

      <h2>What Our Community Says</h2>

      <p className="subtitle">
        Real stories from real people in our Taskora community
      </p>

      {/* LEFT → RIGHT */}
      <div className="testimonial-row move-right">

        {[...testimonials, ...testimonials].map((t, index) => (
          <div className="testimonial-card" key={index}>

            <div className="stars">
              {Array(5).fill().map((_, i) => (
                <FaStar key={i} className="star"/>
              ))}
            </div>

            <p className="testimonial-text">"{t.text}"</p>

            <div className="user-info">

              <div
                className="avatar"
                style={{ backgroundColor: t.color }}
              >
                {t.initials}
              </div>

              <div>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>

            </div>

          </div>
        ))}

      </div>


      {/* RIGHT → LEFT */}

      <div className="testimonial-row move-left">

        {[...testimonials, ...testimonials].map((t, index) => (
          <div className="testimonial-card" key={index}>

            <div className="stars">
              {Array(5).fill().map((_, i) => (
                <FaStar key={i} className="star"/>
              ))}
            </div>

            <p className="testimonial-text">"{t.text}"</p>

            <div className="user-info">

              <div
                className="avatar"
                style={{ backgroundColor: t.color }}
              >
                {t.initials}
              </div>

              <div>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Testimonials;