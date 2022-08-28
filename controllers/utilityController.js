const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { Client } = require("../models/clientModel");
const { TaskType, Task } = require("../models/taskModel");
const User = require("../models/userModel");

// Get Combined Data from diff schemas
const getOptions = asyncHandler(async (req, res) => {
  const clients = await Client.find({}, { _id: 1, name: 1, entities: 1 });
  const taskTypes = await TaskType.find(
    {},
    { _id: 1, childName: 1, parentId: 1 }
  );
  const users = await User.find({}, { _id: 1, fName: 1, lName: 1, role: 1 });

  const data = { clients, taskTypes, users };

  if (data) {
    res.status(200).json({
      status: 200,
      data: data,
      message: "Fetched clients info successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Something went wrorng." });
  }
});

// dashboard API
const getDashboardDetails = asyncHandler(async (req, res) => {
  const condition =
    req.user.role === "ADMIN"
      ? {}
      : { _id: mongoose.Types.ObjectId(req.user._id) };

  const statusInitObj = {
    APPROVED: 0,
    COMPLETED: 0,
    PENDING: 0,
    INCOMPLETE: 0,
    INPROGRESS: 0,
  };

  const tasksFetched = await Task.aggregate([
    {
      $project: {
        _id: 0,
        status: 1,
        totalAmount: 1,
        paidAmount: 1,
        type: 1,
      },
    },
    {
      $group: {
        _id: { status: "$status" },
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
        paidAmount: { $sum: "$paidAmount" },
        types: { $push: "$type" },
      },
    },
    {
      $project: {
        totalAmount: 1,
        paidAmount: 1,
        status: "$_id.status",
        _id: 0,
        count: 1,
        types: 1,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
        paidAmount: { $sum: "$paidAmount" },
        status: { $push: { k: "$status", v: "$count" } },
        types: { $push: "$types" },
      },
    },
    {
      $project: {
        _id: 0,
        types: {
          $reduce: {
            input: "$types",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] },
          },
        },
        status: { $arrayToObject: "$status" },
        amount: {
          totalAmount: "$totalAmount",
          paidAmount: "$paidAmount",
          balanceAmount: { $subtract: ["$totalAmount", "$paidAmount"] },
        },
      },
    },
  ]);

  const data = await TaskType.populate(tasksFetched, {
    path: "types",
    select: { _id: 1, parentId: 1 },
  });

  const modTypes = (data[0]?.types || [])
    .map((p) => p.parentId)
    .reduce(
      (prev, curr) => ({
        ...prev,
        ...{ [curr]: prev[curr] ? prev[curr] + 1 : 1 },
      }),
      {}
    );

  res.json({
    data: { ...tasksFetched[0], types: modTypes },
    status: 200,
    message: "Fetched task-dashboard details successfully",
  });
});

module.exports = {
  getOptions,
  getDashboardDetails,
};
