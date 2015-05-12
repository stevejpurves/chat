var dbFunction = require('../server/lib/db/dbFunctions')

module.exports = {
	environment: 'test',
	port:3333,
	db_host:'localhost',
	db_name:'simpledb',
	passport_override: function(username, password, done) {
							dbFunctions.findByUsername(username, function(err, user) {
									return done(null, user);
									})
								}
}