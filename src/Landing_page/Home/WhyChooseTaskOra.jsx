
import React, { useEffect, useRef } from "react";
import "./WhyChooseTaskOra.css";

import { FaUsers, FaBolt, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

import taskoraImg from "../../assets/taskora-feature.png";

const WhyChooseTaskora = () => {

  const sectionRef = useRef(null);

  useEffect(() => {

    const section = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {
          section.classList.add("animate");
        } else {
          section.classList.remove("animate");
        }

      },
      { threshold: 0.35 }
    );

    if(section){
      observer.observe(section);
    }

    return () => observer.disconnect();

  }, []);


  return (

    <section className="why-section" ref={sectionRef}>

      {/* HEADER */}

      <div className="why-header">

        <h2>
          Why choose <span>Taskora</span>?
        </h2>

        <p>
          Find trusted local helpers, post tasks instantly, and get things
          done faster with your nearby community.
        </p>

      </div>


      {/* GRID */}

      <div className="why-grid">


        {/* LEFT FEATURES */}

        <div className="why-column">

          <div className="why-item">
            <FaBolt className="why-icon blue"/>
            <h3>Instant Task Posting</h3>
            <p>
              Post your gig in seconds and connect with nearby people ready to help.
            </p>
          </div>

          <div className="why-item">
            <FaUsers className="why-icon green"/>
            <h3>Local Community</h3>
            <p>
              Work with trusted people from your own neighbourhood.
            </p>
          </div>

        </div>


        {/* CENTER IMAGE */}

        <div className="why-image">

          <img
            src={taskoraImg}
            alt="Taskora services"
          />

        </div>


        {/* RIGHT FEATURES */}

        <div className="why-column">

          <div className="why-item">
            <FaShieldAlt className="why-icon purple"/>
            <h3>Verified Users</h3>
            <p>
              Ratings and reviews help you choose reliable workers.
            </p>
          </div>

          <div className="why-item">
            <FaMapMarkerAlt className="why-icon orange"/>
            <h3>Hyperlocal Matching</h3>
            <p>
              Get connected with people available near your location instantly.
            </p>
          </div>

        </div>

      </div>

    </section>

  );
};

export default WhyChooseTaskora;