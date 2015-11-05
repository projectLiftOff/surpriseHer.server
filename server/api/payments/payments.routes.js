const gateway = require("./payments.controller").gateway
const express = require("express")
const controller = require("./payments.controller")
const router = express.Router() // eslint-disable-line new-cap

// router.post("/", controller.create)

router.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}, (error, response) => {
    if (error) { throw error }
    res.send(response.clientToken)
  })
})

router.post("/create_customer", controller.createCustomer)

router.post("/checkout", controller.checkout)

module.exports = router
