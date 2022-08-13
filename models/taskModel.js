const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskTypeSchema = new Schema(
  {
    taskTypeName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const taskSchema = new Schema(
  {
    isNew: Boolean,
    name: { type: String, required: true },
    type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TaskType",
    },
    status: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, required: true, ref: "Client" },
    assignee: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    assignedAt: Schema.Types.Date,
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date, required: false },
    totalAmount: { type: String, required: false },
    paidAmount: { type: String, required: false },
    balanceAmount: { type: String, required: false },
    isApproved: { type: Boolean, required: false },
    updatedOn: { type: Schema.Types.Date, required: false },
    updatedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedAt: { type: Schema.Types.Date, required: false },
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
