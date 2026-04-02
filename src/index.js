

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import HomePage from "./Landing_page/Home/HomePage";
import "./index.css";
import Navbar from "./Landing_page/Navbar";
import GigSection from "./Landing_page/Gigs/GigSection";
import Service from "./Landing_page/ServiceSection/Service";
import { CityProvider } from "./context/CityContext";
import PostGigForm from "./Landing_page/Posts/PostGigForm";
import PostServiceForm from "./Landing_page/Posts/PostServiceForm";
import SignUp from "./Registration/SignUp";
import SignIn from "./Registration/SignIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./Landing_page/Footer";
import ApplyGigForm from "./Landing_page/Apply/ApplyGigForm";
import ApplicationHistory from "./Landing_page/Apply/ApplicationHistory";
// import EditProfile from "./Update_pro/EditProfile";
import CategoryGigs from "./Landing_page/Home/CategoryGigs";
import MyGigsHistory from "./Landing_page/Gigs/MyGigsHistory";
import EditGigForm from "./Landing_page/Gigs/EditGigForm";
import ApplyServiceForm from "./Landing_page/Apply/ApplyServiceForm";
import ServiceApplicationHistory from "./Landing_page/Apply/ServiceApplicationHistory";
import MyServicesHistory from "./Landing_page/ServiceSection/MyServicesHistory";
import ApplicantsList from "./Landing_page/Gigs/ApplicantList";
import ScrollToTop from "./Landing_page/ScrollToTop";
import OtpVerify from "./pages/OtpVerify";
import EditServiceForm from "./Landing_page/ServiceSection/EditServiceForm";
import ServiceApplicantsList from "./Landing_page/ServiceSection/ServiceApplicantsList";
import { TokenProvider } from "./context/TokenContext";
import About from "./Landing_page/About/About";
import Contact from "./Landing_page/About/Contact";
import Help from "./Landing_page/About/Help";
import HowItWorks from "./Landing_page/About/HowItWorks";
import MyContracts from "./pages/MyContracts";
import MyServiceContracts from "./pages/MyServiceContracts";
import TokenHistory from "./pages/TokenHistory";
import BuyTokens from "./pages/BuyTokens";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotificationsPage from "./pages/NotificationsPage";
import { NotificationProvider } from "./context/NotificationContext";
import VisitProfile from "./pages/VisitProfile";
import { CountsProvider } from "./context/CountsContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AIPost from "./pages/AIPost";
import NearbyTasks from "./Landing_page/Gigs/NearbyTasks";
import EditProfile from "./Update_pro/EditProfile";


// import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
// import UpdateProfile from './pages/UpdateProfile/UpdateProfile';


axios.defaults.baseURL = "https://taskora-backend-aejx.onrender.com";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <NotificationProvider>
        <CityProvider>
          <AuthProvider>
            <TokenProvider>
              <CountsProvider>
                <div className="app-wrapper">
                  <Navbar />
                  <ToastContainer position="top-center" autoClose={3000} />
                  <main className="page-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />

                      <Route path="/gigs" element={<GigSection />} />
                      <Route path="/gigs/:city" element={<Navigate to="/gigs" replace />} />

                      <Route path="/services" element={<Service />} />
                      <Route path="/services/:city" element={<Navigate to="/services" replace />} />

                      <Route path="/postGig" element={<PostGigForm />} />
                      <Route path="/postService" element={<PostServiceForm />} />
                      <Route path="/signUp" element={<SignUp />} />
                      <Route path="/login" element={<SignIn />} />

                      <Route path="/applyGig/:gigId" element={<ApplyGigForm />} />
                      <Route path="/applications" element={<ApplicationHistory />} />

                      <Route path="/my-gigs" element={<MyGigsHistory />} />
                      <Route path="/edit-gig/:id" element={<EditGigForm />} />
                      <Route path="/gig/:id/applicants" element={<ApplicantsList />} />

                      <Route path="/applyService/:id" element={<ApplyServiceForm />} />
                      <Route path="/service-applications" element={<ServiceApplicationHistory />} />
                      <Route path="/my-services" element={<MyServicesHistory />} />
                      <Route path="/edit-service/:id" element={<EditServiceForm />} />
                      <Route path="/service/:id/applicants" element={<ServiceApplicantsList />} />

                      {/* <Route path="/update-profile" element={<EditProfile />} /> */}
                      <Route path="/gigs/category/:category" element={<CategoryGigs />} />
                      <Route path="/verify-otp" element={<OtpVerify />} />

                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />

                      <Route path="/my-contracts" element={<MyContracts />} />
                      <Route path="/my-service-contracts" element={<MyServiceContracts />} />
                      <Route path="/buy-tokens" element={<BuyTokens />} />
                      <Route path="/token-history" element={<TokenHistory />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/profile/:userId" element={<VisitProfile />} />
                      <Route path="/ai-post" element={<AIPost />} />
                      <Route path="/nearby-tasks" element={<NearbyTasks />} />

                      <Route path="/update-profile" element={<EditProfile/>} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </CountsProvider>
            </TokenProvider>
          </AuthProvider>
        </CityProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);