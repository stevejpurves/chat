var expect = require('chai').expect;
var mute = require('mute')
var test_config = require('./config')
var app = require('../server/app')
var testDb = require('./dbHelpers')

describe("Ubersensei Chat Server", function() {

	beforeEach(function(done) {
		app.start(test_config, done)
	})

	describe("Test Environment", function() {
		it("an app & server instance", function() {
			expect(app.app_instance).to.not.be.null
			expect(app.server_instance).to.not.be.null
		})
	})

	describe("Sign In", require('./signin.spec.js'));
	describe("Socket Messaging", require('./socket_messaging.spec.js'));

	afterEach(function(done) {
		app.stop(done)
	})
});