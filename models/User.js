const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    type: String,
    unique: true,
  },
  account: {
    username: {
      type: String,
      require: true,
    },
    veganStatus: {
      type: String,
      require: true,
    },
    birth: {
      type: Number,
      require: true,
    },
    newsletter: {
      type: Boolean,
      require: true,
    },
    avatar: String,
    location: {
      lat: {
        type: Number,
        require: true,
      },
      lng: {
        type: Number,
        require: true,
      },
    },
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
