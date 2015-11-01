"use strict"

const express = require("express")
const controller = require("./users.controller")

const router = express.Router() // eslint-disable-line new-cap

router.get("/", controller.getAll)
router.post("/incomplete", controller.createIncomplete)
router.post("/complete", controller.createComplete)
router.put("/:id", controller.finishRegistration)

module.exports = router
