const mongoose = require("mongoose");
const asynHandler = require("express-async-handler");
const { Task, TaskType } = require("../models/taskModel");
const { Client } = require("../models/clientModel");
const User = require("../models/userModel");

// get single task details
const getTask = asynHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.find({
    _id: mongoose.Types.ObjectId(taskId),
  })
    .populate("type", "-createdBy")
    .populate("client")
    .populate("assignee", "-password -notifications -tasks");
  if (task) {
    res.status(200).json({
      status: 200,
      message: "Task details fetched successfully.",
      data: task,
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
  const tasks = await Task.find()
    .populate("createdBy", "-__v -notifications -tasks -password")
    .populate("assignee", "-__v -notifications -tasks -password")
    .populate("client")
    .populate("type", "-__v -createdAt -createdBy -updatedAt")
    .select("-__v");

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

// get my tasks
const getUsersTasks = asynHandler(async (req, res) => {
  const tasks = await Task.find({
    assignee: mongoose.Types.ObjectId(req.user._id),
  })
    .select("-assignee")
    .populate("assignedBy", { fName: 1, lName: 1, email: 1 })
    .populate("type", { taskTypeName: 1 })
    .populate("client", { clientName: 1, entity: 1 })
    .populate("createdBy", { fName: 1, lName: 1, email: 1 });

  if (tasks) {
    res.status(200).json({
      message: "Fetched users' tasks successfully.",
      data: tasks,
      status: 200,
    });
  } else {
    res.status(400).json({
      message: "Failed to fetch users tasks.",
      status: 400,
    });
  }
});

// create tasks
const createNewTask = asynHandler(async (req, res) => {
  const { name, type, status, client, assignee, startDate } = req.body.data;

  if (!name || !client || !type || !assignee || !status || !startDate) {
    res
      .status(400)
      .json({ status: 400, message: "Please fill the required fields." });
    throw new Error("Please fill the required fields.");
  }

  //   Create new task
  const task = await Task.create({
    ...req.body.data,
    client: mongoose.Types.ObjectId(client),
    type: mongoose.Types.ObjectId(type),
    assignee: mongoose.Types.ObjectId(assignee),
    createdBy: req.user._id,
    createdAt: new Date(),
    assignedBy: req.user._id,
    assignedAt: new Date(),
    isNew: true,
  });
  if (task) {
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
  const {
    name,
    type,
    status,
    startDate,
    endDate,
    totalAmount,
    paidAmount,
    balanceAmount,
    assigneeId,
    clientId,
  } = req.body.data;

  const isAdmin = req.user.role === "ADMIN";

  const updateBody = {
    ...(isAdmin && name && { name }),
    ...(isAdmin && type && { type }),
    ...(isAdmin && startDate && { startDate }),
    ...(isAdmin && endDate && { endDate }),
    ...(isAdmin && assigneeId && { assignee: assigneeId }),
    ...(status && { status }),
    ...(totalAmount && { totalAmount }),
    ...(paidAmount && { paidAmount }),
    ...(balanceAmount && { balanceAmount }),
    ...(clientId && { client: clientId }),
  };

  const task = await Task.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(taskId),
    },
    { ...updateBody, updatedBy: req.user._id, updatedAt: new Date() },
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

// dashboard API
const getDashboardDetails = asynHandler(async (req, res) => {
  const condition =
    req.user.role === "ADMIN"
      ? {}
      : { _id: mongoose.Types.ObjectId(req.user._id) };

  const data = {
    APPROVED: 0,
    COMPLETED: 0,
    PENDING: 0,
  };
  const tasks = await Task.find(condition);
  tasks.forEach((task) => (data[task.status] += 1));
  res.json({
    data,
    status: 200,
    message: "Fetched task-dashboard details successfully",
  });
});

module.exports = {
  getAllTasks,
  getTask,
  createNewTask,
  updateTask,
  deleteTask,
  getUsersTasks,
  getDashboardDetails,
};
