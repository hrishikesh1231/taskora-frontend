import React, { useEffect, useRef } from "react";
import { FaSearch, FaComments, FaHandshake } from "react-icons/fa";
import "./HowItWorks.css";

const steps = [
  {
    icon: <FaSearch />,
    number: "01",
    title: "Find or Post Tasks",
    description:
      "Browse available tasks in your area or post your own service offering.",
    className: "step-one",
  },
  {
    icon: <FaComments />,
    number: "02",
    title: "Connect & Discuss",
    description:
      "Chat with potential taskers or clients to discuss details and requirements.",
    className: "step-two",
  },
  {
    icon: <FaHandshake />,
    number: "03",
    title: "Get Things Done",
    description:
      "Complete the task, get rated, and build your reputation in the community.",
    className: "step-three",
  },
];

const StepCard = ({ icon, number, title, description, className }) => (
  <div className={`step-card ${className}`}>
    <div className="step-icon">{icon}</div>
    <span className="step-number">{number}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const HowItWorks = () => {
  const sectionRef = useRef(null);

  /* ========= FORCE RE-ANIMATION EVERY TIME ========= */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 🔥 force animation restart
          section.classList.remove("animate");
          void section.offsetWidth; // force browser reflow
          section.classList.add("animate");
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="howitworks-container" ref={sectionRef}>
      <div className="howitworks-inner">
        <h2>How TaskOra Works</h2>
        <p className="subtitle">
          Simple steps to connect with your local community
        </p>

        <div className="steps">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
