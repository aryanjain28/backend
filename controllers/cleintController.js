const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const {
  Client,
  TaxPayerType,
  DistrictDetails,
} = require("../models/clientModel");

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
      taskChildren: 1,
    })
    .populate("taxpayerType", "-createdBy");

  if (clients) {
    const modClients = clients.map((client) => {
      let clientJsonFormat = client.toJSON();
      const taskParentIds = [
        ...new Set(
          (clientJsonFormat.taskChildren || []).map((_) => _.parentId)
        ),
      ];

      clientJsonFormat = {
        ...clientJsonFormat,
        taxpayerTypeName: client.taxpayerType.name,
        taxpayerTypeId: client.taxpayerType.id,
        taskParentIds,
      };
      delete clientJsonFormat.taxpayerType;
      delete clientJsonFormat.taskChildren;
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
    .populate("pincodeRef")
    .select("-taskParents -taskChildren");

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

// Get Client Job Details
const getClientJobDetails = asyncHandler(async (req, res) => {
  const { id: clientId } = req.params;
  const client = await Client.findById(clientId, { taskChildren: 1 }).populate(
    "taskChildren.childId",
    "-parentId -createdBy -createdAt -updatedAt"
  );
  if (client) {
    let clientJson = client.toJSON();
    clientJson = {
      ...clientJson,
      taskChildren: clientJson.taskChildren.map((p) => {
        const updatedObj = {
          ...p,
          childName: p.childId.childName,
          childIdTemp: p.childId._id,
        };
        updatedObj.childId = updatedObj.childIdTemp;
        delete updatedObj.childIdTemp;
        return updatedObj;
      }),
    };
    res.status(200).json({
      status: 200,
      data: clientJson,
      message: "Client jobs details fetched successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Somthing went wrong." });
  }
});

// Get all tax payer types
const getTaxpayerTypes = asyncHandler(async (req, res) => {
  const taxpayerTypes = await TaxPayerType.find({}).select("-createdBy");

  if (taxpayerTypes) {
    res.status(200).json({
      status: 200,
      data: taxpayerTypes,
      message: "Taxpayer types fetched successfully.",
    });
  } else {
    res.status(400).json({ status: 400, message: "Somthing went wrong." });
  }
});

// Get all PINCODES
const getPincodes = asyncHandler(async (req, res) => {
  const pincodes = await DistrictDetails.find({});
  console.log(pincodes);
  if (pincodes) {
    res.status(200).json({
      status: 200,
      data: Object.fromEntries(
        pincodes.map((p) => [p.toJSON()._id, { ...p.toJSON() }])
      ),
      message: "Pincodes fetched successfully.",
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

// Update Client
const updateClient = asyncHandler(async (req, res) => {
  const { id: clientId } = req.params;
  const {
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

  const clientUpdateObj = {
    ...(gstIn && { gstIn }),
    ...(businessName && { businessName }),
    ...(entities && { entities }),
    ...(registrationDate && { registrationDate }),
    ...(legalName && { legalName }),
    ...(panNumber && { panNumber }),
    ...(taxpayerType && { taxpayerType }),
    ...(address && { address }),
    ...(city && { city }),
    ...(pincode && { pincodeRef: pincode }),
    ...(primaryMobile && { primaryMobile }),
    ...(secondaryMobile && { secondaryMobile }),
    ...(gstUsername && { gstUsername }),
    ...(gstPassword && { gstPassword }),
    ...(businessConstitution && { businessConstitution }),
    ...(businessActivity && { businessActivity }),
    ...(primaryEmail && { primaryEmail }),
    updatedAt: new Date(),
    updatedBy: req.user._id,
  };

  const client = await Client.findByIdAndUpdate(clientId, clientUpdateObj, {
    new: true,
  });

  if (client) {
    let clientJson = client.toJSON();
    clientJson = {
      ...clientJson,
      pincode: clientJson.pincodeRef,
    };
    delete clientJson.pincodeRef;
    res.status(201).json({
      status: 201,
      message: "Client Updated Successfully",
      data: clientJson,
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Client." });
    throw new Error("Invalid Client.");
  }
});

// Delete Client
const deleteClient = asyncHandler(async (req, res) => {
  const { id: clientId } = req.params;
  const client = await Client.findByIdAndDelete(clientId, { new: true });
  if (client) {
    res.status(201).json({
      status: 201,
      message: "Client Deleted Successfully",
      data: client,
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Client ID." });
    throw new Error("Invalid Client ID.");
  }
});

module.exports = {
  getAllClients,
  getClientDetails,
  getTaxpayerTypes,
  getClientJobDetails,
  getPincodes,
  createClient,
  updateClient,
  deleteClient,
};
