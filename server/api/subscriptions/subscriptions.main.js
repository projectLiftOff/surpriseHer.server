const express = require("express")
const controller = require("./subscriptions.controller")
// todo var auth = ???

const router = express.Router() // eslint-disable-line new-cap

router.put("/:id", controller.update)
router.get("/", controller.getAll)
// router.post("/", controller.create)

module.exports = router
