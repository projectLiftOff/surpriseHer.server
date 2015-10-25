const express = require("express")
const controller = require("./users.controller")
// todo var auth = ???

const router = express.Router() // eslint-disable-line new-cap

router.get("/", controller.getAll)
router.post("/", controller.create)
router.put("/:id", controller.finishRegistration)

module.exports = router
