var config = require('./config')
var FormData = require('form-data')

global.POSTLOGIN = function(username, password, cb) {
	var form = new FormData()
	form.append('username', username)
	form.append('password', password)
	form.submit({
			host: 'localhost',
			path: '/auth/login',
			port: config.port }, function(err, res) {
				if (err) return cb(err)
				res.resume()
				cb(err, res)
			})
}