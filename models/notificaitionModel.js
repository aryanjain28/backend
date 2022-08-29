const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      required: false,
      default: "",
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    body: {
      type: String,
      required: false,
      default: "",
    },
    details: {
      type: {},
      required: false,
    },
    for: {
      type: {},
      required: false,
      default: "",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false, expireAfterSeconds: 60 * 60 * 24 }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
