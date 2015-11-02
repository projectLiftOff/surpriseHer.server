const Users = require("./users.query.js")
const Addresses = require("../addresses/addresses.query.js")
const payments = require("../payments/payments.controller.js")
const async = require("async")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")

exports.getAll = (req, res) => {
  async.waterfall([Users.getAll],
    (error, users) => {
      if (error) {
        log.error("Users.getAll query failed", {error})
        res.status(httpStatus["Bad Request"].code).send(error)
        return
      }
      log.info("Users.getAll query was successful")
      res.status(httpStatus.OK.code).send(users)
    }
  )
}

function createUser (data, callback) { // data: {user, addresses, payments}
  Users.create(data.user, (error, results) => {
    if (error) { return callback({message: "createUser error", error, user: data.user}) }
    data.user_id = results.insertId
    log.debug("created user", data.user)
    return callback(null, data)
  })
}

function addAddresses (data, callback) {
  const pendingQueries = {count: 0}
  data.addresses.forEach(address => {
    pendingQueries.count = pendingQueries.count + 1
    address.user_id = address.user_id || data.user_id
    Addresses.create(address, error => {
      if (error) { return callback({message: "address create failed", error, address}) }
      pendingQueries.count = pendingQueries.count - 1
      if (pendingQueries.count === 0) {
        log.debug("created addresses for user", data.user.user_id, data.addresses)
        return callback(null, data)
      }
    })
  })
}

function addBraintreeCustomer (data, callback) {
  payments.createCustomer(data.payments.nonce, (error, customerId) => {
    if (error) { return callback({message: "addBraintreeCustomer error", error}) }
    log.debug("created Braintree customer", customerId, "for user", data.user_id)
    data.user.braintree_id = customerId
    return callback(null, data)
  })
}

function markCompleted (data, callback) {
  data.user.registration_complete = 1
  callback(null, data)
}

function updateUser (data, callback) {
  return Users.update([data.user, data.user_id], error => {
    if (error) { return callback({message: "user update failed", error, user: data.user, user_id: data.user_id}) }
    log.debug("updated user", data.user, data.user_id)
    return callback(null, data)
  })
}

exports.createIncomplete = (req, res) => {
  const data = {user: {phone: req.body.phone, tos: req.body.tos, registration_complete: 0}}
  createUser(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

exports.createComplete = (req, res) => {
  async.seq(markCompleted, createUser, addAddresses, addBraintreeCustomer, updateUser)(req.body, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

exports.finishRegistration = (req, res) => {
  const data = req.body
  data.user_id = req.params.id
  async.seq(markCompleted, addAddresses, addBraintreeCustomer, updateUser)(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}
