const express = require("express");
const {
  getAllClients,
  createClient,
  getClientDetails,
  deleteClient,
  updateClient,
  getTaxpayerTypes,
} = require("../controllers/cleintController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllClients);
router.get("/client/:id", protect, getClientDetails);
router.get("/taxpayertypes", protect, getTaxpayerTypes);
router.post("/client", protect, checkAccess, createClient);
router.patch("/client/:id", protect, updateClient);
router.delete("/client/:id", protect, checkAccess, deleteClient);

module.exports = router;
