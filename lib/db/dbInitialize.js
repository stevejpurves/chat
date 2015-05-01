var mysql      = require('mysql');
var async = require('async');
client = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'tangent90'
});

function initializeComprehensively(){
    async.series([
        function connect(callback) {
            client.connect(callback);
        },
        function clear(callback) {
            client.query('DROP SCHEMA IF EXISTS `simpledb`', callback);
        },
        function create_schema(callback) {
            client.query('CREATE SCHEMA IF NOT EXISTS `simpledb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci', callback);
        },
        function use_db(callback) {
            client.query('USE `simpledb`', callback);
        },
        function drop_table_users(callback) {
            client.query('DROP TABLE IF EXISTS `simpledb`.`users`', callback);
        },
        function create_users(callback) {
            client.query(
                    ' CREATE TABLE IF NOT EXISTS `simpledb`.`users` (' +
                    '   `userID` INT UNSIGNED NOT NULL,' +
                    '   `username` VARCHAR(45) NULL,' +
                    '   `password` VARCHAR(45) NULL,' +
                    '   `socketID` VARCHAR(45) NULL,' +
                    '   `last_login_date` DATETIME NULL,' +
                    '   PRIMARY KEY (`userID`))' +
                    ' ENGINE = InnoDB'
                , callback);
        },
        function drop_table_messages(callback) {
            client.query(' DROP TABLE IF EXISTS `simpledb`.`messages` ', callback);
        },
        function create_messages(callback) {
            client.query(
                    ' CREATE TABLE IF NOT EXISTS `simpledb`.`messages` (' +
                    '   `messagesID` INT NOT NULL AUTO_INCREMENT,' +
                    '   `from` INT UNSIGNED NOT NULL,' +
                    '   `to` INT UNSIGNED NOT NULL,' +
                    '   `content` VARCHAR(255) NULL,' +
                    '   `delivery_status` VARCHAR(45) NULL DEFAULT \'none\',' +
                    '   `date` DATETIME NULL,' +
                    '   PRIMARY KEY (`messagesID`, `to`, `from`),' +
                    '   INDEX `from_userID_idx` (`from` ASC),' +
                    '   INDEX `to_userID_idx` (`to` ASC),' +
                    '   CONSTRAINT `from_userID`' +
                    '     FOREIGN KEY (`from`)' +
                    '     REFERENCES `simpledb`.`users` (`userID`)' +
                    '     ON DELETE NO ACTION' +
                    '     ON UPDATE NO ACTION,' +
                    '   CONSTRAINT `to_userID`' +
                    '     FOREIGN KEY (`to`)' +
                    '     REFERENCES `simpledb`.`users` (`userID`)' +
                    '     ON DELETE NO ACTION' +
                    '     ON UPDATE NO ACTION)' +
                    ' ENGINE = InnoDB'
                , callback);
        },
        function insert_users(callback) {
            var userData = [
                [1, 'user1', 'secret'],
                [2, 'user2', 'secret'],
                [3, 'user3', 'secret']
            ];
            client.query('INSERT INTO `simpledb`.`users` (`userID`, `username`, `password`) VALUES ?', [userData], callback);
        },
        function insert_messages(callback) {
            var messageData = [
                [1, 1, 2, 'hello from 1 to 2', '', '2015-05-01 12:27:06'],
                [2, 1, 3, 'hello from 1 to 3', '', '2015-05-01 12:27:09'],
                [3, 2, 1, 'hello from 2 to 1', '', '2015-05-01 12:27:07'],
                [4, 2, 3, 'hello from 2 to 3', '', '2015-05-01 12:27:10'],
                [5, 3, 1, 'hello from 3 to 1', '', '2015-05-01 12:27:08'],
                [6, 3, 2, 'hello from 3 to 2', '', '2015-05-01 12:27:11']
            ];
            client.query('INSERT INTO `simpledb`.`messages` (`messagesID`, `from`, `to`, `content`, `delivery_status`, `date`) VALUES ?', [messageData] ,callback);
        }
    ], function (err, results) {
        if (err) {
            console.log('Exception initializing database.');
            throw err;
        } else {
            console.log('Database initialization complete.');
        }
    });
}
//initializeComprehensively();

module.exports.initializeComprehensively = initializeComprehensively;
module.exports.client = client;
