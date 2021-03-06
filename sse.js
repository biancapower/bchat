"use strict";

// adds the sseConnection property to the response in case we want to use it later
function sseMiddleware(req, res, next) {
    res.sseConnection = new Connection(res);
    next();
}
exports.sseMiddleware = sseMiddleware;

/**
 * A Connection is a simple SSE manager for 1 client.
 */
var Connection = (function () {
    // given a response, stores it within itself for later use
    function Connection(res) {
        this.res = res;
    }
    Connection.prototype.setup = function () {
        this.res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    };
    Connection.prototype.send = function (data) {
        // console.log("send event to SSE stream " + JSON.stringify(data));
        this.res.write("data: " + JSON.stringify(data) + "\n\n");
    };
    return Connection;
} ());

exports.Connection = Connection;



/**
 * A Topic handles a bundle of connections with cleanup after lost connection.

 ** A Topic is a list of clients **
 */
var Topic = (function () {
    function Topic() {
      this.connections = [];
    }
    Topic.prototype.add = function (conn) {
        var connections = this.connections;
        connections.push(conn);

        console.log('New client connected, the number of clients is now: ', connections.length);

        conn.res.on('close', function () {
            var i = connections.indexOf(conn);
            if (i >= 0) {
                connections.splice(i, 1);
            }

            console.log('Client disconnected, now: ', connections.length);

        });
    };
    Topic.prototype.forEach = function (cb) {
        this.connections.forEach(cb);
    };
    return Topic;
} ());

exports.Topic = Topic;
