const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const mongoose = require("mongoose");

// IMPORT MIDDLEWARE(S)
const isAuthenticated = require("../Middleware/isAuthenticated.js");

// IMPORT USER MODEL
const User = require("../models/User");

// IMPORT CLOUDINARY
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// SIGNUP
// A DEFAULT AVATAR IS ASSIGNED
router.post("/user/signup", async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      location,
      veganStatus,
      birth,
      newsletter,
    } = req.fields;
    // console.log(req.fields);

    let lat = location[0];
    let lng = location[1];

    if (email && username && password) {
      //   CREATE TOKEN, HASH AND SALT.
      const token = uid2(64);
      const salt = uid2(64);
      const hash = SHA256(password + salt).toString(encBase64);
      // USE MODEL TO SAVE DATA
      const newUser = new User({
        email: email.toLowerCase(),
        account: {
          username,
          veganStatus,
          birth,
          newsletter,
          avatar:
            "https://res.cloudinary.com/cyrila/image/upload/v1607346905/happycow/Default/defaultAvatar_famfbf.png",
          location: {
            lat,
            lng,
          },
        },
        token,
        hash,
        salt,
      });

      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        email: newUser.email,
        account: newUser.account,
        token: newUser.token,
      });
    } else {
      res.status(400).json({
        message: "Missing parameters",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// LOGIN
router.post("/user/signin", async (req, res) => {
  try {
    const { email, password } = req.fields;
    // FIND THE USER IN DB
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (user) {
      // Check the recorded hash with the one generate from salt and password
      const testHash = SHA256(password + user.salt).toString(encBase64);
      if (testHash === user.hash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ACCESS USER BY ID
router.post("/user/profile", async (req, res) => {
  try {
    const user = await User.findById(req.fields._id);
    console.log("search for user");
    if (user) {
      // console.log("user found");
      res.json({
        account: user.account,
        email: user.email,
        _id: user._id,
      });
      console.log("response OK");
    } else {
      res.status(400).json({ error: "User not found" });
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
  }
});

// EDIT PROFILE
// ISAUTHENTICATED MIDDLEWARE IS NEEDED
router.post("/user/updateprofile", isAuthenticated, async (req, res) => {
  console.log(req.fields);
  try {
    const {
      email,
      username,
      veganStatus,
      birth,
      newsletter,
      location,
    } = req.fields;
    // const actualUser
    if (email && username && veganStatus && birth && newsletter && location) {
      // UPDATE PROFILE

      const updatedProfile = new User({
        email,
        account: {
          username,
          veganStatus,
          birth,
          newsletter,
          // avatar,
          location,
        },
        token: req.user.token,
        hash: req.user.hash,
        salt: req.user.salt,
      });
      await updatedProfile.save();
      res.status(200).json({
        updatedProfile,
      });
    }

    // const reponse = await cloudinary.v2.uploader.upload();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
});
module.exports = router;
