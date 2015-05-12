var expect = require('chai').expect

module.exports = function() {

	describe("bad credentials", function() {
		it.skip('username is missing', function() {
		});
	})

	describe("DB error", function() {
		it.skip('given good credentials, then 404', function() {
		})
	})

	describe("successful sign in", function() {
		it.skip('get message history')
		it.skip('establish socketio connection')
		it.skip('socket id is stored in db')
	});

}