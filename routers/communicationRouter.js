const express = require("express");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const {
    sendSms
} = require("../controllers/communicationController");
const router = express.Router();

router.post("/sms",protect,checkAccess,sendSms);


module.exports = router;
