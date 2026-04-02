

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Service.css";

import { AuthContext } from "../../context/AuthContext";
import { CityContext } from "../../context/CityContext";

const Service = () => {

  const [serviceData, setServiceData] = useState([]);

  const { city, cityVersion } = useContext(CityContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (!city) {
      setServiceData([]);
      return;
    }

    const fetchServices = async () => {

      try {

        const res = await axios.get(
          `https://taskora-backend-aejx.onrender.com/getService/${encodeURIComponent(city)}`
        );

        const sortedServices = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setServiceData(sortedServices);

      } catch (error) {

        console.error("Error fetching services:", error);
        setServiceData([]);

      }

    };

    fetchServices();

  }, [city, cityVersion]);

  const handleApplyClick = (service) => {
    navigate(`/applyService/${service._id}`);
  };

  return (

    <div className="service-section">

      {city ? (

        serviceData.length > 0 ? (

          <>
            <h2>Services in {city}</h2>

            {serviceData.map((service) => {

              const isOwner =
                user &&
                service.postedBy &&
                String(service.postedBy._id) === String(user._id);

              return (

                <div key={service._id} className="service-card">

                  {/* TITLE */}
                  <h3 className="service-title">
                    {service.title || "Untitled Service"}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="service-description">
                    {service.description}
                  </p>

                  <div className="service-details">

                    {/* SALARY */}
                    <p>
                      💰 <strong>Salary:</strong>{" "}
                      {service.salary || "Not specified"}
                    </p>

                    {/* START DATE */}
                    <p>
                      🛠 <strong>Work Start Date:</strong>{" "}
                      {new Date(service.date).toLocaleDateString("en-IN")}
                    </p>

                    {/* POSTED DATE */}
                    <p>
                      🕒 <strong>Posted On:</strong>{" "}
                      {new Date(service.createdAt).toLocaleDateString("en-IN")}
                    </p>

                    {/* STATE */}
                    <p>
                      🌍 <strong>State:</strong> {service.state}
                    </p>

                    {/* DISTRICT */}
                    <p>
                      📍 <strong>District:</strong>{" "}
                      {service.district || city}
                    </p>

                    {/* TALUKA */}
                    <p>
                      🏘 <strong>Taluka:</strong>{" "}
                      {service.taluka || "N/A"}
                    </p>

                    {/* POSTED BY */}
                    <p>
                      👤 <strong>Posted By:</strong>{" "}
                      <i>@{service.postedBy?.username || "User"}</i>
                    </p>

                    {/* INFO TEXT */}
                    <div className="service-info">

                      <p>
                        🔒 Contact number will be visible after applying
                      </p>

                      <p>
                        💬 WhatsApp Chat available after applying
                      </p>

                      <p>
                        📍 Exact location available after applying
                      </p>

                      <p>
                        🗺 Maps location will be visible after applying
                      </p>

                    </div>

                  </div>

                  {/* APPLY BUTTON CONDITIONS */}

                  {user ? (

                    !isOwner && (
                      <button
                        className="apply-button"
                        onClick={() => handleApplyClick(service)}
                      >
                        Apply Now
                      </button>
                    )

                  ) : (

                    <button
                      className="apply-button"
                      onClick={() => navigate("/login")}
                    >
                      Login to Apply
                    </button>

                  )}

                </div>

              );

            })}

          </>

        ) : (

          <p className="no-services">
            No services found for {city}.
          </p>

        )

      ) : (

        <p className="no-services">
          Please search a location.
        </p>

      )}

    </div>

  );

};

export default Service;