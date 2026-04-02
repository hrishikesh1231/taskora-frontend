







// require("dotenv").config();

// // ================= IMPORTS =================
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const axios = require("axios");
// const nodemailer = require("nodemailer");
// const Notification = require("./models/Notification");
// const sendEmail = require("./utils/sendEmail");
// const notificationRoutes = require("./routes/notificationRoutes");
// const { deductTokens } = require("./utils/tokenManager");
// const tokenRoutes = require("./routes/tokenRoutes");
// const { createWelcomeBonus } = require("./controllers/tokenController");
// const crypto = require("crypto");

// // ================= MODELS =================

// // ✅ VERY IMPORTANT — register all models
// require("./models");

// const { Gig } = require("./models/Gigmodel");
// const { Service } = require("./models/Servicemodel");
// const { UserModel } = require("./models/UserModel");
// const { Application } = require("./models/ApplicationModel");
// // const { ServiceApplication } = require("./models/ServiceApplicationModel");
// const ServiceApplication = require("./models/ServiceApplicationModel");
// const TokenTransaction = require("./models/TokenTransaction");

// const Otp = require("./models/OtpModel");

// // ================= UTILS =================
// const WrapAsync = require("./utils/WrapAsync");
// const { isLoggedIn } = require("./middlewares/middleware");
// const { upload } = require("./utils/Cloudinary");

// // ================= ROUTES =================
// const locationRoutes = require("./routes/locationRoutes");
// const contractRoutes = require("./routes/contractRoutes");

// const app = express();

// // ================= ENV =================
// const url = process.env.MONGO_URL;
// const PORT = process.env.PORT || 3002;
// const secret = process.env.SECRET;
// const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

// // ================= MIDDLEWARE =================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   }),
// );

// app.set("trust proxy", 1);

// // ================= SESSION =================
// const store = MongoStore.create({
//   mongoUrl: url,
//   crypto: { secret },
//   touchAfter: 24 * 3600,
// });

// app.use(
//   session({
//     store,
//     secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       sameSite: "lax",
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     },
//   }),
// );

// // ================= PASSPORT =================
// app.use(passport.initialize());
// app.use(passport.session());

// /// notification

// app.use("/api", notificationRoutes);

// passport.use(new LocalStrategy(UserModel.authenticate()));
// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());

// ///   token
// app.use("/api/tokens", tokenRoutes);
// app.use("/api", contractRoutes);

// // ================= EMAIL =================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail App Password
//   },
// });


// // app.post("/addGig", isLoggedIn, async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       category,
// //       state,
// //       district,
// //       location,
// //       date,
// //       contact,
// //     } = req.body;

// //     /**
// //      * 0️⃣ Hard backend validation (baseline safety)
// //      */
// //     if (
// //       !title ||
// //       !description ||
// //       !category ||
// //       !state ||
// //       !district ||
// //       !date ||
// //       !contact
// //     ) {
// //       return res.status(400).json({ error: "Missing required fields" });
// //     }

// //     /**
// //      * 1️⃣ AI CHECK (ONLY checks title & description internally)
// //      */
// //     await axios.post(`${process.env.FASTAPI_URL}/analyze`, {
// //       title,
// //       description,
// //       location: location || "na",
// //       category,
// //       date,
// //       contact,
// //     });

// //     /**
// //      * 2️⃣ SAVE GIG (BASELINE LOGIC — DO NOT CHANGE)
// //      */
// //     const newGig = new Gig({
// //       title,
// //       description,
// //       category,
// //       state,
// //       district,
// //       location,
// //       date,
// //       contact,
// //       postedBy: req.user._id,
// //     });

// //     await newGig.save();

// //     /**
// //      * 3️⃣ TOKEN DEDUCTION (🔥 NEW — SAFE POINT)
// //      */
// //     await deductTokens({
// //       userId: req.user._id,
// //       amount: 5, // 🔧 you control this
// //       reason: "Post Gig",
// //       gig: newGig._id,
// //     });

// //     return res.status(201).json({
// //       message: "Gig created successfully",
// //       gig: newGig,
// //     });
// //   } catch (err) {
// //     console.error("ADD GIG ERROR:", err.response?.data || err.message);

// //     return res.status(400).json({
// //       error:
// //         err.response?.data?.message || "Gig rejected by AI or invalid data",
// //     });
// //   }
// // });


// // // ================= SEND OTP =================
// // app.post("/send-otp", async (req, res) => {
// //   try {
// //     const { email } = req.body || {};
// //     if (!email) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Email required" });
// //     }

// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //     console.log("📩 SENDING OTP:", otp, "TO:", email);

// //     await Otp.deleteMany({ email });

// //     await Otp.create({
// //       email,
// //       otp,
// //       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
// //     });

// //     await transporter.sendMail({
// //       from: `"TaskOra" <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: "Your OTP Code",
// //       text: `Your OTP is ${otp}. Valid for 5 minutes.`,
// //     });

// //     res.json({ success: true, message: "OTP sent" });
// //   } catch (err) {
// //     console.error("❌ SEND OTP ERROR:", err);
// //     res.status(500).json({ success: false });
// //   }
// // });



// // app.post("/verify-otp", async (req, res) => {
// //   try {
// //     const { name, email, password, otp, state, district } = req.body || {};

// //     if (!name || !email || !password || !otp || !state || !district) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All fields required",
// //       });
// //     }

// //     // ✅ Check if email already registered
// //     const existingEmail = await UserModel.findOne({ email });
// //     if (existingEmail) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email already registered",
// //       });
// //     }

// //     const otpRecord = await Otp.findOne({ email });

// //     if (!otpRecord) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "OTP not found",
// //       });
// //     }

// //     if (otpRecord.expiresAt < new Date()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "OTP expired",
// //       });
// //     }

// //     if (String(otpRecord.otp) !== String(otp)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid OTP",
// //       });
// //     }

// //     // ✅ Clean username
// //     const username = name.trim().toLowerCase();

// //     // ✅ Check if username already exists
// //     const existingUser = await UserModel.findOne({ username });
// //     if (existingUser) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Username already taken",
// //       });
// //     }

// //     // ✅ Create new user
// //     const newUser = new UserModel({
// //       username,
// //       email,
// //       state,
// //       district,
// //     });

// //     await UserModel.register(newUser, password);

// //     // ✅ Welcome bonus
// //     await createWelcomeBonus(newUser._id);

// //     // ✅ Delete OTP after successful registration
// //     await Otp.deleteOne({ email });

// //     res.json({
// //       success: true,
// //       message: "🎉 Account created successfully!",
// //       username,
// //       tokens: 100,
// //     });

// //   } catch (err) {
// //     console.error("❌ VERIFY OTP ERROR:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Something went wrong",
// //     });
// //   }
// // });

// // app.post("/login", (req, res, next) => {
// //   passport.authenticate("local", (err, user) => {
// //     if (err) return next(err);
// //     if (!user)
// //       return res.status(401).json({ msg: "Invalid username or password" });

// //     req.login(user, (err) => {
// //       if (err) return next(err);
// //       res.json({
// //         user: {
// //           username: user.username,
// //           email: user.email,
// //           state: user.state,
// //           district: user.district,
// //           tokens: user.tokens,
// //         },
// //       });
// //     });
// //   })(req, res, next);
// // });

// // app.get("/current-user", (req, res) => {
// //   if (!req.isAuthenticated()) {
// //     return res.status(401).json({ success: false });
// //   }

// //   res.json({
// //     success: true,
// //     user: {
// //       _id: req.user._id,
// //       username: req.user.username,
// //       email: req.user.email,
// //       state: req.user.state,
// //       district: req.user.district,
// //       tokens: req.user.tokens,
// //     },
// //   });
// // });

// // // ================= LOGOUT =================
// // app.get("/logout", (req, res) => {
// //   req.logout(() => {
// //     req.session.destroy();
// //     res.clearCookie("connect.sid");
// //     res.json({ success: true });
// //   });
// // });


// // // ======================================
// // // 🔹 FORGOT PASSWORD
// // // ======================================

// // // ======================================
// // // 🔹 FORGOT PASSWORD
// // // ======================================
// // // ======================================
// // // 🔹 FORGOT PASSWORD
// // // ======================================
// // app.post("/forgot-password", async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email required",
// //       });
// //     }

// //     const normalizedEmail = email.trim().toLowerCase();

// //     const user = await UserModel.findOne({ email: normalizedEmail });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "User not found",
// //       });
// //     }

// //     const resetToken = crypto.randomBytes(32).toString("hex");

// //     user.resetPasswordToken = crypto
// //       .createHash("sha256")
// //       .update(resetToken)
// //       .digest("hex");

// //     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

// //     await user.save();

// //     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

// //     // ✅ SEND EMAIL
// //     await transporter.sendMail({
// //       from: `"TaskOra Support" <${process.env.EMAIL_USER}>`,
// //       to: normalizedEmail,
// //       subject: "Password Reset Request",
// //       html: `
// //         <h2>Password Reset</h2>
// //         <p>You requested to reset your password.</p>
// //         <p>Click the link below to reset:</p>
// //         <a href="${resetUrl}">${resetUrl}</a>
// //         <p>This link expires in 15 minutes.</p>
// //         <p>If you did not request this, ignore this email.</p>
// //       `,
// //     });

// //     res.json({
// //       success: true,
// //       message: "Reset link sent to your email",
// //     });

// //   } catch (err) {
// //     console.error("FORGOT PASSWORD ERROR:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //     });
// //   }
// // });
// // // ======================================
// // // 🔹 RESET PASSWORD
// // // ======================================

// // // ======================================
// // // 🔹 RESET PASSWORD
// // // ======================================

// // app.post("/reset-password/:token", async (req, res) => {
// //   try {
// //     const { password } = req.body;

// //     const hashedToken = crypto
// //       .createHash("sha256")
// //       .update(req.params.token)
// //       .digest("hex");

// //     const user = await UserModel.findOne({
// //       resetPasswordToken: hashedToken,
// //       resetPasswordExpire: { $gt: Date.now() },
// //     });

// //     if (!user) {
// //       return res.status(400).json({
// //         message: "Invalid or expired token",
// //       });
// //     }

// //     // 🔥 Use built-in changePassword instead (better method)
// //     await user.setPassword(password);

// //     // Clear reset fields
// //     user.resetPasswordToken = undefined;
// //     user.resetPasswordExpire = undefined;

// //     await user.save();

// //     res.json({ message: "Password reset successful" });

// //   } catch (err) {
// //     console.error("RESET PASSWORD ERROR:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });
















// // ================= ADD GIG (BASELINE + AI) =================

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/", require("./routes/gigRoutes"));
// app.use("/", require("./routes/serviceRoutes"));



// // app.post("/addGig", isLoggedIn, async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       category,
// //       state,
// //       district,
// //       location,
// //       date,
// //       contact,
// //     } = req.body;

// //     /**
// //      * 0️⃣ Hard backend validation (baseline safety)
// //      */
// //     if (
// //       !title ||
// //       !description ||
// //       !category ||
// //       !state ||
// //       !district ||
// //       !date ||
// //       !contact
// //     ) {
// //       return res.status(400).json({ error: "Missing required fields" });
// //     }

// //     /**
// //      * 1️⃣ AI CHECK (ONLY checks title & description internally)
// //      */
// //     await axios.post(`${process.env.FASTAPI_URL}/analyze`, {
// //       title,
// //       description,
// //       location: location || "na",
// //       category,
// //       date,
// //       contact,
// //     });

// //     /**
// //      * 2️⃣ SAVE GIG (BASELINE LOGIC — DO NOT CHANGE)
// //      */
// //     const newGig = new Gig({
// //       title,
// //       description,
// //       category,
// //       state,
// //       district,
// //       location,
// //       date,
// //       contact,
// //       postedBy: req.user._id,
// //     });

// //     await newGig.save();

// //     /**
// //      * 3️⃣ TOKEN DEDUCTION (🔥 NEW — SAFE POINT)
// //      */
// //     await deductTokens({
// //       userId: req.user._id,
// //       amount: 5, // 🔧 you control this
// //       reason: "Post Gig",
// //       gig: newGig._id,
// //     });

// //     return res.status(201).json({
// //       message: "Gig created successfully",
// //       gig: newGig,
// //     });
// //   } catch (err) {
// //     console.error("ADD GIG ERROR:", err.response?.data || err.message);

// //     return res.status(400).json({
// //       error:
// //         err.response?.data?.message || "Gig rejected by AI or invalid data",
// //     });
// //   }
// // });

// // ================= ADD SERVICE (BASELINE + AI) =================


// ///////


// // console.log("🔥 REGISTERING GIG ROUTES");

// // // ================= GET GIG (EDIT LOAD) =================
// // app.get("/gig/:id", isLoggedIn, async (req, res) => {
// //   try {
// //     const gig = await Gig.findById(req.params.id);

// //     if (!gig) {
// //       return res.status(404).json({ error: "Gig not found" });
// //     }

// //     // 🔒 owner-only
// //     if (gig.postedBy.toString() !== req.user._id.toString()) {
// //       return res.status(404).json({ error: "Gig not found" });
// //     }

// //     res.json(gig);
// //   } catch (err) {
// //     console.error("❌ GET GIG ERROR:", err);
// //     res.status(500).json({ error: "Failed to fetch gig" });
// //   }
// // });

// // // ================= PUT GIG (EDIT + AI) =================
// // app.put("/gig/:id", isLoggedIn, async (req, res) => {
// //   try {
// //     // 🔥 SEND FULL GigData SHAPE (MANDATORY)
// //     const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, {
// //       title: req.body.title,
// //       description: req.body.description,
// //       location: req.body.location || "unknown",
// //       category: req.body.category || "Other",
// //       date: req.body.date,
// //       contact: req.body.contact,
// //     });

// //     if (aiRes.data.status !== "ok") {
// //       return res.status(400).json({
// //         error: aiRes.data.message,
// //       });
// //     }

// //     const updatedGig = await Gig.findOneAndUpdate(
// //       { _id: req.params.id, postedBy: req.user._id },
// //       req.body,
// //       { new: true },
// //     );

// //     if (!updatedGig) {
// //       return res.status(404).json({
// //         error: "Gig not found or not authorized",
// //       });
// //     }

// //     res.json({
// //       message: "Gig updated successfully",
// //       gig: updatedGig,
// //     });
// //   } catch (err) {
// //     console.error("❌ UPDATE GIG ERROR:", err.response?.data || err.message);

// //     if (err.response?.data?.message) {
// //       return res.status(400).json({
// //         error: err.response.data.message,
// //       });
// //     }

// //     res.status(500).json({ error: "Failed to update gig" });
// //   }
// // });

// ///////



// // app.get("/getGigs/:city", async (req, res) => {
// //   const city = req.params.city;
// //   console.log("🔍 Searching gigs for:", city);

// //   const gigs = await Gig.find({
// //     isActive: true,
// //     $or: [
// //       { location: new RegExp(city, "i") },
// //       { district: new RegExp(city, "i") },
// //     ],
// //   }).populate("postedBy", "username email");

// //   console.log("📦 Found gigs:", gigs.length);

// //   res.json(gigs);
// // });



// // app.get("/gigs-near-me", isLoggedIn, async (req, res) => {
// //   const gigs = await Gig.find({
// //     district: req.user.district,
// //     isActive: true, // ✅ ADD THIS
// //   }).populate("postedBy", "username email");

// //   res.json(gigs);
// // });


// ///// apply on gig
// // app.post(
// //   "/applyGig/:gigId",
// //   isLoggedIn,
// //   upload.array("pictures", 5),
// //   async (req, res) => {
// //     try {
// //       // ================= EXISTING LOGIC (DO NOT CHANGE) =================
// //       const application = new Application({
// //         gig: req.params.gigId,
// //         applicant: req.user._id,
// //         ...req.body,
// //         pictures: (req.files || []).map((f) => f.path),
// //       });

// //       await application.save();

// //       /**
// //        * 🔥 TOKEN DEDUCTION (SAFE POINT)
// //        */
// //       await deductTokens({
// //         userId: req.user._id,
// //         amount: 2, // 🔧 applying to gig cost
// //         reason: "Apply Gig",
// //       });

// //       // ================= STEP 3: NOTIFICATION + EMAIL =================
// //       try {
// //         const gig = await Gig.findById(req.params.gigId);

// //         if (gig) {
// //           const owner = await UserModel.findById(gig.postedBy);

// //           if (owner) {
// //             await Notification.create({
// //               user: owner._id,
// //               title: "New Application",
// //               message: `${req.user.username} applied to your gig`,
// //               type: "APPLY",
// //               link: `/gig/${gig._id}/applicants`,
// //             });

// //             await sendEmail({
// //               to: owner.email,
// //               subject: "New Application Received",
// //               html: `
// //                 <h2>New Application</h2>
// //                 <p><b>${req.user.username}</b> has applied to your gig.</p>
// //               `,
// //             });
// //           }
// //         }
// //       } catch (err) {
// //         console.error("STEP 3 notification/email error:", err.message);
// //       }
// //       // ================= END STEP 3 =================

// //       res.json({ success: true });
// //     } catch (err) {
// //       console.error("❌ APPLY GIG ERROR:", err);
// //       res.status(500).json({ error: "Failed to apply gig" });
// //     }
// //   },
// // );


// // app.post(
// //   "/applyGig/:gigId",
// //   isLoggedIn,
// //   upload.array("pictures", 5),
// //   async (req, res) => {
// //     let application;

// //     try {
// //       // ================= EXISTING LOGIC (NOT CHANGED) =================
// //       application = new Application({
// //         gig: req.params.gigId,
// //         applicant: req.user._id,
// //         ...req.body,
// //         pictures: (req.files || []).map((f) => f.path),
// //       });

// //       await application.save();

// //       // ================= TOKEN DEDUCTION =================
// //       await deductTokens({
// //         userId: req.user._id,
// //         amount: 2,
// //         reason: "Apply Gig",
// //          gig: req.params.gigId
// //       });

      
// //       await TokenTransaction.findOneAndUpdate(
// //         {
// //           user: req.user._id,
// //           reason: "Apply Gig",
// //         },
// //         {
// //           $set: { gig: req.params.gigId },
// //         },
// //         { sort: { createdAt: -1 } },
// //       );

// //       ////////////////////////////

// //       // ================= STEP 3: NOTIFICATION + EMAIL =================
// //       try {
// //         const gig = await Gig.findById(req.params.gigId);

// //         if (gig) {
// //           const owner = await UserModel.findById(gig.postedBy);

// //           if (owner) {
// //             await Notification.create({
// //               user: owner._id,
// //               title: "New Application",
// //               message: `${req.user.username} applied to your gig`,
// //               type: "APPLY",
// //               link: `/gig/${gig._id}/applicants`,
// //             });

// //             await sendEmail({
// //               to: owner.email,
// //               subject: "New Application Received",
// //               html: `
// //                 <h2>New Application</h2>
// //                 <p><b>${req.user.username}</b> has applied to your gig.</p>
// //               `,
// //             });
// //           }
// //         }
// //       } catch (err) {
// //         console.error("STEP 3 notification/email error:", err.message);
// //       }

// //       res.json({ success: true });
// //     } catch (err) {
// //       console.error("❌ APPLY GIG ERROR:", err.message);

// //       // 🔥 IMPORTANT: CLEANUP IF TOKEN FAILED
// //       if (application && application._id) {
// //         await Application.findByIdAndDelete(application._id);
// //       }

// //       return res.status(400).json({
// //         error: err.message || "Insufficient tokens to apply",
// //       });
// //     }
// //   },
// // );


// // app.post(
// //   "/applyService/:serviceId",
// //   isLoggedIn,
// //   upload.array("pictures", 5),
// //   async (req, res) => {
// //     try {
// //       console.log("🔥 APPLY SERVICE ROUTE HIT");

// //       const application = await ServiceApplication.create({
// //         service: req.params.serviceId,
// //         applicant: req.user._id,
// //         name: req.body.name,
// //         message: req.body.message,
// //         contact: req.body.contact,
// //         charges: req.body.charges,
// //         pictures: (req.files || []).map((f) => f.path),
// //       });

// //       console.log("✅ Service application saved");

// //       /**
// //        * 🔥 TOKEN DEDUCTION (SAFE POINT)
// //        */
// //       await deductTokens({
// //         userId: req.user._id,
// //         amount: 1, // 🔧 apply service cost
// //         reason: "Apply Service",
// //       });

// //       // 1️⃣ Fetch service
// //       const service = await Service.findById(req.params.serviceId);
// //       if (!service) return res.json({ success: true });

// //       // 2️⃣ Fetch owner
// //       const owner = await UserModel.findById(service.postedBy);
// //       if (!owner) return res.json({ success: true });

// //       // 3️⃣ Notification
// //       await Notification.create({
// //         user: owner._id,
// //         title: "New Service Application",
// //         message: `${req.user.username} applied to your service`,
// //         type: "APPLY",
// //         link: `/service/${service._id}/applicants`,
// //       });

// //       console.log("🔔 Service notification created");

// //       // 4️⃣ Email
// //       await sendEmail({
// //         to: owner.email,
// //         subject: "New Service Application",
// //         html: `
// //           <h3>New Service Application</h3>
// //           <p><b>${req.user.username}</b> applied to your service.</p>
// //         `,
// //       });

// //       console.log("📧 Service email sent");

// //       res.json({ success: true });
// //     } catch (err) {
// //       console.error("❌ APPLY SERVICE ERROR:", err);
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // app.get("/my-applications", isLoggedIn, async (req, res) => {
// //   const apps = await Application.find({
// //     applicant: req.user._id,
// //   }).populate("gig");
// //   res.json(apps);
// // });

// // app.get("/count/gigs/:city", async (req, res) => {
// //   try {
// //     const city = req.params.city;

// //     const count = await Gig.countDocuments({
// //       $or: [
// //         { location: { $regex: new RegExp(city, "i") } },
// //         { district: { $regex: new RegExp(city, "i") } },
// //       ],
// //     });

// //     res.json({ count });
// //   } catch (err) {
// //     console.error("Gig count error:", err);
// //     res.status(500).json({ count: 0 });
// //   }
// // });

// // ================= SERVICE COUNT BY DISTRICT =================



// // app.get("/debug-users", async (req, res) => {
// //   const users = await UserModel.find({});
// //   res.json(
// //     users.map((u) => ({
// //       username: u.username,
// //       email: u.email,
// //     })),
// //   );
// // });

// // // ================= MY GIGS =================
// // app.get("/my-gigs", isLoggedIn, async (req, res) => {
// //   try {
// //     const gigs = await Gig.find({ postedBy: req.user._id })
// //       .sort({ createdAt: -1 })
// //       .lean(); // ✅ faster, safer for read-only

// //     res.status(200).json(gigs);
// //   } catch (err) {
// //     console.error("❌ Error fetching user gigs:", err);
// //     res.status(500).json({
// //       error: "Failed to fetch your gigs",
// //     });
// //   }
// // });

// // 1;

// // ================= MY SERVICES =================



// // // ================= MY APPLICATIONS =================
// // app.get("/my-applications", isLoggedIn, async (req, res) => {
// //   try {
// //     const applications = await Application.find({
// //       applicant: req.user._id,
// //     })
// //       .populate({
// //         path: "gig",
// //         select: "title location date category district state",
// //       })
// //       .sort({ createdAt: -1 })
// //       .lean(); // ✅ faster, read-only

// //     res.status(200).json(applications);
// //   } catch (err) {
// //     console.error("❌ Error fetching applications:", err);
// //     res.status(500).json({
// //       error: "Failed to fetch applications",
// //     });
// //   }
// // });

// // // ================= DELETE GIG (OWNER ONLY) =================
// // app.delete("/gig/:id", isLoggedIn, async (req, res) => {
// //   try {
// //     const deletedGig = await Gig.findOneAndDelete({
// //       _id: req.params.id,
// //       postedBy: req.user._id, // 🔒 owner-only
// //     });

// //     if (!deletedGig) {
// //       return res.status(404).json({
// //         error: "Gig not found or not authorized ❌",
// //       });
// //     }

// //     res.status(200).json({
// //       message: "✅ Gig deleted successfully",
// //     });
// //   } catch (err) {
// //     console.error("❌ Error deleting gig:", err);
// //     res.status(500).json({
// //       error: "Server error while deleting gig",
// //     });
// //   }
// // });

// // ================= DELETE SERVICE (OWNER ONLY) =================



// // ================= VIEW GIG APPLICANTS (OWNER ONLY) =================
// // app.get("/gig/:id/applicants", isLoggedIn, async (req, res) => {
// //   try {
// //     // 1️⃣ Verify gig exists
// //     const gig = await Gig.findById(req.params.id);

// //     if (!gig) {
// //       return res.status(404).json({ error: "Gig not found" });
// //     }

// //     // 2️⃣ Owner-only access
// //     if (gig.postedBy.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({
// //         error: "Not authorized to view applicants",
// //       });
// //     }

// //     // 3️⃣ Fetch applications for this gig
// //     const applications = await Application.find({ gig: gig._id })
// //       .populate("applicant", "username email") // safe public info
// //       .sort({ createdAt: -1 });

// //     // 4️⃣ Response
// //     res.status(200).json({
// //       count: applications.length,
// //       applications,
// //     });
// //   } catch (err) {
// //     console.error("❌ Error fetching applicants:", err);
// //     res.status(500).json({
// //       error: "Failed to fetch applicants",
// //     });
// //   }
// // });

// app.get("/gig/:id/applicants", isLoggedIn, async (req, res) => {
//   try {
//     // 1️⃣ Verify gig exists
//     const gig = await Gig.findById(req.params.id);

//     if (!gig) {
//       return res.status(404).json({ error: "Gig not found" });
//     }

//     // 2️⃣ Owner-only access
//     if (gig.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         error: "Not authorized to view applicants",
//       });
//     }

//     // 🔥 CHECK IF SOMEONE IS SELECTED
//     const selectedApp = await Application.findOne({
//       gig: gig._id,
//       status: "selected",
//     });

//     let applications;

//     if (selectedApp) {
//       // ✅ If selected exists → return only that one
//       applications = await Application.find({
//         gig: gig._id,
//         status: "selected",
//       })
//         .populate("applicant", "username email")
//         .sort({ createdAt: -1 });
//     } else {
//       // ✅ Otherwise return all (your original logic)
//       applications = await Application.find({ gig: gig._id })
//         .populate("applicant", "username email")
//         .sort({ createdAt: -1 });
//     }

//     res.status(200).json({
//       count: applications.length,
//       applications,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching applicants:", err);
//     res.status(500).json({
//       error: "Failed to fetch applicants",
//     });
//   }
// });

// ///////////////////// email

// // ================= SELECT GIG APPLICANT =================
// app.post(
//   "/gig-application/:applicationId/select",
//   isLoggedIn,
//   async (req, res) => {
//     try {
//       const application = await Application.findById(req.params.applicationId);

//       if (!application) {
//         return res.status(404).json({ error: "Application not found" });
//       }

//       // 🔒 Only gig owner can select
//       const gig = await Gig.findById(application.gig);
//       if (!gig || gig.postedBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ error: "Not authorized" });
//       }

//       // ✅ EXISTING LOGIC (status update)
//       application.status = "selected";
//       await application.save();

//       // ================= STEP 4: NOTIFICATION + EMAIL =================
//       try {
//         const applicant = await UserModel.findById(application.applicant);

//         if (applicant) {
//           // 🔔 Notification
//           await Notification.create({
//             user: applicant._id,
//             title: "Application Selected 🎉",
//             message: "You have been selected for a gig",
//             type: "CONFIRM",
//             link: "/my-applications",
//           });

//           // 📧 Email
//           await sendEmail({
//             to: applicant.email,
//             subject: "You have been selected 🎉",
//             html: `
//               <h2>Congratulations!</h2>
//               <p>You have been selected for the gig.</p>
//             `,
//           });
//         }
//       } catch (err) {
//         console.error("STEP 4 GIG notify error:", err.message);
//       }

//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ SELECT GIG APPLICANT ERROR:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   },
// );

// ///////////////

// // ================= VIEW SERVICE APPLICANTS (OWNER ONLY) =================
// app.get("/service/:id/applicants", isLoggedIn, async (req, res) => {
//   try {
//     // 1️⃣ Verify service exists
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({
//         error: "Service not found",
//       });
//     }

//     // 2️⃣ Owner-only access
//     if (service.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         error: "Not authorized to view applicants",
//       });
//     }

//     // 3️⃣ Fetch applications for this service
//     const applications = await ServiceApplication.find({
//       service: service._id,
//     })
//       .populate("applicant", "username email")
//       .sort({ createdAt: -1 });

//     // 4️⃣ Response
//     res.status(200).json({
//       count: applications.length,
//       applications,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching service applicants:", err);
//     res.status(500).json({
//       error: "Failed to fetch applicants",
//     });
//   }
// });

// ////////////////// email +noti

// // ================= SELECT SERVICE APPLICANT =================
// app.post(
//   "/service-application/:applicationId/select",
//   isLoggedIn,
//   async (req, res) => {
//     try {
//       const application = await ServiceApplication.findById(
//         req.params.applicationId,
//       );

//       if (!application) {
//         return res.status(404).json({ error: "Application not found" });
//       }

//       // 🔒 Only service owner can select
//       const service = await Service.findById(application.service);
//       if (!service || service.postedBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ error: "Not authorized" });
//       }

//       // ✅ EXISTING LOGIC
//       application.status = "selected";
//       await application.save();

//       // ================= STEP 4: NOTIFICATION + EMAIL =================
//       try {
//         const applicant = await UserModel.findById(application.applicant);

//         if (applicant) {
//           await Notification.create({
//             user: applicant._id,
//             title: "Application Selected 🎉",
//             message: "You have been selected for a service",
//             type: "CONFIRM",
//             link: "/my-applications",
//           });

//           await sendEmail({
//             to: applicant.email,
//             subject: "Service Application Selected 🎉",
//             html: `
//               <h2>Congratulations!</h2>
//               <p>You have been selected for the service.</p>
//             `,
//           });
//         }
//       } catch (err) {
//         console.error("STEP 4 SERVICE notify error:", err.message);
//       }

//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ SELECT SERVICE APPLICANT ERROR:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   },
// );

// ///////////

// // ================= GET CURRENT USER =================
// app.get("/me", isLoggedIn, (req, res) => {
//   const user = req.user;

//   res.json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     phone: user.phone || "",
//     location: user.location || "",
//     categories: user.categories || "",
//     avatar: user.avatar || "",
//   });
// });

// /////
// app.put(
//   "/update-profile",
//   isLoggedIn,
//   upload.single("avatar"),
//   async (req, res) => {
//     try {
//       const updates = {
//         name: req.body.name,
//         phone: req.body.phone,
//         location: req.body.location,
//         categories: req.body.categories,
//       };

//       if (req.file) {
//         updates.avatar = req.file.path; // 🔴 THIS LINE IS KEY
//       }

//       const updatedUser = await UserModel.findByIdAndUpdate(
//         req.user._id,
//         updates,
//         { new: true },
//       );

//       if (!updatedUser) {
//         return res.status(400).json({ success: false });
//       }

//       req.login(updatedUser, (err) => {
//         if (err) {
//           return res.status(500).json({ success: false });
//         }

//         res.json({
//           success: true,
//           user: updatedUser,
//         });
//       });
//     } catch (err) {
//       console.error("UPDATE PROFILE ERROR:", err);
//       res.status(500).json({ success: false });
//     }
//   },
// );

// // ================= EXTRA ROUTES =================
// app.use("/api", locationRoutes);

// app.get("/debug-users", async (req, res) => {
//   try {
//     const users = await UserModel.find({}).select(
//       "username email state district tokens createdAt",
//     );

//     res.json({
//       count: users.length,
//       users,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// app.get("/notifications", isLoggedIn, async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       user: req.user._id,
//     })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to load notifications" });
//   }
// });

// app.post("/notifications/mark-read", isLoggedIn, async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { user: req.user._id, isRead: false },
//       { $set: { isRead: true } },
//     );

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to mark read" });
//   }
// });

// // app.get("/getGigsByCategory/:category", async (req, res) => {
// //   try {
// //     const { category } = req.params;

// //     console.log("Fetching category:", category);

// //     // const gigs = await Gig.find({
// //     //   category: new RegExp(`^${category}$`, "i"), // ✅ case-insensitive exact match
// //     // })
// //     const gigs = await Gig.find({
// //       category: new RegExp(`^${category}$`, "i"),
// //       isActive: true, // ✅ ADD THIS
// //     })
// //       .populate("postedBy", "username")
// //       .sort({ createdAt: -1 });

// //     res.json(gigs);
// //   } catch (err) {
// //     console.error("Category Fetch Error:", err);
// //     res.status(500).json({
// //       error: "Failed to fetch gigs by category",
// //     });
// //   }
// // });

// app.get("/admin/reactivate-everything", async (req, res) => {
//   try {
//     const gigResult = await Gig.updateMany({}, { $set: { isActive: true } });

//     const serviceResult = await Service.updateMany(
//       {},
//       { $set: { isActive: true } },
//     );

//     res.json({
//       message: "All gigs & services activated",
//       gigsModified: gigResult.modifiedCount,
//       servicesModified: serviceResult.modifiedCount,
//     });
//   } catch (err) {
//     console.error("Reactivate error:", err);
//     res.status(500).json({ error: "Failed" });
//   }
// });


// // ======================================
// // 🔹 GET ALL USERS (TEMP DEBUG ROUTE)
// // ======================================
// app.get("/all-users", async (req, res) => {
//   try {
//     const users = await UserModel.find({}, "username email state district tokens");

//     res.json({
//       success: true,
//       count: users.length,
//       users,
//     });
//   } catch (err) {
//     console.error("FETCH USERS ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// app.post("/debug-auth", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await UserModel.findOne({ username });

//   if (!user) return res.json("User not found");

//   const result = await user.authenticate(password);

//   res.json(result);
// });

// // ================= START =================
// app.listen(PORT, async () => {
//   await mongoose.connect(url);
//   console.log("🚀 Server running & DB connected");
// });


// // ================= SEND OTP =================
// app.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body || {};
//     if (!email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email required" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     console.log("📩 SENDING OTP:", otp, "TO:", email);

//     await Otp.deleteMany({ email });

//     await Otp.create({
//       email,
//       otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await transporter.sendMail({
//       from: `"TaskOra" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. Valid for 5 minutes.`,
//     });

//     res.json({ success: true, message: "OTP sent" });
//   } catch (err) {
//     console.error("❌ SEND OTP ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });



// app.post("/verify-otp", async (req, res) => {
//   try {
//     const { name, email, password, otp, state, district } = req.body || {};

//     if (!name || !email || !password || !otp || !state || !district) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     // ✅ Check if email already registered
//     const existingEmail = await UserModel.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     if (String(otpRecord.otp) !== String(otp)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // ✅ Clean username
//     const username = name.trim().toLowerCase();

//     // ✅ Check if username already exists
//     const existingUser = await UserModel.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Username already taken",
//       });
//     }

//     // ✅ Create new user
//     const newUser = new UserModel({
//       username,
//       email,
//       state,
//       district,
//     });

//     await UserModel.register(newUser, password);

//     // ✅ Welcome bonus
//     await createWelcomeBonus(newUser._id);

//     // ✅ Delete OTP after successful registration
//     await Otp.deleteOne({ email });

//     res.json({
//       success: true,
//       message: "🎉 Account created successfully!",
//       username,
//       tokens: 100,
//     });

//   } catch (err) {
//     console.error("❌ VERIFY OTP ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// });

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user) => {
//     if (err) return next(err);
//     if (!user)
//       return res.status(401).json({ msg: "Invalid username or password" });

//     req.login(user, (err) => {
//       if (err) return next(err);
//       res.json({
//         user: {
//           username: user.username,
//           email: user.email,
//           state: user.state,
//           district: user.district,
//           tokens: user.tokens,
//         },
//       });
//     });
//   })(req, res, next);
// });

// app.get("/current-user", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ success: false });
//   }

//   res.json({
//     success: true,
//     user: {
//       _id: req.user._id,
//       username: req.user.username,
//       email: req.user.email,
//       state: req.user.state,
//       district: req.user.district,
//       tokens: req.user.tokens,
//     },
//   });
// });

// // ================= LOGOUT =================
// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     req.session.destroy();
//     res.clearCookie("connect.sid");
//     res.json({ success: true });
//   });
// });


// // ======================================
// // 🔹 FORGOT PASSWORD
// // ======================================

// // ======================================
// // 🔹 FORGOT PASSWORD
// // ======================================
// // ======================================
// // 🔹 FORGOT PASSWORD
// // ======================================
// app.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email required",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await UserModel.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     await user.save();

//     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

//     // ✅ SEND EMAIL
//     await transporter.sendMail({
//       from: `"TaskOra Support" <${process.env.EMAIL_USER}>`,
//       to: normalizedEmail,
//       subject: "Password Reset Request",
//       html: `
//         <h2>Password Reset</h2>
//         <p>You requested to reset your password.</p>
//         <p>Click the link below to reset:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//         <p>This link expires in 15 minutes.</p>
//         <p>If you did not request this, ignore this email.</p>
//       `,
//     });

//     res.json({
//       success: true,
//       message: "Reset link sent to your email",
//     });

//   } catch (err) {
//     console.error("FORGOT PASSWORD ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });
// // ======================================
// // 🔹 RESET PASSWORD
// // ======================================

// // ======================================
// // 🔹 RESET PASSWORD
// // ======================================

// app.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { password } = req.body;

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await UserModel.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid or expired token",
//       });
//     }

//     // 🔥 Use built-in changePassword instead (better method)
//     await user.setPassword(password);

//     // Clear reset fields
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.json({ message: "Password reset successful" });

//   } catch (err) {
//     console.error("RESET PASSWORD ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// ================= SEARCH (OPTION B) =================
// app.get("/getGigs/:city", async (req, res) => {
//   const city = req.params.city;
//   const gigs = await Gig.find({
//     $or: [
//       { location: new RegExp(city, "i") },
//       { district: new RegExp(city, "i") },
//     ],
//   }).populate("postedBy", "username email");
//   res.json(gigs);
// });

// app.get("/getGigs/:city", async (req, res) => {
//   const city = req.params.city;

//   const gigs = await Gig.find({
//     isActive: true, // ✅ THIS IS THE REAL FIELD YOU USE
//     $or: [
//       { location: new RegExp(city, "i") },
//       { district: new RegExp(city, "i") },
//     ],
//   }).populate("postedBy", "username email");

//   res.json(gigs);
// });




// ================= NEAR ME =================
// app.get("/gigs-near-me", isLoggedIn, async (req, res) => {
//   const gigs = await Gig.find({ district: req.user.district }).populate(
//     "postedBy",
//     "username email"
//   );
//   res.json(gigs);
// });



///// apply on gig
// app.post(
//   "/applyGig/:gigId",
//   isLoggedIn,
//   upload.array("pictures", 5),
//   async (req, res) => {
//     try {
//       // ================= EXISTING LOGIC (DO NOT CHANGE) =================
//       const application = new Application({
//         gig: req.params.gigId,
//         applicant: req.user._id,
//         ...req.body,
//         pictures: (req.files || []).map((f) => f.path),
//       });

//       await application.save();

//       /**
//        * 🔥 TOKEN DEDUCTION (SAFE POINT)
//        */
//       await deductTokens({
//         userId: req.user._id,
//         amount: 2, // 🔧 applying to gig cost
//         reason: "Apply Gig",
//       });

//       // ================= STEP 3: NOTIFICATION + EMAIL =================
//       try {
//         const gig = await Gig.findById(req.params.gigId);

//         if (gig) {
//           const owner = await UserModel.findById(gig.postedBy);

//           if (owner) {
//             await Notification.create({
//               user: owner._id,
//               title: "New Application",
//               message: `${req.user.username} applied to your gig`,
//               type: "APPLY",
//               link: `/gig/${gig._id}/applicants`,
//             });

//             await sendEmail({
//               to: owner.email,
//               subject: "New Application Received",
//               html: `
//                 <h2>New Application</h2>
//                 <p><b>${req.user.username}</b> has applied to your gig.</p>
//               `,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("STEP 3 notification/email error:", err.message);
//       }
//       // ================= END STEP 3 =================

//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ APPLY GIG ERROR:", err);
//       res.status(500).json({ error: "Failed to apply gig" });
//     }
//   },
// );


// app.post(
//   "/applyGig/:gigId",
//   isLoggedIn,
//   upload.array("pictures", 5),
//   async (req, res) => {
//     let application;

//     try {
//       // ================= EXISTING LOGIC (NOT CHANGED) =================
//       application = new Application({
//         gig: req.params.gigId,
//         applicant: req.user._id,
//         ...req.body,
//         pictures: (req.files || []).map((f) => f.path),
//       });

//       await application.save();

//       // ================= TOKEN DEDUCTION =================
//       await deductTokens({
//         userId: req.user._id,
//         amount: 2,
//         reason: "Apply Gig",
//          gig: req.params.gigId
//       });

      
//       await TokenTransaction.findOneAndUpdate(
//         {
//           user: req.user._id,
//           reason: "Apply Gig",
//         },
//         {
//           $set: { gig: req.params.gigId },
//         },
//         { sort: { createdAt: -1 } },
//       );

//       ////////////////////////////

//       // ================= STEP 3: NOTIFICATION + EMAIL =================
//       try {
//         const gig = await Gig.findById(req.params.gigId);

//         if (gig) {
//           const owner = await UserModel.findById(gig.postedBy);

//           if (owner) {
//             await Notification.create({
//               user: owner._id,
//               title: "New Application",
//               message: `${req.user.username} applied to your gig`,
//               type: "APPLY",
//               link: `/gig/${gig._id}/applicants`,
//             });

//             await sendEmail({
//               to: owner.email,
//               subject: "New Application Received",
//               html: `
//                 <h2>New Application</h2>
//                 <p><b>${req.user.username}</b> has applied to your gig.</p>
//               `,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("STEP 3 notification/email error:", err.message);
//       }

//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ APPLY GIG ERROR:", err.message);

//       // 🔥 IMPORTANT: CLEANUP IF TOKEN FAILED
//       if (application && application._id) {
//         await Application.findByIdAndDelete(application._id);
//       }

//       return res.status(400).json({
//         error: err.message || "Insufficient tokens to apply",
//       });
//     }
//   },
// );

// ================= VIEW GIG APPLICANTS (OWNER ONLY) =================
// app.get("/gig/:id/applicants", isLoggedIn, async (req, res) => {
//   try {
//     // 1️⃣ Verify gig exists
//     const gig = await Gig.findById(req.params.id);

//     if (!gig) {
//       return res.status(404).json({ error: "Gig not found" });
//     }

//     // 2️⃣ Owner-only access
//     if (gig.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         error: "Not authorized to view applicants",
//       });
//     }

//     // 3️⃣ Fetch applications for this gig
//     const applications = await Application.find({ gig: gig._id })
//       .populate("applicant", "username email") // safe public info
//       .sort({ createdAt: -1 });

//     // 4️⃣ Response
//     res.status(200).json({
//       count: applications.length,
//       applications,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching applicants:", err);
//     res.status(500).json({
//       error: "Failed to fetch applicants",
//     });
//   }
// });



