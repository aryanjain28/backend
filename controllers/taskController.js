const mongoose = require("mongoose");
const asynHandler = require("express-async-handler");
const { Task, TaskType } = require("../models/taskModel");
const { Client } = require("../models/clientModel");
const User = require("../models/userModel");

// get single task details
const getTask = asynHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.find({ _id: mongoose.Types.ObjectId(taskId) });
  if (task) {
    const { taskTypeId, clientId, assigneeId } = task[0];

    const taskType = await TaskType.findOne({ _id: taskTypeId });
    const client = await Client.findOne({ _id: clientId });
    const user = await User.findOne({ _id: assigneeId }).select("-password");

    res.status(200).json({
      status: 200,
      message: "Task details fetched successfully.",
      data: { task: task[0], taskType, client, assignee: user },
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Something went wrong.",
    });
  }
});

// get all tasks
const getAllTasks = asynHandler(async (req, res) => {
  const tasks = await Task.find();
  if (tasks) {
    res.status(200).json({
      status: 200,
      message: "All tasks.",
      data: tasks,
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Something went wrong.",
    });
  }
});

// create tasks
const createNewTask = asynHandler(async (req, res) => {
  const { taskName, clientId, status, taskTypeId, assigneeId, taskStartData } =
    req.body.data;

  if (
    !taskName ||
    !clientId ||
    !taskTypeId ||
    !assigneeId ||
    !status ||
    !taskStartData
  ) {
    res
      .status(400)
      .json({ status: 400, message: "Please fill the required fields." });
    throw new Error("Please fill the required fields.");
  }

  //   Create new task
  const task = await Task.create({
    ...req.body.data,
    clientId: mongoose.Types.ObjectId(clientId),
    taskTypeId: mongoose.Types.ObjectId(taskTypeId),
    assigneeId: mongoose.Types.ObjectId(assigneeId),
    createdBy: req.user._id,
    createdAt: new Date(),
  });
  if (task) {
    // Add to assignee's notifications
    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(assigneeId) },
      {
        $push: {
          tasks: {
            isNew: true,
            taskId: task._id,
            createdAt: task.createdAt,
            createdBy: task.createdBy,
          },
        },
      }
    );

    res.status(201).json({
      status: 201,
      message: "Task Created Successfully",
      data: {
        _id: task.id,
        ...req.body.data,
      },
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Task." });
    throw new Error("Invalid Task.");
  }
});

// update task
const updateTask = asynHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(taskId),
    },
    { ...req.body.data, updatedBy: req.user._id, updatedAt: new Date() },
    { new: true }
  );

  if (task) {
    res.status(200).json({
      status: 200,
      message: "Task updated successfully.",
      data: task,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "Task not found. Invalid task-ID.",
    });
  }
});

// delete task
const deleteTask = asynHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findOneAndDelete({
    _id: mongoose.Types.ObjectId(taskId),
  });

  if (task) {
    res.status(200).json({
      status: 200,
      message: "Task deleted successfully.",
      data: task,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "Task not found. Invalid task-ID.",
    });
  }
});

module.exports = {
  getAllTasks,
  getTask,
  createNewTask,
  updateTask,
  deleteTask,
};
