const asyncHandler = require("express-async-handler");
const { Client } = require("../models/clientModel");

// Get at clients
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({});
  if (clients) {
    res.status(200).json({
      status: 200,
      data: clients,
      message: "Fetched clients info successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Something went wrorng." });
  }
});

module.exports = {
  getAllClients,
};
