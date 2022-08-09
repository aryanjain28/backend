const express = require("express");
const {
  getCustomers,
  getCustomerDetails,
  saveCustomerDetails,
  updateCustomerDetails,
  deleteCustomerDetails,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerDetails);
router.post("/", saveCustomerDetails);
router.patch("/:id", updateCustomerDetails);
router.delete("/:id", deleteCustomerDetails);

module.exports = router;
