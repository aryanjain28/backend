const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { Task } = require("../models/taskModel");

// Get Users Notifications
const getNotifications = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const notifications = await Task.find({
    assignee: mongoose.Types.ObjectId(userId),
  })
    .select({
      id: 1,
      name: 1,
      type: 1,
      notification: 1,
      updatedBy: 1,
      updatedAt: 1,
    })
    .populate("updatedBy", { fName: 1, lName: 1 })
    .populate("type");

  const modNotifications = notifications
    .filter(({ notification }) => Boolean(notification))
    .map(({ id, name, type, notification, updatedAt, updatedBy }) => ({
      id,
      name,
      type: type.childName,
      parentId: type.parentId,
      notification,
      updatedAt,
      updatedBy: `${updatedBy.fName || ""} ${updatedBy.lName || ""}`,
    }));

  console.log(modNotifications);

  if (notifications) {
    res.status(200).json({
      status: 200,
      data: modNotifications || [],
      message: "Fetched task notifications successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Something went wrorng." });
  }
});

// Remove Notifications
const removeNotifications = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  await Task.updateMany(
    { assignee: mongoose.Types.ObjectId(userId) },
    { $unset: { notification: 1 } }
  )
    .then((updatedData) => {
      res.status(200).json({
        status: 200,
        data: updatedData,
        message: "Notification deleted successfully.",
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: 400,
        data: err,
        message: "Failed to update notification.",
      });
    });
});

module.exports = {
  getNotifications,
  removeNotifications,
};
