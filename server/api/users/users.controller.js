const Users = require("./users.query.js")
const Addresses = require("../addresses/addresses.query.js")
const Transactions = require("../transactions/transactions.query.js")
const UsersServices = require('./users.services.js')

const Gifts = require('../gifts/gifts.query.js')
const async = require("async")
const log = require("../../config/log.js")
const twilio = require('twilio')
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

exports.create = (req, res) => {
  // Create User
  // TODO use ecma6 object deconstructor to evalute all params that are expected are in req.body
  req.body.registration_complete = 0 // eslint-disable-line camelcase
  const queryFunctions = [Users.create.bind(null, req.body)]
  async.waterfall(queryFunctions, (error, users) => {
    if (error) {
      log.error("Users.create query failed", {error})
      res.status(httpStatus["Bad Request"].code).send(users)
      return
    }
    log.info("Users.create query was successful")
    async.waterfall([ Gifts.afterSignUp ], function( error, gifts ){
      if( error ) {
        log.error( 'Gifts.afterSignUp query failed', {error: error} );
        res.status(400).send( error );
        return;
      }
      log.info( 'Gifts.afterSignUp query was successful' );

      const twiml = twilio.TwimlResponse();
      let message = UsersServices.constuctSignUpGiftOptionsMessages( gifts );
      twiml.message( message );
      res.set('Content-Type', 'text/xml');
      // C: Send user first txt message with first gift options
      // TxtMessenger.send( req.body.phone, '4152148005', message, 0 );
      res.status(200).send( twiml.toString() );
    })
    res.status(httpStatus.OK.code).send(users)
  })
}

// todo shouldn't need to use this many callbacks AND the async library…
// todo also shouldn't need to to error, error1, error2, error3, addresses, addresses2
exports.finishRegistration = (req, res) => {
  // TODO: this is an open api so ability to protect against re-updateing and update
  //          data that is not the customers
  // TODO: handle customer who waits a month before registering
  // TODO: data validation
  const userId = Number(req.params.id)
  // Prepare addresses
  const addressQueryFunctions = req.body.addresses.map(address => {
    address.user_id = userId // eslint-disable-line camelcase
    return Addresses.create.bind(null, address)
  })
  // Save all addresses to DB
  async.parallel(addressQueryFunctions, (error, addresses) => {
    if (error) {
      log.error("Users.finishRegistration.Addresses.create query failed", {error})
      res.status(httpStatus["Internal Server Error"].code).send(addresses)
      return
    }
    log.info("Users.finishRegistration.Addresses.create query was successful")
    // Prepare user data
    req.body.user.registration_complete = 1  // eslint-disable-line camelcase
    const userData = [req.body.user, userId]
    const userQueryFunctions = [
      Users.update.bind(null, userData),
      (results, callback) => {
        callback(null, userId)
      },
      Transactions.pendingUserRegistration
    ]
    // Save all user data and query for pending transaction of user
    async.waterfall(userQueryFunctions, (error1, pendingTransaction) => {
      if (error1) {
        log.error("Users.finishRegistration query failed:", {error1})
        res.status(httpStatus["Internal Server Error"].code)
        return
      } else if (pendingTransaction.length === 0) {
        log.info("Users.finishRegistration query was successful and no pendingTransaction found")
        res.status(httpStatus.OK.code).send({registration: true, transaction: false})
      } else if (pendingTransaction.length > 0) {
        // TODO: handle multiple pendingTransactions
        // TODO: charge amount....  charge was successful!
        // update transaction status, and address
        const userShipping = [req.body.transaction.shipToAddressCode, userId]
        async.waterfall([Addresses.ofUserAndCode.bind(null, userShipping)], (error2, addresses2) => {
          if (error2) {
            log.error("Users.finishRegistration - Addresses.ofUserAndCode query failed:", {error2})
            res.status(httpStatus["Internal Server Error"].code)
            return
          }
          const unfulfilledAddress = [{status: "unfulfilled", paid: 1}, addresses2[0].address_id]
          async.waterfall([Transactions.update.bind(null, unfulfilledAddress)], error3 => { // eslint-disable-line max-nested-callbacks
            if (error3) {
              log.error("Users.finishRegistration - Transactions.update query failed", {error3})
              res.status(httpStatus["Bad Request"].code).send(Users)
              return
            }
            log.info("Users.finishRegistration & Transactions.update query was successful")
            res.status(httpStatus.OK.code).send({registration: true, transaction: true})
          })
        })
      }
    })
  })
}
