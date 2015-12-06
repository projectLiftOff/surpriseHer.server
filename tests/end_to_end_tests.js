const test = require("tape").test
const request = require("supertest")
const sinon = require("sinon")
const httpStatus = require("./../httpStatuses.json")
const app = require("./../server/server.js")

function stripLastItem (list) { return list.slice(0, list.length - 1) }

test("new user does partial sign up on site", t => {
  // receive POST to users/incomplete
  const LogInfoStub = sinon.stub(global.Log, "info")
  const TwilioStub = sinon.stub(global.Twilio, "sendMessage", (_, callback) => { callback() })
  const DbStub = sinon.stub(global.Db, "query", (_, __, callback) => { return callback(null, {insertId: Infinity}) })
  t.plan(4) // eslint-disable-line no-magic-numbers
  request(app)
  .post("/users/incomplete")
  .send({
    phone: "9785052128",
    tos: 1
  })
  .end((_, data) => {
    t.equal(data.status, httpStatus.Created.code, "it responds successfully")
    t.deepEqual(
      LogInfoStub.args,
      [["Created user", {phone: "9785052128", registration_complete: 0, tos: 1}]],
      "it logs a user creation event"
    )
    t.deepEqual(
      TwilioStub.args.map(stripLastItem), // last arg is a callback
      [[{body: "Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:\n    \n>The Best F-ing Coffee! -- CODE: coffee\n>Love Me Some S\'more -- CODE: smores\n>Bubbly Bath -- CODE: bubbles\nPRODUCT URL\n    \nTo begin the order process, txt back the gift CODE and the day in month you\'d like us to ship (e.g 3 coffee, 18 smores)", from: "+15005550006", to: "+19785052128"}]],
      "it sends a text"
    )
    t.deepEqual(
      DbStub.args.map(stripLastItem), // last arg is a callback
      [["INSERT INTO users SET ?", {phone: "9785052128", registration_complete: 0, tos: 1}]],
      "it adds a user to the db"
    )
    LogInfoStub.restore()
    TwilioStub.restore()
    DbStub.restore()
  })
})

test("new user does complete sign up on site", t => {
  // receive POST to users/complete
  const LogInfoStub = sinon.stub(global.Log, "info")
  const TwilioStub = sinon.stub(global.Twilio, "sendMessage", (_, callback) => { callback() })
  const DbStub = sinon.stub(global.Db, "query", (_, __, callback) => { return callback(null, {insertId: 2}) })
  const BraintreeCustomerStub = sinon.stub(global.Braintree.customer, "create", (_, callback) => { return callback(null, {customer: {id: "12345678"}}) })
  t.plan(5) // eslint-disable-line no-magic-numbers
  request(app)
  .post("/users/complete")
  .send({
    user: {
      first_name: "Juan",
      last_name: "Don",
      email: "a@b.com",
      dob: "2015-01-12",
      phone: "1234567890",
      tos: 1
    },
    addresses: [
      {
        full_address: "123 Main St San Francisco CA, 94103 USA",
        address: "123 Main St",
        city: "San Francisco",
        state: "California",
        zip_code: "94103",
        country: "USA",
        code_name: "home"
      }
    ],
    transaction: {
      shipToAddressCode: "home"
    },
    payments: {
      nonce: "fake-valid-nonce"
    }
  })
  .end((_, data) => {
    t.equal(data.status, httpStatus.Created.code, "it responds successfully")
    t.deepEqual(
      LogInfoStub.args,
      [
        ["Created user", {braintree_id: "12345678", dob: "2015-01-12", email: "a@b.com", first_name: "Juan", last_name: "Don", phone: "1234567890", registration_complete: 1, tos: 1}],
        ["Created addresses home for user 2"],
        ["Created Braintree customer 12345678"],
        ["Updated user 2"]
      ],
      "it logs a user creation event"
    )
    t.deepEqual(
      TwilioStub.args.map(stripLastItem), // last arg is a callback
      [[{body: "Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:\n    \n>The Best F-ing Coffee! -- CODE: coffee\n>Love Me Some S\'more -- CODE: smores\n>Bubbly Bath -- CODE: bubbles\nPRODUCT URL\n    \nTo begin the order process, txt back the gift CODE, the day in month you\'d like us to ship and the shipping address CODE (Your address CODEs are below) you want us to send the gift to (e.g 3 coffee home, 18 smores home)\n    \nAddress Codes:\nhome\n", from: "+15005550006", to: "+11234567890"}]],
      "it sends a text"
    )
    t.deepEqual(
      DbStub.args.map(stripLastItem), // last arg is a callback
      [
        ["INSERT INTO users SET ?", {braintree_id: "12345678", dob: "2015-01-12", email: "a@b.com", first_name: "Juan", last_name: "Don", phone: "1234567890", registration_complete: 1, tos: 1}],
        ["INSERT INTO addresses SET ?", {address: "123 Main St", city: "San Francisco", code_name: "home", country: "USA", full_address: "123 Main St San Francisco CA, 94103 USA", state: "California", user_id: 2, zip_code: "94103"}],
        ["UPDATE users SET ? WHERE id = ?", [{braintree_id: "12345678", dob: "2015-01-12", email: "a@b.com", first_name: "Juan", last_name: "Don", phone: "1234567890", registration_complete: 1, tos: 1}, 2]]
      ],
      "it adds a user to the db"
    )
    t.deepEqual(
      BraintreeCustomerStub.args.map(stripLastItem), // last arg is a callback
      [[{email: "a@b.com", firstName: "Juan", lastName: "Don", paymentMethodNonce: "fake-valid-nonce", phone: "1234567890"}]],
      "it creates a Braintree customer"
    )
    LogInfoStub.restore()
    TwilioStub.restore()
    DbStub.restore()
    BraintreeCustomerStub.restore()
  })
})

test.skip("incomplete user texts with day and gift_code", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect transaction in db
  // expect twilio message
  t.pass()
})

test.skip("complete user texts with day gift_code address_code", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect transaction in db
  // expect twilio message
  t.pass()
})

test.skip("incomplete user texts /transactions with bad day", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("incomplete user texts /transactions with bad gift_code", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("incomplete user texts /transactions with day and gift_code and address", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect transaction in db
  // expect twilio message
  t.pass()
})

test.skip("incomplete user texts /transactions", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("complete user texts /transactions with bad day", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("complete user texts /transactions with bad gift_code", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("complete user texts /transactions with day and gift_code and bad address", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("complete user texts /transactions", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect no transaction in db
  // expect twilio message
  t.pass()
})

test.skip("completing an order charges a card money", t => {
  // receive Twilio webhook POST to transactions
  // expect log
  // expect transaction in db
  // expect twilio message
  t.pass()
})

test.skip("server doesn't barf on upper-case codes", t => { t.pass() })
