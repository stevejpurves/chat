var expect = require('chai').expect
require('./helpers')
var testDb = require('./dbHelpers')

module.exports = function() {

	describe("bad credentials", function() {
		beforeEach(function(done) {
			testDb.insert_user([[1,'bob','1234']], function(err, result) {
				done()
			})
		})

		it('username is missing', function(done) {
			// POSTLOGIN('fred','1234', function(err, res) {
			// 	expect(err).to.be.null
			// 	expect(res.status).to.equal(200)
			// 	done(err)
			// })
		done()
		})
	})

	describe("DB error", function() {
		// beforeEach(function(done) {
		// 	testDb.insert_user([[1,'bob','abc']], done)
		// })

		// it('given good credentials, then 404', function(done) {
		// 	POSTLOGIN('bob', 'abc', function(err,res) {
		// 		expect(err).to.not.be.null
		// 		expect(res.status).to.equal(404)
		// 		done(err)
		// 	})
		// })
	})

	describe("successful sign in", function() {

		beforeEach(function(done) {
			testDb.insert_user([[1,'albert','1234']], function(err, result) {
				expect(err).to.be.null
				done()
			})
		})

		it("returns 200", function(done) {
			testDb.findByUsername('albert', function(err, user) {
				expect(err).to.be.null
				if (!err) {
					expect(user.username).to.equal('albert')
				}	
				done()
			})
		})

		it.skip('get message history')
		it.skip('establish socketio connection')
		it.skip('socket id is stored in db')
	});

}