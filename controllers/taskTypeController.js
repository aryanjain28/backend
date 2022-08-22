const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { TaskType } = require("../models/taskModel");

// create task-type
const createTaskType = asyncHandler(async (req, res) => {
  const { childName, parentId } = req.body.data;
  if (!childName || !parentId) {
    res
      .json(400)
      .status({ status: 400, message: "Task Name is a mandatory field." });
    throw new Error("Task Name is a mandatory field.");
  }

  const alreadyExists = await TaskType.findOne({ childName });
  if (alreadyExists) {
    res.status(400).json({
      status: 400,
      message: "Task Type already exists.",
      data: alreadyExists,
    });
    throw new Error("Task Type already exists.");
  }

  const taskType = await TaskType.create({
    parentId,
    childName,
    createdBy: req.user._id,
  });
  if (taskType) {
    res.status(200).json({
      status: 200,
      message: "Task Type create successfully.",
      data: taskType,
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Task Type." });
    throw new Error("Invalid Task Type.");
  }
});

// get taskTypes
const getTaskTypes = asyncHandler(async (req, res) => {
  const taskTypes = await TaskType.find({}).select(
    "-createdAt -createdBy -updatedAt -__v"
  );
  if (taskTypes) {
    res.status(200).json({
      status: 200,
      data: taskTypes.map((p) => p.toJSON()),
      message: "Fetched task types successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Something went wrorng." });
  }
});

// delete tasktype
const deleteTaskType = asyncHandler(async (req, res) => {
  const { taskId } = req.body.data;
  if (!taskId) {
    res.json(400).status({ status: 400, message: "Task ID is not provided." });
    throw new Error("Task ID is not provided.");
  }

  const taskType = await TaskType.deleteOne({
    _id: mongoose.Types.ObjectId(taskId),
  });

  if (taskType) {
    taskType.deletedCount > 0
      ? res.status(200).json({
          status: 200,
          message: "Task Type deleted successfully.",
          data: { _id: taskId, ...taskType },
        })
      : res.status(404).json({
          status: 404,
          message: "Requested Task Type Not Found",
          data: { _id: taskId, ...taskType },
        });
  } else {
    res
      .status(400)
      .json({ status: 400, message: "Cannot delete. Invalid Task Type." });
    throw new Error("Cannot delete. Invalid Task Type.");
  }
});

module.exports = {
  getTaskTypes,
  createTaskType,
  deleteTaskType,
};
