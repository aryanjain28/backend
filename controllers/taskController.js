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
    .populate("type", "-__v -createdAt -createdBy -updatedAt")
    .populate({ path: "client", populate: { path: "client", model: "Client" } })
    .populate(
      "assignee",
      "-password -notifications -tasks -createdAt -updatedAt"
    );

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
    .populate(
      "createdBy",
      "-__v -notifications -tasks -password -createdAt -updatedAt -role"
    )
    .populate(
      "assignee",
      "-__v -notifications -tasks -password -createdAt -updatedAt"
    )
    .populate({
      path: "client",
      populate: { path: "client", model: "Client", entity: 0 },
    })
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
    .populate(
      "assignee",
      "-__v -notifications -tasks -password -createdAt -updatedAt"
    )
    .populate("assignedBy", { fName: 1, lName: 1, email: 1 })
    .populate("type", "-__v -createdAt -createdBy -updatedAt")
    .populate("createdBy", { fName: 1, lName: 1, email: 1 })
    .populate({
      path: "client",
      populate: { path: "client", model: "Client" },
    });

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

// get clients completed task details
const getClientsTasksDetails = asynHandler(async (req, res) => {
  const { id: clientId } = req.params;
  const clientTasks = await Task.find(
    {
      "client.id": mongoose.Types.ObjectId(clientId),
    },
    { type: 1, startDate: 1, approvedAt: 1, totalAmount: 1, paidAmount: 1 }
  ).populate("type", { parentId: 1, childName: 1 });

  if (clientTasks) {
    const modClientTasks = clientTasks.map((clientTask) => {
      let clientJson = clientTask.toJSON();
      clientJson = {
        ...clientJson,
        taskTypeChildName: clientJson.type.childName,
        taskTypeParentId: clientJson.type.parentId,
      };
      delete clientJson.type;
      return clientJson;
    });
    res.status(200).json({
      message: "Fetched clients' tasks successfully.",
      data: modClientTasks,
      status: 200,
    });
  } else {
    res.status(400).json({
      message: "Failed to fetch clients tasks.",
      status: 400,
    });
  }
});

// create tasks
const createNewTask = asynHandler(async (req, res) => {
  const {
    name,
    type,
    comments,
    assignee,
    startDate,
    client,
    entity,
    endDate,
    totalAmount,
    paidAmount,
    balanceAmount,
  } = req.body.data;

  if (!name || !type || !assignee || !startDate) {
    res
      .status(400)
      .json({ status: 400, message: "Please fill the required fields." });
    throw new Error("Please fill the required fields.");
  }

  const newTaskObj = {
    // required fields
    name,
    type,
    assignee,
    startDate,
    // optional fields
    isNew: true,
    status: "PENDING",
    ...(client && { client: { id: client } }),
    ...(client && entity && { client: { id: client, entity } }),
    ...(endDate && { endDate }),
    ...(totalAmount && { totalAmount }),
    ...(paidAmount && { paidAmount }),
    ...(balanceAmount && { balanceAmount }),
    ...(comments && { comments }),
    isApproved: false,
    updatedOn: new Date(),
    updatedBy: req.user._id,
    createdAt: new Date(),
    createdBy: req.user._id,
    assignedAt: new Date(),
    assignedBy: req.user._id,
  };

  //   Create new task
  const task = await Task.create(newTaskObj);
  if (task) {
    res.status(201).json({
      status: 201,
      message: "Task Created Successfully",
      data: {
        _id: task.id,
        ...newTaskObj,
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
    comments,
    taskTypeId,
    status,
    startDate,
    endDate,
    totalAmount,
    paidAmount,
    balanceAmount,
    assigneeId,
    clientId,
    clientEntity,
  } = req.body.data;

  const isAdmin = req.user.role === "ADMIN";

  const updateBody = {
    ...(isAdmin && name && { name }),
    ...(isAdmin && taskTypeId && { type: taskTypeId }),
    ...(isAdmin && startDate && { startDate }),
    ...(isAdmin && endDate && { endDate }),
    ...(isAdmin && assigneeId && { assignee: assigneeId }),
    ...(status && { status }),
    ...(comments && { comments }),
    ...(totalAmount && { totalAmount }),
    ...(paidAmount && { paidAmount }),
    ...(balanceAmount && { balanceAmount }),
    ...(clientId && { client: { client: clientId } }),
    ...(clientId &&
      clientEntity && { client: { client: clientId, entity: clientEntity } }),
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
  getClientsTasksDetails,
  createNewTask,
  updateTask,
  deleteTask,
  getUsersTasks,
  getDashboardDetails,
};
