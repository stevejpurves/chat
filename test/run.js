var expect = require('chai').expect;
var mute = require('mute')
var test_config = require('./config')
var app = require('../server/app')
var testDb = require('./dbHelpers')

describe("Ubersensei Chat Server", function() {

	this.the_app = null
	this.the_cookie = null

	beforeEach(function(done) {
		app.start(test_config, function() {
			require('./helpers')(app.app_instance)
			the_app = app.app_instance
			done()
		})
	})

	describe("Test Environment", function() {
		it("an app & server instance", function() {
			expect(app.app_instance).to.not.be.null
			expect(app.server_instance).to.not.be.null
		})

		describe("db interaction from test", function() {
			beforeEach(function(done) {
				testDb.insert_user([[1,'albert','1234']], function(err, result) {
					expect(err).to.be.null
					done()
				})
			})

			it("can insert a user", function(done) {
				testDb.findByUsername('albert', function(err, user) {
					expect(err).to.be.null
					if (!err) {
						expect(user.username).to.equal('albert')
					}	
					done()
				})
			})
		})

	})

	describe("Sign In", require('./signin.spec.js'));
	describe("Socket Messaging", require('./socket_messaging.spec.js'));

	afterEach(function(done) {
		app.stop(done)
	})

});