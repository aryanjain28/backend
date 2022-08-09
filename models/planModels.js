const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema(
  {
    planDetails: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        validity: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
