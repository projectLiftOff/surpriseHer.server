const Users = require("./users.query.js")
const Addresses = require("../addresses/addresses.query.js")
const payments = require("../payments/payments.controller.js")
// const Transactions = require("../transactions/transactions.query.js")
// const UsersServices = require("./users.services.js")
// const txtMessenger = require("../../services/twilio/twilio.main.js")

// const Gifts = require("../gifts/gifts.query.js")
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

exports.createIncomplete = (req, res) => {
  const userParams = {
    phone: req.body.phone,
    tos: req.body.tos,
    registration_complete: 0
  }
  Users.create(userParams, (error, results) => {
    if (error) {
      log.error("users.create error:", error, userParams)
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      log.info("users.create success", results, userParams)
      res.status(httpStatus.Created.code).send()
    }
  })
}

function createUser (data, callback) { // {user, addresses, payments}
  if (data.user) {
    data.user.registration_complete = 1
    return Users.create(data.user, (error, results) => {
      if (error) { return callback({message: "createUser error", error}) }
      const userId = results.insertId
      log.debug("created user", userId, data.user)
      return callback(null, {userId, addresses: data.addresses, nonce: data.payments.nonce})
    })
  } else {
    return callback({message: "no user data provided"})
  }
}

function addAddresses (data, callback) { // {userId, addresses, nonce}
  if (data.addresses) {
    const pendingQueries = {count: 0}
    data.addresses.forEach(address => {
      pendingQueries.count = pendingQueries.count + 1
      address.user_id = data.userId
      Addresses.create(address, error => {
        if (error) { return callback({message: "address create failed", error}) }
        pendingQueries.count = pendingQueries.count - 1
        if (pendingQueries.count === 0) {
          log.debug("created addresses for user", data.userId, data.addresses)
          return callback(null, data)
        } else {
          log.debug("waiting on", pendingQueries.count, "addresses to create")
        }
      })
    })
  } else {
    return callback({message: "no user data provided"})
  }
}

function addBraintreeCustomer (data, callback) {  // {userId, nonce}
  payments.createCustomer(data.nonce, (error, customerId) => {
    if (error) { return callback({message: "addBraintreeCustomer error", error}) }
    log.debug("created Braintree customer", customerId, "for user", data.userId)
    return Users.update([{braintree_id: customerId}, data.userId], err => {
      if (err) { return callback({message: "update user w braintree_id failed", err}) }
      log.debug("updated user", data.userId, "with braintree_id", customerId)
      return callback(null, data)
    })
  })
}

exports.createComplete = (req, res) => {
  async.seq(createUser, addAddresses, addBraintreeCustomer)(req.body, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

  /*
  const userParams = {
    phone: req.body.phone,
    tos: req.body.tos,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    dob: req.body.dob,
    registration_complete: 1
  }
  Users.create(userParams, (UsersCreateError, results) => {
    if (UsersCreateError) {
      log.error("users.create error:", UsersCreateError, userParams)
      res.status(httpStatus["Bad Request"].code).send(UsersCreateError)
    } else {
      log.info("users.create success", results, userParams)
      Gifts.afterSignUp((GiftsAfterSignUpError, gifts) => {
        if (GiftsAfterSignUpError) {
          log.error("Gifts.afterSignUp error:", GiftsAfterSignUpError, userParams)
          res.status(httpStatus["Bad Request"].code).send(GiftsAfterSignUpError)
        } else {
          // Send user first txt message with recurring gift options
          const message = UsersServices.constructSignUpGiftOptionsMessages(gifts)
          txtMessenger.send(userParams.phone, "4152148005", message, 0)
          res.status(httpStatus.Created.code).send()
        }
      })
    }
  })
}
*/
// exports.createComplete = function (req, res) {
  // async.seq(
  //   async.asyncify(prepareUsersCreateParams),
  //   Users.create,
  //   logUsersCreateResult,
  //   Gifts.afterSignUp,
  //   sendGiftsAfterSignUpResult
  // )

//   function sendGiftsAfterSignUpResult (error, results) {
//     log.debug("sendGiftsAfterSignUpResult")
//     if (error) {
//       log.error("Gifts.afterSignUp error:", error)
//       res.status(httpStatus["Bad Request"].code).send(error)
//     } else {
//       // Send user first txt message with recurring gift options
//       const message = UsersServices.constructSignUpGiftOptionsMessages(results)
//       // txtMessenger.send(userParams.phone, "4152148005", message, 0)
//       res.status(httpStatus.Created.code).send({message})
//     }
//   }
// }

// function prepareUsersCreateParams (req) {
//   log.debug("prepareUsersCreateParams")
//   return {
//     phone: req.body.phone,
//     tos: req.body.tos,
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.email,
//     dob: req.body.dob,
//     registration_complete: 1
//   }
// }
// function logUsersCreateResult (error, results) {
//   log.debug("logUsersCreateResult")
//   if (error) {
//     log.error("users.create error:", error)
//     // res.status(httpStatus["Bad Request"].code).send(UsersCreateError)
//   } else {
//     log.info("users.create success", results)
//   }
// }

// todo shouldn't need to use this many callbacks AND the async library…
// todo also shouldn't need to to error, error1, error2, error3, addresses, addresses2
exports.finishRegistration = (req, res) => {
  // TODO: this is an open api so ability to protect against re-updateing and update
  //          data that is not the customers
  // TODO: handle customer who waits a month before registering
  // TODO: data validation
  const userId = Number(req.params.id)

  function addAddresses (callback) {
    if (req.body.addresses) {
      const addressAdds = req.body.addresses.map(address => {
        address.user_id = userId
        return Addresses.create.bind(null, address)
      })
      return async.parallel(addressAdds, callback)
    } else {
      log.error("no address data provided")
      return res.status(httpStatus["Bad Request"].code).send({message: "no user data provided"})
    }
  }

  function updateUser (callback) {
    if (req.body.user) {
      req.body.user.registration_complete = 1
      return Users.update([req.body.user, userId], callback)
    } else {
      log.error("no user data provided")
      return res.status(httpStatus["Bad Request"].code).send({message: "no user data provided"})
    }
  }

  async.parallel([
    addAddresses,
    updateUser
  ], () => {
    // console.log("user finishRegistration callback", {arguments})
    res.sendStatus(httpStatus.Created.code)
  })
  // function processPendingTransaction (req, res) {
  //   Transactions.pendingUserRegistration((error, pendingTransactions) => {
  //     if (error) {
  //       log.error({message: "Users.finishRegistration errored on querying pendingTransactions", error})
  //       res.status(httpStatus["Bad Request"].code).send({registration: true, transaction: false})
  //     } else if (pendingTransactions.length === 0) {
  //       log.info("Users.finishRegistration successful and no pendingTransaction found")
  //       res.status(httpStatus.OK.code).send({registration: true, transaction: false})
  //     } else if (pendingTransactions.length > 0) {
  //       log.info("Users.finishRegistration successful and pendingTransaction found")
  //       res.status(httpStatus.OK.code).send({registration: true, transaction: true})
  //     } else {
  //       log.error("Users.finishRegistration query was successful and no pendingTransaction found")
  //       res.status(httpStatus["Bad Request"].code).send({message: "unexpected branching", pendingTransaction})
  //     }
  //   })
  // }
    // Save all user data and query for pending transaction of user
          // TODO: handle multiple pendingTransactions
      // TODO: charge amount....  charge was successful!
      // update transaction status, and address
        // const userShipping = [req.body.transaction.shipToAddressCode, userId]
        // async.waterfall([Addresses.ofUserAndCode.bind(null, userShipping)], (error2, addresses2) => {
        //   if (error2) {
        //     log.error("Users.finishRegistration - Addresses.ofUserAndCode query failed:", {error2})
        //     res.status(httpStatus["Internal Server Error"].code)
        //     return
        //   }
        //   const unfulfilledAddress = [{status: "unfulfilled", paid: 1}, addresses2[0].address_id]
        //   async.waterfall([Transactions.update.bind(null, unfulfilledAddress)], error3 => { // eslint-disable-line max-nested-callbacks
        //     if (error3) {
        //       log.error("Users.finishRegistration - Transactions.update query failed", {error3})
        //       res.status(httpStatus["Bad Request"].code).send(Users)
        //       return
        //     }
        //     log.info("Users.finishRegistration & Transactions.update query was successful")
        //     res.status(httpStatus.OK.code).send({registration: true, transaction: true})
        //   })
        // })
}
