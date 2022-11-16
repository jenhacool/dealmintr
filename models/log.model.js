const mongoose = require("mongoose");

constLoggSchema = mongoose.Schema(
  {
    variantId: {
      type: "String",
      required: true,
    },
    orderId: {
      type: "String",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
