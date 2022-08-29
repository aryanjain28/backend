const express = require("express");
const {
  createNewTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
  getUsersTasks,
  getClientsTasksDetails,
} = require("../controllers/taskController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllTasks);
router.get("/task/:taskId", protect, getTask);
router.get("/myTasks", protect, getUsersTasks);
router.get("/:id", protect, getClientsTasksDetails);
router.post("/task/create", protect, checkAccess, createNewTask);
router.patch("/task/:taskId", protect, updateTask);
router.delete("/task/:taskId", protect, checkAccess, deleteTask);

module.exports = router;
