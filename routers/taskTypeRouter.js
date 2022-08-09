const express = require("express");
const {
  createTaskType,
  deleteTaskType,
} = require("../controllers/taskTypeController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/taskType/create", protect, checkAccess, createTaskType);
router.delete("/taskType/delete", protect, checkAccess, deleteTaskType);

module.exports = router;
