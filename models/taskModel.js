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
    taskName: { type: String, required: true },
    taskTypeId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, required: true },
    assigneeId: { type: Schema.Types.ObjectId, required: true },
    taskStartData: { type: Schema.Types.Date, required: true },
    taskEndData: { type: Schema.Types.Date, required: false },
    totalAmount: { type: String, required: false },
    paidAmount: { type: String, required: false },
    balanceAmount: { type: String, required: false },
    isApproved: { type: Boolean, required: false },
    updatedOn: { type: Schema.Types.Date, required: false },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    approvedBy: { type: Schema.Types.ObjectId, required: false },
    approvedAt: { type: Schema.Types.Date, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Schema.Types.Date, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
const TaskType = mongoose.model("TaskType", taskTypeSchema);
module.exports = { Task, TaskType };
