import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { Collapse } from "bootstrap";

import { CityContext } from "../context/CityContext";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { CountsContext } from "../context/CountsContext";

const Navbar = () => {
  const { city } = useContext(CityContext);
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  const { gigCount, setGigCount, serviceCount, setServiceCount } =
    useContext(CountsContext);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [coinOpen, setCoinOpen] = useState(false);
  // ❌ removed unused state (no functionality affected)
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const [nearbyAvailable, setNearbyAvailable] = useState(false);

  const profileRef = useRef(null);
  const coinRef = useRef(null);

  /* ================= CLOSE MOBILE MENU ================= */

  const closeMenu = () => {
    const menu = document.getElementById("taskoraNavbar");

    if (!menu) return;

    const bsCollapse = Collapse.getInstance(menu);

    if (bsCollapse) {
      bsCollapse.hide();
    }
  };

  /* ================= CITY COUNTS ================= */

  useEffect(() => {
    if (!city || city.trim() === "") {
      setGigCount(null);
      setServiceCount(null);
      return;
    }

    const normalizedCity = city.trim();

    const fetchCounts = async () => {
      try {
        const [gigRes, serviceRes] = await Promise.all([
          axios.get(`https://taskora-backend-aejx.onrender.com/count/gigs/${encodeURIComponent(normalizedCity)}`),
          axios.get(`https://taskora-backend-aejx.onrender.com/count/services/${encodeURIComponent(normalizedCity)}`),
        ]);

        const gigCount = gigRes?.data?.count ?? 0;
        const serviceCount = serviceRes?.data?.count ?? 0;

        setGigCount(gigCount);
        setServiceCount(serviceCount);
      } catch {
        setGigCount(0);
        setServiceCount(0);
      }
    };

    fetchCounts();
  }, [city,setGigCount, setServiceCount]);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (coinRef.current && !coinRef.current.contains(e.target)) {
        setCoinOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= NEARBY TASK CHECK ================= */

  // useEffect(() => {
  //   if (!user) return;

  //   if (!navigator.geolocation) return;

  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const lat = position.coords.latitude;
  //     const lng = position.coords.longitude;

  //     try {
  //       const res = await axios.get(`/api/gigs/nearby?lat=${lat}&lng=${lng}`);

  //       if (res.data && res.data.length > 0) {
  //         // setNearbyAvailable(true);
  //       }
  //     } catch (err) {
  //       console.log("Nearby check error", err);
  //     }
  //   });
  // }, [user]);

  /* ================= UI ================= */

  return (
    <nav className="navbar navbar-expand-lg sticky-top taskora-navbar">
      <div className="container-fluid">
        
        {/* BRAND */}
        <Link className="navbar-brand" to="/">
          <strong style={{ fontSize: "22px", color: "#1d4ed8" }}>
            Taskora
          </strong>
        </Link>

        {/* HAMBURGER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#taskoraNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSE MENU */}
        <div className="collapse navbar-collapse" id="taskoraNavbar">
           {/* ❌ CLOSE BUTTON (MOBILE ONLY) */}
            <div className="mobile-close-btn" onClick={closeMenu}>
              ✖
            </div>
          {/* LEFT LINKS */}
          {/* ✅ added nav-left class */}
          <div className="navbar-nav me-auto align-items-lg-center gap-lg-3 nav-left">
            <span className="text-muted">📍 {city || "Select location"}</span>

            <Link
              className="nav-link nav-link-with-badge"
              to="/gigs"
              onClick={closeMenu}
            >
              <span className="nav-text">Gigs</span>
              {gigCount !== null && (
                <span className="nav-count-badge">{gigCount}</span>
              )}
            </Link>

            <Link
              className="nav-link nav-link-with-badge"
              to="/services"
              onClick={closeMenu}
            >
              <span className="nav-text">Services</span>
              {serviceCount !== null && (
                <span className="nav-count-badge service">
                  {serviceCount}
                </span>
              )}
            </Link>

            <Link className="nav-link" to="/about" onClick={closeMenu}>
              About
            </Link>

            <Link className="nav-link" to="/how-it-works" onClick={closeMenu}>
              How it works
            </Link>

            <Link className="nav-link" to="/help" onClick={closeMenu}>
              Help
            </Link>

            <Link className="nav-link" to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </div>

          {/* RIGHT SECTION */}
          {/* ✅ added nav-right class */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 nav-right">

            {user && (
              <div className="position-relative">
                <FaBell
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/notifications");
                    closeMenu();
                  }}
                />

                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </div>
            )}

            {user && (
              <div className="position-relative" ref={coinRef}>
                <span
                  className="fw-bold text-warning cursor-pointer"
                  onClick={() => {
                    setCoinOpen(!coinOpen);
                    setProfileOpen(false);
                  }}
                >
                  🪙 {user.tokens}
                </span>

                {coinOpen && (
                  <div className="dropdown-menu show p-3">
                    <p className="fw-bold mb-1">Token Balance</p>
                    <p className="text-primary fs-5">{user.tokens}</p>

                    <Link
                      className="dropdown-item"
                      to="/token-history"
                      onClick={closeMenu}
                    >
                      Token History
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/buy-tokens"
                      onClick={closeMenu}
                    >
                      Buy Tokens
                    </Link>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="position-relative" ref={profileRef}>
                <div
                  className="d-flex align-items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setCoinOpen(false);
                  }}
                >
                  <span className="fw-semibold text-primary">
                    {user.username}
                  </span>

                  <div className="profile-circle">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                {profileOpen && (
                  <div className="dropdown-menu show">
                    <Link className="dropdown-item" to="/applications" onClick={closeMenu}>
                      Task Applied History
                    </Link>

                    <Link className="dropdown-item" to="/my-gigs" onClick={closeMenu}>
                      Task Post History
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/service-applications"
                      onClick={closeMenu}
                    >
                      Service Applied History
                    </Link>

                    <Link className="dropdown-item" to="/my-services" onClick={closeMenu}>
                      Service Post History
                    </Link>

                    <Link className="dropdown-item" to="/my-contracts" onClick={closeMenu}>
                      My Contracts
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/my-service-contracts"
                      onClick={closeMenu}
                    >
                      My Service Contracts
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/update-profile"
                      onClick={closeMenu}
                    >
                      Update Profile
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary" onClick={closeMenu}>
                  Login
                </Link>

                <Link to="/signUp" className="btn btn-danger" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;