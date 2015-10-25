const express = require("express")
const controller = require("./transactions.controller")
const router = express.Router() // eslint-disable-line new-cap

// router.put("/:id", controller.update)
// router.get("/", controller.getAll)

// TODO: validate that reqest is from twilio
router.post("/", controller.create)

module.exports = router
