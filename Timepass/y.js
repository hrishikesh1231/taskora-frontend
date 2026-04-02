

require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Notification = require("./models/Notification");
const sendEmail = require("./utils/sendEmail");
const notificationRoutes = require("./routes/notificationRoutes");
const { deductTokens } = require("./utils/tokenManager");
const tokenRoutes = require("./routes/tokenRoutes");
const { createWelcomeBonus } = require("./controllers/tokenController");
const crypto = require("crypto");

// ================= MODELS =================

// ✅ VERY IMPORTANT — register all models
require("./models");

const { Gig } = require("./models/Gigmodel");
const { Service } = require("./models/Servicemodel");
const { UserModel } = require("./models/UserModel");
const { Application } = require("./models/ApplicationModel");
// const { ServiceApplication } = require("./models/ServiceApplicationModel");
const ServiceApplication = require("./models/ServiceApplicationModel");
const TokenTransaction = require("./models/TokenTransaction");

const Otp = require("./models/OtpModel");

// ================= UTILS =================
const WrapAsync = require("./utils/WrapAsync");
const { isLoggedIn } = require("./middlewares/middleware");
const { upload } = require("./utils/Cloudinary");

// ================= ROUTES =================
const locationRoutes = require("./routes/locationRoutes");
const contractRoutes = require("./routes/contractRoutes");

const app = express();

// ================= ENV =================
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;
const secret = process.env.SECRET;
const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.set("trust proxy", 1);

// ================= SESSION =================
const store = MongoStore.create({
  mongoUrl: url,
  crypto: { secret },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

/// notification

app.use("/api", notificationRoutes);

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

///   token
app.use("/api/tokens", tokenRoutes);
app.use("/api", contractRoutes);

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

app.use("/api/auth", require("./routes/authRoutes"));


///  add gig

app.post("/addGig", isLoggedIn, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      state,
      district,
      location,
      date,
      contact,
    } = req.body;

    /**
     * 0️⃣ Hard backend validation (baseline safety)
     */
    if (
      !title ||
      !description ||
      !category ||
      !state ||
      !district ||
      !date ||
      !contact
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /**
     * 1️⃣ AI CHECK (ONLY checks title & description internally)
     */
    await axios.post(`${process.env.FASTAPI_URL}/analyze`, {
      title,
      description,
      location: location || "na",
      category,
      date,
      contact,
    });

    /**
     * 2️⃣ SAVE GIG (BASELINE LOGIC — DO NOT CHANGE)
     */
    const newGig = new Gig({
      title,
      description,
      category,
      state,
      district,
      location,
      date,
      contact,
      postedBy: req.user._id,
    });

    await newGig.save();

    /**
     * 3️⃣ TOKEN DEDUCTION (🔥 NEW — SAFE POINT)
     */
    await deductTokens({
      userId: req.user._id,
      amount: 5, // 🔧 you control this
      reason: "Post Gig",
      gig: newGig._id,
    });

    return res.status(201).json({
      message: "Gig created successfully",
      gig: newGig,
    });
  } catch (err) {
    console.error("ADD GIG ERROR:", err.response?.data || err.message);

    return res.status(400).json({
      error:
        err.response?.data?.message || "Gig rejected by AI or invalid data",
    });
  }
});

///////   edit gig ///
console.log("🔥 REGISTERING GIG ROUTES");

// ================= GET GIG (EDIT LOAD) =================
app.get("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // 🔒 owner-only
    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json(gig);
  } catch (err) {
    console.error("❌ GET GIG ERROR:", err);
    res.status(500).json({ error: "Failed to fetch gig" });
  }
});

// ================= PUT GIG (EDIT + AI) =================
app.put("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    // 🔥 SEND FULL GigData SHAPE (MANDATORY)
    const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || "unknown",
      category: req.body.category || "Other",
      date: req.body.date,
      contact: req.body.contact,
    });

    if (aiRes.data.status !== "ok") {
      return res.status(400).json({
        error: aiRes.data.message,
      });
    }

    const updatedGig = await Gig.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true },
    );

    if (!updatedGig) {
      return res.status(404).json({
        error: "Gig not found or not authorized",
      });
    }

    res.json({
      message: "Gig updated successfully",
      gig: updatedGig,
    });
  } catch (err) {
    console.error("❌ UPDATE GIG ERROR:", err.response?.data || err.message);

    if (err.response?.data?.message) {
      return res.status(400).json({
        error: err.response.data.message,
      });
    }

    res.status(500).json({ error: "Failed to update gig" });
  }
});

////////////

////////////////////  get gig by location

app.get("/getGigs/:city", async (req, res) => {
  const city = req.params.city;
  console.log("🔍 Searching gigs for:", city);

  const gigs = await Gig.find({
    isActive: true,
    $or: [
      { location: new RegExp(city, "i") },
      { district: new RegExp(city, "i") },
    ],
  }).populate("postedBy", "username email");

  console.log("📦 Found gigs:", gigs.length);

  res.json(gigs);
});


////    gig near by me
app.get("/gigs-near-me", isLoggedIn, async (req, res) => {
  const gigs = await Gig.find({
    district: req.user.district,
    isActive: true, // ✅ ADD THIS
  }).populate("postedBy", "username email");

  res.json(gigs);
});



app.post(
  "/applyGig/:gigId",
  isLoggedIn,
  upload.array("pictures", 5),
  async (req, res) => {
    let application;

    try {

      // 🔥 ADD THIS BLOCK (ONLY ADDITION)
      const gig = await Gig.findById(req.params.gigId);

      if (!gig) {
        return res.status(404).json({ error: "Gig not found" });
      }

      // ❌ Prevent owner from applying
      if (gig.postedBy.toString() === req.user._id.toString()) {
        return res.status(400).json({
          error: "You cannot apply to your own gig",
        });
      }

      // ❌ Prevent duplicate apply (optional but safe)
      const existingApplication = await Application.findOne({
        gig: req.params.gigId,
        applicant: req.user._id,
      });

      if (existingApplication) {
        return res.status(400).json({
          error: "You have already applied to this gig",
        });
      }
      // 🔥 END OF ADDITION


      // ================= EXISTING LOGIC (NOT CHANGED) =================
      application = new Application({
        gig: req.params.gigId,
        applicant: req.user._id,
        ...req.body,
        pictures: (req.files || []).map((f) => f.path),
      });

      await application.save();

      // ================= TOKEN DEDUCTION =================
      await deductTokens({
        userId: req.user._id,
        amount: 2,
        reason: "Apply Gig",
        gig: req.params.gigId
      });

      await TokenTransaction.findOneAndUpdate(
        {
          user: req.user._id,
          reason: "Apply Gig",
        },
        {
          $set: { gig: req.params.gigId },
        },
        { sort: { createdAt: -1 } },
      );

      ////////////////////////////

      // ================= STEP 3: NOTIFICATION + EMAIL =================
      try {
        const owner = await UserModel.findById(gig.postedBy);

        if (owner) {
          await Notification.create({
            user: owner._id,
            title: "New Application",
            message: `${req.user.username} applied to your gig`,
            type: "APPLY",
            link: `/gig/${gig._id}/applicants`,
          });

          await sendEmail({
            to: owner.email,
            subject: "New Application Received",
            html: `
              <h2>New Application</h2>
              <p><b>${req.user.username}</b> has applied to your gig.</p>
            `,
          });
        }
      } catch (err) {
        console.error("STEP 3 notification/email error:", err.message);
      }

      res.json({ success: true });

    } catch (err) {
      console.error("❌ APPLY GIG ERROR:", err.message);

      if (application && application._id) {
        await Application.findByIdAndDelete(application._id);
      }

      return res.status(400).json({
        error: err.message || "Insufficient tokens to apply",
      });
    }
  },
);


app.get("/my-applications", isLoggedIn, async (req, res) => {
  const apps = await Application.find({
    applicant: req.user._id,
  }).populate("gig");
  res.json(apps);
});


app.get("/count/gigs/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const count = await Gig.countDocuments({
      $or: [
        { location: { $regex: new RegExp(city, "i") } },
        { district: { $regex: new RegExp(city, "i") } },
      ],
    });

    res.json({ count });
  } catch (err) {
    console.error("Gig count error:", err);
    res.status(500).json({ count: 0 });
  }
});


// ================= MY GIGS =================
app.get("/my-gigs", isLoggedIn, async (req, res) => {
  try {
    const gigs = await Gig.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // ✅ faster, safer for read-only

    res.status(200).json(gigs);
  } catch (err) {
    console.error("❌ Error fetching user gigs:", err);
    res.status(500).json({
      error: "Failed to fetch your gigs",
    });
  }
});



app.get("/my-applications", isLoggedIn, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "gig",
        select: "title location date category district state",
      })
      .sort({ createdAt: -1 })
      .lean(); // ✅ faster, read-only

    res.status(200).json(applications);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
});


// ================= DELETE GIG (OWNER ONLY) =================
app.delete("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const deletedGig = await Gig.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id, // 🔒 owner-only
    });

    if (!deletedGig) {
      return res.status(404).json({
        error: "Gig not found or not authorized ❌",
      });
    }

    res.status(200).json({
      message: "✅ Gig deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting gig:", err);
    res.status(500).json({
      error: "Server error while deleting gig",
    });
  }
});

