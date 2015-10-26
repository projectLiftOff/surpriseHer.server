const Subscriptions = require("./subscriptions.query.js")
const async = require("async")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")

exports.getAll = (req, res) => {
  async.waterfall([Subscriptions.getAll],
    (error, subscriptions) => {
      if (error) {
        log.error("subscriptions.getAll query failed", {error})
        res.status(httpStatus["Bad Request"].code).send(subscriptions)
        return
      }
      log.info("subscriptions.getAll query was successful")
      res.status(httpStatus.OK.code).send(subscriptions)
    }
  )
}

exports.create = (req, res) => {
  async.waterfall([Subscriptions.create.bind(null, req.body.subscription)],
  (error, subscriptions) => {
    if (error) {
      log.error("subscriptions.create query failed", {error})
      res.status(httpStatus["Bad Request"].code).send(subscriptions)
      return
    }
    log.info("subscriptions.create query was successful")
    res.status(httpStatus.OK.code).send(subscriptions)
  }
)
}

exports.update = (req, res) => {
  // TODO: validate req
  async.waterfall([Subscriptions.update.bind(null, req)],
    (error, subscriptions) => {
      if (error) {
        log.error("subscriptions.update query failed", {error})
        res.status(httpStatus["Bad Request"].code).send(subscriptions)
        return
      }
      log.info("subscriptions.update query was successful")
      res.status(httpStatus.OK.code).send(subscriptions)
    }
  )
}
