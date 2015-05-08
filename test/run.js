var expect = require('chai').expect;

var test_config = require('./config')
var app = require('../server/app')

describe("Ubersensei Chat Server", function() {

	before(function(done) {
		app.start(test_config, done)
	})

	describe("Test Environment", function() {
		it("an app & server instance", function() {
			expect(app.app_instance).to.not.be.null
			// expect(app.server_instance).to.not.be.null
		})

		it("a failing test", function() {
			expect(true).to.be.false
		})
	})

	after(function(done) {
		app.stop(done)
	})
});