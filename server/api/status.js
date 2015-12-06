const log = require("../config/log.js")
const httpStatus = require("../../httpStatuses.json")
const express = require("express")
const router = express.Router() // eslint-disable-line new-cap

function queryDbStatus (callback) {
  global.Db.query("SELECT * FROM users WHERE id = 0;", null, callback)
}

function getStatus (req, res) {
  queryDbStatus(error => {
    if (error) {
      const errorMessage = {message: "queryDbStatus failed", error}
      log.error(errorMessage)
      res.sendStatus(httpStatus["Internal Server Error"].code)
    } else {
      log.debug("queryDbStatus was successful")
      res.sendStatus(httpStatus.OK.code)
    }
  })
}

router.get("/", getStatus)

module.exports = router
