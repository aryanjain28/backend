const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    entity: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = { Client };
