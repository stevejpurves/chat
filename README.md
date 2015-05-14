# chat
Basic chat functionality using node, express, mysql, socket.io and passport.js

### // TODO: automated testing (mocha, chai …)
(preferably, use real environments/requests as opposed to fake e.g. simulated XHRs)



### summary of testing changes

1. bootstrap - moved the server files into a server directory for clarity (public folder should could come out of there to be served separately, e.g. cdn). Created a wrapper for the serer (app.js) setup with start and stop function. Start requires a config object from config.js. This allows us to start the server normally from a very simple file start.js e.g. `node start.js`. It also means that we can start the app with any config object we'd like to inject.
1. injectable config object - watch out for usage of the config object in various places, it indicates where behaviour is changing betweem dev and test environments
1. passport mocking - there is the possibility to stub out the passport verify functon by using the passport_override in config. But I am not using it. I don't think you need it until you are using different strategies.
1. test directory - has an alternate start.js and config.js that mocha can use to start the server.
1. fixtures and db intialisation - db initialisation needs to be at the top level and controllable, not happening as a side effect of requiring a separate file. db init has been moved up to app. in dbIntialise as separate the contruction of a clean db from population of the db with test data. For automated tests we want to start with a clean db and use test setup to take care of the fixtures for us
1. proper async handling - you were not waiting on db intialisaiton to complete before starting the server. from the rbowser and manual testing this made no impact as db was live by the time you use it. from automated tests this caused a failure, and need the async nature of db initalisaiton to be handled properly. hence the onDbInit in the middle of app.js. there may be other poorly handled async issues yet to surface
1. passportFunctons - see the coments in that file and in the socket_messaging.spec.js. Currently anyone can connect to a socket, authenitifcated or not and will cause a server error if not from a client whois logged in ans has a passport session. Its very easy for an attacker to bring the server down. A different authorization approach is recommended and there are plently of examples out there.
1. socket.io-client - the socket.io node client does not work in the same way as the web client. it will not pass on cookies. This and the fact that you rely on cookies + passport session in the server side sockerio handling caused big problems for getting tests up. This has been solved in relatively secure way. In test mode only (config.environment==='test'), the socketio server code will accept the userID as a query string. A better solution is to rethink the socketio authorisation approach (again plenty of examples out there) and use that. For teh time being you are able to test. I have added a test showing two clients connecting and confirming emission of the socketID