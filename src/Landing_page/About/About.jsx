import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <h1>About TaskOra</h1>
        <p>
          TaskOra is a location-based platform that connects people who need
          help with those who can get the job done — quickly, locally, and
          reliably.
        </p>
      </section>

      {/* CONTENT */}
      <section className="about-content">
        <div className="about-card">
          <h2>🚀 Our Mission</h2>
          <p>
            Our mission is to empower local communities by making it easy to
            find gigs, services, and short-term work opportunities within your
            own city or district.
          </p>
        </div>

        <div className="about-card">
          <h2>💡 What We Do</h2>
          <p>
            TaskOra allows users to post gigs and services, discover nearby
            opportunities, and connect directly without unnecessary
            middlemen.
          </p>
        </div>

        <div className="about-card">
          <h2>🌍 Why TaskOra?</h2>
          <ul>
            <li>Location-based gigs & services</li>
            <li>Simple and fast posting</li>
            <li>Direct user-to-user connection</li>
            <li>Built for local communities</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>🤝 Our Vision</h2>
          <p>
            We envision a future where finding local work or trusted help is
            just a few clicks away — transparent, fair, and accessible to
            everyone.
          </p>
        </div>

        {/* NEW CARD 5 */}
        <div className="about-card">
          <h2>🔒 Trust & Safety</h2>
          <p>
            We prioritize user safety by encouraging genuine listings,
            clear communication, and responsible usage of the platform.
            TaskOra is built to promote trust within local communities.
          </p>
        </div>

        {/* NEW CARD 6 */}
        <div className="about-card">
          <h2>📈 Growing Together</h2>
          <p>
            Whether you are offering a service or looking for help, TaskOra
            grows with you. We aim to support freelancers, small businesses,
            and individuals by enabling local economic growth.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
