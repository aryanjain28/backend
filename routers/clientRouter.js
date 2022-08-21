const express = require("express");
const {
  getAllClients,
  createClient,
  getClientDetails,
  deleteClient,
} = require("../controllers/cleintController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllClients);
router.get("/client/:id", protect, getClientDetails);
router.post("/client", protect, checkAccess, createClient);
router.delete("/client/:id", protect, checkAccess, deleteClient);

module.exports = router;
