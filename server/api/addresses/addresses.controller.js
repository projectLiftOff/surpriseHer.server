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
  let createdAddressesCount = 0
  function createAddress (address) {
    Addresses.create(address, error => {
      createdAddressesCount = createdAddressesCount + 1
      if (error) {
        log.error("addresses.create query failed", {error, address})
        res.status(httpStatus["Bad Request"].code).send(req.body)
      } else {
        log.info("addresses.create query was successful")
        if (createdAddressesCount === req.body.length) {
          res.status(httpStatus.OK.code).send(req.body)
        }
      }
    })
  }
  req.body.forEach(createAddress)
}
