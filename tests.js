const test = require("tape").test
const request = require("supertest")
const sinon = require("sinon")
const httpStatus = require("./httpStatuses.json")
const app = require("./server/server.js")
function stripLastItem (singleCallArgs) { return singleCallArgs.slice(0, singleCallArgs.length-1) }

sinon.stub(Log, "debug") // shhh debug log

test("new user does partial sign up on site", t => {
  // receive POST to users/incomplete
  const LogStub = sinon.stub(Log, "info")
  const TwilioSpy = sinon.spy(Twilio, "sendMessage")
  var DbStub = sinon.stub(Db, "query", function(_, _, callback){ return callback(null, {insertId: Infinity}); });
  t.plan(4) // there will be 4 expectations
  request(app)
    .post("/users/incomplete")
    .send({
      phone: "9785052128",
      tos: 1
    })
    .end((_, data) => {
      t.equal(data.status, httpStatus.Created.code, "it responds successfully")
      t.deepEqual(
        LogStub.args,
        [ [ 'Created user', { phone: '9785052128', registration_complete: 0, tos: 1 } ] ],
        "it logs a user creation event"
      )
      t.deepEqual(
        TwilioSpy.args.map(stripLastItem), // last arg is a callback
        [ [ { body: 'Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:\n    \n>The Best F-ing Coffee! -- CODE: coffee\n>Love Me Some S\'more -- CODE: smores\n>Bubbly Bath -- CODE: bubbles\nPRODUCT URL\n    \nTo begin the order process, txt back the gift CODE and the day in month you\'d like us to ship (e.g 3 coffee, 18 smores)', from: '+15005550006', to: '+19785052128' } ] ],
        "it sends a text"
      )
      t.deepEqual(
        DbStub.args.map(stripLastItem), // last arg is a callback
        [ [ 'INSERT INTO users SET ?', { phone: '9785052128', registration_complete: 0, tos: 1 } ] ],
        "it adds a user to the db"
      )
      DbStub.restore();
    })
})

test.skip("new user does complete sign up on site", t => {
  // receive POST to users/complete
  // expect log
  // expect user in db
  // expect twilio message
  t.pass()
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
