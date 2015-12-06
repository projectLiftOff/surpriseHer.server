const express = require("express")
const controller = require("./payments.controller")
const router = express.Router() // eslint-disable-line new-cap

router.get("/client_token", controller.generateToken)

router.post("/create_customer", controller.createCustomer)

module.exports = router
