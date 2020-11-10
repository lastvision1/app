'use strict'
let { Server, MongoLibrary, Base, Array, Compression } = require('kedio');
global.fs = require('fs');

const serverDetails = { name: 'bank', port: '27017', local: true };

global.bankServer = new Server();
global.base = new Base();
global.compressor = new Compression();
global.db = new MongoLibrary(serverDetails);
global.bcrypt = require('bcrypt');
global.ObjectId = require('mongodb').ObjectId;
global.sessions = bankServer.sessionsManager.sessions;

let { PostManager } = require('./includes/Post/PostManager');

let postManager = new PostManager();

let { port, protocol } = bankServer.getCommands('-');
if (!base.isset(port)) port = 8082;
if (!base.isset(protocol)) protocol = 'https';

bankServer.createServer({
    port,
    protocol,
    allow: { origins: ['*'] },
    httpsOptions: {
        key: fs.readFileSync('./permissions/server.key'),
        cert: fs.readFileSync('./permissions/server.crt')
    },
    response: params => {
        params.response.end('View');
    }
});

bankServer.recordSession({ period: 24 * 60 * 60 * 1000, remember: ['user'], server: serverDetails });

bankServer.methods.post = (req, res, form) => postManager.act(req, res, form);
bankServer.makeStatic('app/public');