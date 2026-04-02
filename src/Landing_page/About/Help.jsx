import React from "react";
import "./Help.css";

const Help = () => {
  return (
    <div className="help-page">
      {/* HERO */}
      <section className="help-hero">
        <h1>Help & Support</h1>
        <p>
          Find quick answers and guidance to use TaskOra smoothly and
          effectively.
        </p>
      </section>

      {/* CONTENT */}
      <section className="help-content">
        <div className="help-card">
          <h2>📝 How to Post a Gig</h2>
          <p>
            Navigate to the “Post Gig” page, select a category, fill in the gig
            details such as title, description, location, date, and contact
            information, then submit your gig.
          </p>
        </div>

        <div className="help-card">
          <h2>📍 Choosing Your Location</h2>
          <p>
            Select your state and district carefully. TaskOra uses this
            information to show you relevant gigs and services in your area.
          </p>
        </div>

        <div className="help-card">
          <h2>🔎 Finding Gigs & Services</h2>
          <p>
            Browse gigs or services based on your selected location. Use
            categories to quickly find the type of work or help you need.
          </p>
        </div>

        <div className="help-card">
          <h2>🤝 Contacting Users</h2>
          <p>
            Use the provided contact details to connect directly with the
            gig or service provider. Communicate clearly before starting
            any work.
          </p>
        </div>

        <div className="help-card">
          <h2>🔒 Safety Tips</h2>
          <p>
            Always verify details before proceeding. Avoid sharing sensitive
            personal information and meet in safe, public locations when
            possible.
          </p>
        </div>

        <div className="help-card">
          <h2>❓ Need More Help?</h2>
          <p>
            If you’re facing issues or have questions, please reach out to our
            support team. We’re continuously improving TaskOra to serve you
            better.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Help;
