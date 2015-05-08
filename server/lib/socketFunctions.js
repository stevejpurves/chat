module.exports = function(server) {
    var dbFunctions = require('./db/dbFunctions');
    var sessionMiddleware = require('./session').sessionMiddleware;

    var io = require('socket.io').listen(server);

    // Read sessions from within socket.io
    io.use (function(socket, next){ sessionMiddleware(socket.request, {}, next); });

    io.on('connection', function(socket) {

        // update user's socketID against their own record
        var userID = socket.request.session.passport.user;
        dbFunctions.updateSocketID(userID, socket.id, function(err, rows) {
            if(err) {return console.log('error in updating user socketID', err)}
        });

        // tell everyone else that this user is now online
        socket.broadcast.emit('socketID', {'userID': userID, 'socketID': socket.id});

        socket.on('chat', function(chatmessage, callback) {
            if (chatmessage.targetSocketID != null) {
                // target user is online, send message to target user
                io.to(chatmessage.targetSocketID).emit('chat', chatmessage); // callback not available for server emits !
                // try to store in db with delivery_status = 'seen'
                dbFunctions.insertChatMessage(chatmessage, function (err, rows) {
                    if (err) {return callback(null, {'delivery_status': 'not delivered'});}
                    return callback(null, {'delivery_status': 'seen'});
                });
            } else {
                // target user is offline, try to store message in db with delivery_status = 'delivered'
                dbFunctions.insertChatMessage(chatmessage, function (err, rows) {
                    if (err) {return callback(null, {'delivery_status': 'not delivered'});}
                    return callback(null, {'delivery_status': 'delivered'});
                });
            }
        });
    });

};