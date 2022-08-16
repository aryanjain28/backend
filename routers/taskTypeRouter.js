const express = require("express");
const {
  createTaskType,
  deleteTaskType,
  getTaskTypes,
} = require("../controllers/taskTypeController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getTaskTypes);
router.post("/taskType/create", protect, checkAccess, createTaskType);
router.delete("/taskType/delete", protect, checkAccess, deleteTaskType);

module.exports = router;
