const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
var AWS = require('aws-sdk');


const sendSms = asyncHandler(async (req, res) => {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        const response = { "Status": "Failure", "Details": "OTP for phone is not available right now" }
        return res.status(503).send(response)
    }
    const { phone_number, message } = req.body.data;

    if (!phone_number) {
        const response = { "Status": "Failure", "Details": "Phone Number not provided" }
        return res.status(400).send(response)
    }
    if (!type) {
        const response = { "Status": "Failure", "Details": "Type not provided" }
        return res.status(400).send(response)
    }

    var params = {
        Message: message,
        PhoneNumber: phone_number
    };

    //Send the params to AWS SNS using aws-sdk
    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    //Send response back to the client if the message is sent
    publishTextPromise.then(
        function (data) {
            return res.send({ "Status": "Success", "verification_key": encoded });
        }).catch(
            function (err) {
                return res.status(400).send({ "Status": "Failure", "Details": err });
            });
})


module.exports = {
    sendSms
}