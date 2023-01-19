const mongoose = require("mongoose");

const SettingSchema = mongoose.Schema(
  {
    shop: {
      type: "String",
      required: true,
    },
    config: {
      type: "Object",
      required: true,
      default: {
        noResale: true
      }
    },
    settings: {
      type: "Object",
      required: true,
      default: []
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", SettingSchema);
