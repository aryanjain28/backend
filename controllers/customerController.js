const { default: mongoose } = require("mongoose");
const Customer = require("../models/customerModel");

const getCustomers = (req, res) => {
  Customer.find()
    .then((customers) => {
      const data = customers.map((c) => ({ ...c._doc, id: c._id }));
      res.status(200).json({ success: true, data });
    })
    .catch((error) => res.status().json({ success: false }));
};

const getCustomerDetails = (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      const data = { ...customer._doc, id: customer._id };
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res.status(404).json({ success: false });
    });
};

const saveCustomerDetails = (req, res) => {
  const customer = new Customer(req.body.data);
  customer
    .save()
    .then((result) => res.status(200).json({ success: true, data: req.body }))
    .catch((error) =>
      res
        .status(400)
        .json({ success: false, errorMsg: `${error.name}: ${error.message}` })
    );
};

const updateCustomerDetails = (req, res) => {
  const customerId = mongoose.Types.ObjectId(req.params.id);
  Customer.updateOne({ _id: customerId }, req.body.data)
    .then((customer) =>
      res.status(200).json({ success: true, data: req.body.data })
    )
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, errorMsg: `${error.name}: ${error.message}` })
    );
};

const deleteCustomerDetails = (req, res) => {
  const customerId = mongoose.Types.ObjectId(req.params.id);
  Customer.deleteOne({ _id: customerId })
    .then((customer) => res.status(200).json({ success: true }))
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, errorMsg: `${error.name}: ${error.message}` })
    );
};

module.exports = {
  getCustomers,
  getCustomerDetails,
  saveCustomerDetails,
  updateCustomerDetails,
  deleteCustomerDetails,
};
