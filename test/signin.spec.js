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
			request(the_app)
				.post('/auth/login')
				.type('form')
				.send({username:'albert', password:'1234'})
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err)
					expect(res.headers['location']).to.equal('/')
					// to assert for the flash message we have to follow the redirect
					// in the same session
					the_cookie = res.headers['set-cookie']
					request(the_app)
						.get('/')
						.set('Cookie',the_cookie)
						.expect(200)
						.end(function(err,res) {
							expect(res.text).to.contain('<p class="flashMessage">Unknown user albert</p>')
							done()
						})
				})
		})
	})

	describe("DB error", function() {
		it.skip("responds with 404")
	})

	describe("successful sign in", function() {

		beforeEach(function(done) {
			testDb.insert_user([[1,'albert','1234']], function(err, result) {
				expect(err).to.be.null
				done()
			})
		})

		it("redirects to /", function(done) {
			request(the_app)
				.post('/auth/login')
				.type('form')
				.send({username:'albert',password:'1234'})
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err)
					expect(res.headers['location']).to.equal('/')
					the_cookie = res.headers['set-cookie']
					request(the_app)
						.get('/')
						.set('Cookie',the_cookie)
						.expect(200)
						.end(function(err,res) {
							expect(res.text).to.contain('<a href="/auth/profile">My Profile</a>')
							done()
						})
				})
		})

		it.skip('get message history')
		it.skip('establish socketio connection')
		it.skip('socket id is stored in db')
	});

}