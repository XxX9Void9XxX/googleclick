require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

require("./auth");

const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URI);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve frontend
app.use(express.static("public"));

// Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/game.html");
  }
);

// API routes
app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).end();
  res.json(req.user);
});

app.post("/click", async (req, res) => {
  if (!req.user) return res.status(401).end();
  req.user.clicks++;
  await req.user.save();
  res.json({ clicks: req.user.clicks });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
