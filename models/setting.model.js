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
    tosAccepted: {
      type: "Boolean",
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", SettingSchema);
