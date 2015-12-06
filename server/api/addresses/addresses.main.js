const express = require("express")
const controller = require("./addresses.controller")

const router = express.Router() // eslint-disable-line new-cap

router.get("/", controller.getAll)
router.post("/", controller.create)

module.exports = router
