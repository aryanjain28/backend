const asyncHandler = require("express-async-handler");
const { Client } = require("../models/clientModel");
const { TaskType } = require("../models/taskModel");
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

module.exports = {
  getOptions,
};
