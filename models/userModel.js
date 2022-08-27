const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: String,
    dob: Date,
    gender: String,

    /*    Admin : 
      1. New User: New User is added - assign tasks and role.
      2. Task status: task is blocked, completed, approval.

      User: 
      1. Task status: task is approved, comment is added.
    */
    notifications: [
      {
        notType: String,
        refId: Schema.Types.ObjectId,
        createdAt: Schema.Types.Date,
        createdBy: Schema.Types.ObjectId,
      },
    ],
    role: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false
    }
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
