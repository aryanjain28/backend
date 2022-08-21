const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { Client } = require("../models/clientModel");

// Get all clients
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({})
    .select({
      name: 1,
      gstIn: 1,
      panNumber: 1,
      primaryMobile: 1,
      businessName: 1,
      taxpayerType: 1,
    })
    .populate("taxpayerType", "-createdBy");

  if (clients) {
    const modClients = clients.map((client) => {
      let clientJsonFormat = client.toJSON();
      clientJsonFormat = {
        ...clientJsonFormat,
        taxpayerTypeName: client.taxpayerType.name,
        taxpayerTypeId: client.taxpayerType.id,
      };
      delete clientJsonFormat.taxpayerType;
      return clientJsonFormat;
    });

    res.status(200).json({
      status: 200,
      data: modClients,
      message: "Fetched clients info successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Something went wrorng." });
  }
});

// Get Single Client Details
const getClientDetails = asyncHandler(async (req, res) => {
  const { id: clientId } = req.params;
  const client = await Client.findById(clientId)
    .populate("taxpayerType")
    .populate("pincodeRef");

  if (client) {
    let clientJson = client.toJSON();
    clientJson = {
      ...clientJson,
      taxpayerTypeName: clientJson.taxpayerType.name,
      taxpayerTypeId: clientJson.taxpayerType.id,
      pincode: clientJson.pincodeRef.pincode,
      district: clientJson.pincodeRef.district,
      state: clientJson.pincodeRef.state,
    };
    delete clientJson.taxpayerType;
    delete clientJson.pincodeRef;

    res.status(200).json({
      status: 200,
      data: clientJson,
      message: "Client information fetched successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Somthing went wrong." });
  }
});

//Create Client
const createClient = asyncHandler(async (req, res) => {
  const {
    name,
    gstIn,
    businessName,
    entities,
    registrationDate,
    legalName,
    panNumber,
    taxpayerType,
    address,
    city,
    pincode,
    primaryMobile,
    primaryEmail,
    secondaryMobile,
    gstUsername,
    gstPassword,
    businessConstitution,
    businessActivity,
  } = req.body.data;

  if (
    !name ||
    !taxpayerType ||
    !legalName ||
    !businessName ||
    !address ||
    !city ||
    !pincode ||
    !primaryMobile
  ) {
    res
      .status(400)
      .json({ status: 400, message: "Please fill the required fields." });
    throw new Error("Please fill the required fields.");
  }

  const newClientObj = {
    // required fields
    name,
    taxpayerType,
    legalName,
    businessName,
    address,
    city,
    pincodeRef: pincode,
    primaryMobile,
    // optional fields - insert only if the field is present
    ...(gstIn && { gstIn }),
    ...(registrationDate && { registrationDate }),
    ...(businessConstitution && { businessConstitution }),
    ...(businessActivity && { businessActivity }),
    ...(entities && { entities }),
    ...(panNumber && { panNumber }),
    ...(secondaryMobile && { secondaryMobile }),
    ...(primaryEmail && { primaryEmail }),
    ...(gstUsername && { gstUsername }),
    ...(gstPassword && { gstPassword }),

    createdAt: new Date(),
    createdBy: req.user._id,
  };

  //   Create new Client
  const client = await Client.create(newClientObj);
  if (client) {
    res.status(201).json({
      status: 201,
      message: "Client Added Successfully",
      data: client,
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Client Details." });
    throw new Error("Invalid Client Details.");
  }
});

module.exports = {
  getAllClients,
  getClientDetails,
  createClient,
};
