var expect = require('chai').expect

var io = require('socket.io-client')
var testDb = require('./dbHelpers')
var helpers = require('./helpers')

var url = 'http://localhost:3333'

var request = require('superagent')

var options = { reconnection: false, forceNew: true, transports: ['websocket']};


module.exports = function() {

	describe("connecting over socket io", function() {

		beforeEach(function(done) {
			testDb.insert_user([[101,'bob','1234']], function(err, result) {
				done(err)
			})
		})

		it("can connect socket.io for a given user id", function(done) {
			/*
				This is a workaround for the lack of cookie support. Its mildly insecure though,
				and passing the signed cookie in teh query sting would be much better, but requires
				a more work serverside
			*/
			var connect = false
			var connect_error = false

			var client = io.connect(url+'/?user_id=101', options)
			client.on('connect', function(data) {
				connect = true
			})
			client.on('connect_error', function() {
				connect_error = true
			})
			client.on('userID', function(data) {
				expect(connect).to.be.true
				expect(connect_error).to.be.false
				expect(data.userID).to.equal(101)
				client.disconnect()
				done()
			})
		})


		it.skip("cannot create connection without a login", function(done) {
			/*
				This skipped test would cause a server error because of the approach the server is taking to
				socket.io authentification. The server is actually allowing conetions for anyone.
				This is bad and instead the socket.io 'authorization' pattern shoul be used
			*/

			var connected = false

			var client = io.connect(url, options)
			client.on('connect', function(data) {
				connected = true;
			})
			client.on('connect_error', function(obj) {
				console.log('connect error', obj)
				done()				
			})

			setTimeout(function() {
				expect(connected).to.be.false
				done()
			}, 500)
		})


		it.skip("can connect socket.io after login", function(done) {
			// This skipped test fails as the node socket.io client does not do cookie preservation properly.
			// So the server does not pick up on the correct session
			// A better serverside authentification approach would help
			// http://stackoverflow.com/questions/23722483/how-to-authenticate-socket-io-connection-without-underlying-useragent-to-keep-th
			// http://stackoverflow.com/questions/13095418/how-to-use-passport-with-express-and-socket-io
			var connected = false
			LOGIN('bob','1234', function(err, res) {
				GET_FOR_USER_SESSION('/', 0, function(err, res) {
					if (err) return done(err)

					var client = io.connect(url, options)
					client.on('connect', function(data) {
						console.log("CONNECTED")
						connected = true
						expect(connected).to.be.true
						done()
					})

					client.on('userID', function(data) {
						console.log(data)
						done()
					})

					client.on('connect_error', function(obj) {
						console.log('connect error', obj)
						done()
					})
				})
			})
		})


		it.skip("can connect socket.io after login with superagent", function(done) {
			/*
				This isthe same issue as in teh above skipped test, just checking that it is
				not somthing to do with supertest. This confirms its actualy the 
			*/
			var user1 = request.agent()
			user1
				.post('http://localhost:3333/auth/login')
				.type('form')
				.send({username:'bob', password:'1234'})
				.end(function(err, res) {
					if (err) return done(err)
					expect(res.text).to.contain('<a href="/auth/profile">My Profile</a>')

					var client = io.connect(url, options)
					client.on('connect', function(data) {
						connected = true
						expect(connected).to.be.true
						done()
					})

					client.on('connect_error', function(obj) {
						console.log('connect error', obj)
						done()
					})
				})
		})
	})


	describe("message delivery", function() {
		it.skip("Given db failure confirm with 'Not Delivered'")
		it.skip("Given db ok, confirm with 'Delivered")		
	});

	describe("message is 'seen'", function() {
		it.skip("Given user is connected, confirm with 'seen'")
		it.skip("Given user is not connected, confirm with delivered")
	})
}
