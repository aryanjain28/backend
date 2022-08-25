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
    pincode: {
      type: Number,
      required: true,
      length: 6,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
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
    gstIn: {
      type: String,
      required: false,
      default: null,
      length: 15,
    },
    businessName: {
      type: String,
      required: true,
    },
    entities: {
      type: [String],
      required: false,
      default: [],
    },
    registrationDate: {
      type: Date,
      required: false,
      default: null,
    },
    legalName: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: false,
      default: null,
    },
    taxpayerType: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TaxPayerType",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincodeRef: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "DistrictDetails",
    },
    primaryMobile: {
      type: String,
      required: true,
    },
    primaryEmail: {
      type: String,
      required: false,
      default: null,
    },
    secondaryMobile: {
      type: String,
      required: false,
      default: null,
    },
    gstUsername: {
      type: String,
      required: false,
      default: null,
    },
    gstPassword: {
      type: String,
      required: false,
      default: null,
    },
    businessConstitution: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: "ConstitutionOfBusiness",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    taskTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: "TaskType",
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false }
).set("toJSON", {
  virtuals: true,
  versionKey: false,
});

const Client = mongoose.model("Client", clientSchema);
const TaxPayerType = mongoose.model("TaxPayerType", taxpayerTypeSchema);
const DistrictDetails = mongoose.model("DistrictDetails", pincodeSchema);
const ConstitutionOfBusiness = mongoose.model(
  "ConstitutionOfBusiness",
  constitutionOfBusinessSchema
);
module.exports = {
  Client,
  TaxPayerType,
  DistrictDetails,
  ConstitutionOfBusiness,
};
