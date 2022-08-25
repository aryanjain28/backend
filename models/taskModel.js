const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskTypeSchema = new Schema(
  {
    parentId: {
      type: Number,
      required: true,
    },
    childName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const taskSchema = new Schema(
  {
    isNew: { type: Boolean, required: false },
    name: { type: String, required: true },
    type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TaskType",
    },
    status: { type: String, required: true },
    comments: { type: String, required: false },
    client: { type: Schema.Types.ObjectId, required: false, ref: "Client" },
    clientEntity: { type: Schema.Types.String, required: false, default: "" },
    assignee: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    assignedAt: Schema.Types.Date,
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date, required: false },
    paidAmount: { type: Number, required: false, default: 0 },
    totalAmount: { type: Number, required: true },
    isApproved: { type: Boolean, required: false },
    updatedOn: { type: Schema.Types.Date, required: false },
    updatedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedAt: { type: Schema.Types.Date, required: false, default: null },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Schema.Types.Date, required: true },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const Task = mongoose.model("Task", taskSchema);
const TaskType = mongoose.model("TaskType", taskTypeSchema);
module.exports = { Task, TaskType };
