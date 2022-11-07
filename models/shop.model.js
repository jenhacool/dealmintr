const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  shop: {
    type: "String",
    required: true,
  },
  token: {
    type: "String",
  },
  plan: {
    type: "String",
  },
  charge_id: {
    type: "String",
    default: ""
  },
  installed: {
    type: "Boolean",
    default: false
  }
});

module.exports = mongoose.model("Shop", shopSchema);
