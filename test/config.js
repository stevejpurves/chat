module.exports = {
	environment: 'test',
	port:3333,
	db_host:'localhost',
	db_name:'test_simpledb'
}

var dbFunctions = require('../server/lib/db/dbFunctions')
module.exports.passport_override = function(username, password, done) {
	dbFunctions.findByUsername(username, function(err, user) {
			return done(null, user);
			})
		}