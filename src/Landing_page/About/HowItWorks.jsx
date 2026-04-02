import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-page">
      
      {/* HERO */}
      <section className="how-hero fade-in">
        <h1>How TaskOra Works</h1>
        <p>
          TaskOra connects people with local gigs and long-term services 
          through a simple and transparent process.
        </p>
      </section>

      {/* SECTION */}
      <section className="how-section slide-up">
        <h2>🚀 Getting Started</h2>

        <div className="how-card">
          <span className="step-number">1</span>
          <h3>Sign Up / Login</h3>
          <p>
            Create your free account to start using TaskOra.
            <br />
            <strong>Example:</strong> Rahul signs up using email & password.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">2</span>
          <h3>Select Your Location</h3>
          <p>
            Choose your state & district to see nearby opportunities.
            <br />
            <strong>Example:</strong> Amit selects Maharashtra → Mumbai.
          </p>
        </div>
      </section>

      {/* GIG VS SERVICE */}
      <section className="how-section slide-up">
        <h2>💼 Gig vs Service</h2>

        <div className="how-card">
          <h3>⚡ Gig (Short-Term Work)</h3>
          <p>
            A Gig is a quick job usually completed within 1–2 days.
            <br />
            <strong>Examples:</strong> Cleaning, Delivery, Repair, Event Help
          </p>
        </div>

        <div className="how-card">
          <h3>🏢 Service (Long-Term Hiring)</h3>
          <p>
            A Service is for long-term or permanent employment.
            <br />
            <strong>Examples:</strong> Shop Worker, Office Assistant, Staff
          </p>
        </div>
      </section>

      {/* POSTING */}
      <section className="how-section slide-up">
        <h2>📝 Posting Work</h2>

        <div className="how-card">
          <span className="step-number">3</span>
          <h3>Post a Gig / Service</h3>
          <p>
            Fill out a simple form with title, description, date & contact.
            <br />
            <strong>Example:</strong> "Need a cleaner tomorrow"
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">4</span>
          <h3>Update or Delete Post</h3>
          <p>
            Edit job details or remove the post anytime.
          </p>
        </div>
      </section>

      {/* APPLICATION FLOW */}
      <section className="how-section slide-up">
        <h2>📨 Applications & Hiring</h2>

        <div className="how-card">
          <span className="step-number">5</span>
          <h3>View Applicants</h3>
          <p>
            See who applied for your Gig or Service.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">6</span>
          <h3>Select a Person</h3>
          <p>
            Choose the best applicant for the work.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">7</span>
          <h3>Complete the Task</h3>
          <p>
            Finish the work and build trust.
          </p>
        </div>
      </section>

      {/* HISTORY */}
      <section className="how-section slide-up">
        <h2>📚 Task History</h2>

        <div className="how-card">
          <span className="step-number">8</span>
          <h3>Track Your Activity</h3>
          <p>
            View gigs/services you posted or applied for.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">9</span>
          <h3>Manage Applications</h3>
          <p>
            See applied jobs, accepted offers, and progress.
          </p>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;