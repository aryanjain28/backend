const express = require("express");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const {
    sendSms,
    sendToMultipleUsers
} = require("../controllers/communicationController");
const router = express.Router();

router.post("/sms",protect,checkAccess,sendSms);
router.post("/multipleSms",protect,checkAccess,sendToMultipleUsers);


module.exports = router;
