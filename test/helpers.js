var config = require('./config')
var request = require('supertest')

module.exports = function(app) {

	// move the request functions in the tests into here to reduce duplication

	global.LOGIN = function(username, password, cb)	{
		return request(the_app)
				.post('/auth/login')
				.type('form')
				.send({username:username, password:password})
				.expect(302)
				.end(function(err, res) {
					user_cookies.push(res.headers['set-cookie'])
					cb(err, res)
				})
	}

	global.GET_FOR_USER_SESSION = function(path, user_cookie_idx,  cb) {
		if (user_cookie_idx >= user_cookies.length)
			throw new Error('GET_FOR_USER_SESSION called with bad user_cookie_idx = '+user_cookie_idx)
		return request(the_app)
				.get(path)
				.set('Cookie', user_cookies[user_cookie_idx])
				.expect(200)
				.end(function(err,res) {
					return cb(err, res)
				})
	}

	return {}
}


