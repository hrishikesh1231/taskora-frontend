import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          Get in touch with the TaskOra team. We’re here to support you and
          build better local communities together.
        </p>
      </section>

      {/* CONTENT */}
      <section className="contact-content">
        {/* TEAM INFO */}
        <div className="contact-card">
          <h2>👥 Our Team</h2>
          <p>
            TaskOra is built by a passionate team of developers and designers
            focused on creating meaningful local connections. We believe in
            simplicity, transparency, and empowering communities.
          </p>
        </div>

        {/* CONTACT DETAILS */}
        <div className="contact-card">
          <h2>📞 Contact Details</h2>
          <ul>
            <li><strong>Email:</strong> hrishigaonkar2@gmail.com</li>
            <li><strong>Phone:</strong> +91 80107 73559</li>
            <li><strong>Phone:</strong> +91 81490 05624</li>
            <li><strong>Support Hours:</strong> Mon – Sat, 9 AM – 6 PM</li>
          </ul>
        </div>

        {/* ADDRESS */}
        <div className="contact-card">
          <h2>📍 Office Address</h2>
          <p>
            TaskOra Technologies<br />
            Ratnagiri, Maharashtra<br />
            India
          </p>
        </div>

        {/* COMMUNITY */}
        <div className="contact-card">
          <h2>🌐 Community & Support</h2>
          <p>
            For feedback, suggestions, or collaboration ideas, feel free to
            reach out. We’re continuously improving TaskOra based on user
            input.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
