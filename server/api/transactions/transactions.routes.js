const express = require("express")
const controller = require("./transactions.controller")
const router = express.Router() // eslint-disable-line new-cap

// TODO: validate that request is from twilio
router.post("/", controller.create)

module.exports = router
