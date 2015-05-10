
/*
 Check whether a server is Responding you can set a server to
 check via http request or ping

 Server Options
   name
	   => The name of the Server Status Tile to Update
   url
	   => Either a website url or an IP address. Do not include https:// when using ping method.
   method
	   => http
	   => ping

 Notes:
   => If the server you're checking redirects (from http to https for example)
	  the check will return false
*/

var servers = [
	{name: 'Sonarr', url: '13.37.0.192', method: 'ping', last: {status: null, time: null}},
	{name: 'NZBGet', url: '13.37.0.187', method: 'ping', last: {status: null, time: null}},
	{name: 'CouchPotato', url: '13.37.0.123', method: 'ping', last: {status: null, time: null}},
	{name: 'Teamspeak', url: '13.37.0.189', method: 'ping', last: {status: null, time: null}},
	// {name: 'serv-dead', url: '13.37.0.1', method: 'ping', last: {status: null, time: null}},
];

var _ = require('lodash');
var m = require('moment');
var async = require('async');

var ping = require('ping');
var request = require('request');

function doStatus() {

	function serverStatus(name, status) {
		arrows = ['fa-exclamation-circle', 'fa-check-circle'];
		colors = ['red', 'green'];
		return {label: name, value: status, arrow: arrows[status], color: colors[status]};
	}

	statuses = [];

	async.each(servers, function(server, done) {
		if (server.method == 'ping') {
			return ping.sys.probe(server.url, function(isAlive) {
				var stat = isAlive ? 1 : 0;
				if (m(m()).diff(server.last.time, 'seconds') > 10 || server.last.status != stat) {
					server.last = {
						time: new Date(),
						status: stat
					};
					statuses.push(serverStatus(server.name, stat))
					done();
				}
			})
		} else if (server.method == 'http') {
			var options = {
				method: 'HEAD',
				url: server.url
			};
			var req = request(options, function(err, res, body) {
				var stat = err ? 0 : 1;
				if (m(m()).diff(server.last.time, 'seconds') > 10 || server.last.status != stat) {
					server.last = {
						time: new Date(),
						status: stat
					};
					statuses.push(serverStatus(server.name, stat))
					done();
				}
			});
			req.end();
		}


	}, function() {
		send_event('services', {items: statuses})
	});
}

setInterval(doStatus, 6000);
doStatus();
