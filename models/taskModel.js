const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    tasParentType: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "taskParentSchema",
    },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const taskParentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
  },
}).set("toJSON", {
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
    client: {
      client: { type: Schema.Types.ObjectId, required: false, ref: "Client" },
      entity: { type: Schema.Types.String, required: false },
    },
    assignee: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    assignedAt: Schema.Types.Date,
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date, required: false },
    // totalAmount: { type: String, required: false },
    paidAmount: { type: String, required: false },
    amount : { type: Number, required: true},
    // balanceAmount: { type: String, required: false },
    isApproved: { type: Boolean, required: false },
    updatedOn: { type: Schema.Types.Date, required: false },
    updatedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    approvedAt: { type: Schema.Types.Date, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Schema.Types.Date, required: true },
    taskParent: {
      type : Schema.Types.ObjectId,
      required: false,
      ref: "TaskParent"
    }
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const Task = mongoose.model("Task", taskSchema);
const TaskType = mongoose.model("TaskType", taskTypeSchema);
const TaskParent = mongoose.model("TaskParent", taskParentSchema);
module.exports = { Task, TaskType };
