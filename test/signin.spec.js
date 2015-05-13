var expect = require('chai').expect
var testDb = require('./dbHelpers')

var request = require('supertest')
var helpers = require('./helpers')

module.exports = function() {

	describe("bad credentials", function() {

		beforeEach(function(done) {
			testDb.insert_user([[1,'bob','1234']], function(err, result) {
				done()
			})
		})

		it('username is missing', function(done) {
			LOGIN('albert','1234', function(err, res) {
				if (err) return done(err)
				expect(res.headers['location']).to.equal('/')
				GET_FOR_USER_SESSION('/', 0, function(err,res) {
						expect(res.text).to.contain('<p class="flashMessage">Unknown user albert</p>')
						done()
					})
			})
		})
	})

	describe("DB error", function() {
		beforeEach(function(done) {
			testDb.drop_tables(function(err, result) {
				expect(err).to.be.falsy
				done()
			})
		})

		it("responds with 500", function(done) {
			LOGIN('albert', '1234', done)
				.expect(500)
		})
	})

	describe("successful sign in", function() {

		beforeEach(function(done) {
			testDb.insert_user([[1,'albert','1234']], function(err, result) {
				expect(err).to.be.null
				done()
			})
		})

		it("redirects to /", function(done) {
			LOGIN('albert','1234', function(err, res) {
				if (err) return done(err)
				expect(res.headers['location']).to.equal('/')
				GET_FOR_USER_SESSION('/', 0, function(err,res) {
						expect(res.text).to.contain('<a href="/auth/profile">My Profile</a>')
						done()
					})
			})
		})

		it.skip('clientJS should be loaded')

		it.skip('get message history')

		it.skip('establish socketio connection')

		it.skip('socket id is stored in db')
	});

}