const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    variantId: {
      type: "String",
      required: true,
    },
    orderId: {
      type: "String",
      required: true
    },
    symbol: {
      type: "String",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
