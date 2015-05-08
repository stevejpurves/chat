var mysql      = require('mysql');
var async = require('async');

client = mysql.createConnection({
    host     : 'localhost',
    user     : 'ubersensei',
    password : 'tangent90'
});

module.exports = client;