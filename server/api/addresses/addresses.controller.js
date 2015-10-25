const Addresses = require("./addresses.query.js")
const async = require("async")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")

exports.getAll = (req, res) => {
  async.waterfall([Addresses.getAll],
    (error, addresses) => {
      if (error) {
        log.error("addresses.getAll query failed", {error})
        res.status(httpStatus["Bad Request"].code).send(addresses)
        return
      }
      log.info("addresses.getAll query was successful")
      res.status(httpStatus.OK.code).send(addresses)
    }
  )
}

exports.create = (req, res) => {
  const inserts = req.body.map(address => { Addresses.create.bind(null, address) })
  async.parallel(inserts, (error, addresses) => {
    if (error) {
      log.error("addresses.create query failed", {error})
      res.status(httpStatus["Bad Request"].code).send(addresses)
      return
    }
    log.info("addresses.create query was successful")
    res.status(httpStatus.OK.code).send(addresses)
  })
}
