var client = require('../server/lib/db/dbClient')
var dbFunctions = require('../server/lib/db/dbFunctions')
var config = require('./config')

// expected format or userdata
// var userData = [
//     [1, 'user1', 'secret'],
//     [2, 'user2', 'secret'],
//     [3, 'user3', 'secret']
// ];
dbFunctions.insert_user = function(userData, callback) {
	client.query('INSERT INTO `'+config.db_name+'`.`users` (`userID`, `username`, `password`) VALUES ?', [userData], callback);
}

// expected format for messagedata
// var messageData = [
//     [1, 1, 2, 'hello from 1 to 2', '', '2015-05-01 12:27:06'],
//     [2, 1, 3, 'hello from 1 to 3', '', '2015-05-01 12:27:09'],
//     [3, 2, 1, 'hello from 2 to 1', '', '2015-05-01 12:27:07'],
//     [4, 2, 3, 'hello from 2 to 3', '', '2015-05-01 12:27:10'],
//     [5, 3, 1, 'hello from 3 to 1', '', '2015-05-01 12:27:08'],
//     [6, 3, 2, 'hello from 3 to 2', '', '2015-05-01 12:27:11']
// ];
dbFunction.insert_messages = function(messageData, callback) {
	client.query('INSERT INTO `'+config.db_name+'`.`messages` (`messagesID`, `from`, `to`, `content`, `delivery_status`, `date`) VALUES ?', [messageData] ,callback);
}

module.exports = dbFunctions