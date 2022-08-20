const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxpayerTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const pincodeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
      length: 6
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true
    },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const constitutionOfBusinessSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gstin: {
      type: [String],
      required: true,
    },
    dateOfRegistration: {
      type: Date,
      required: true
    },
    legalName: {
      type: String,
      required: true
    },
    panNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    taxPayertype: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TaxPayerType",
    },
    city: {
      type: String,
      required: true
    },
    pincodeRef: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "DistrictDetails",
    },
    primaryMobile: {
      type: String,
      required: true
    },
    primaryEmail: {
      type: String,
      required: true,
    },
    secondaryMobile: {
      type: String,
      required: false,
    },
    secondaryEmail : {
      type: String,
      required: false,
    },
    gstusername: {
      type: String,
      required: false,
    },
    gstPassword: {
      type: String,
      required: false,
    },
    constOfBusiness: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ConstitutionOfBusiness",
    },


  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const Client = mongoose.model("Client", clientSchema);
const TaxPayerType = mongoose.model("TaxPayerType", taxpayerTypeSchema);
const DistrictDetails = mongoose.model("DistrictDetails", pincodeSchema);
const ConstitutionOfBusiness = mongoose.model("ConstitutionOfBusiness", constitutionOfBusinessSchema);
module.exports = { Client, TaxPayerType, DistrictDetails, ConstitutionOfBusiness};
