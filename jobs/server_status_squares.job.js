
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
	{name: 'sss-gateway', url: '13.37.0.1', method: 'ping', last: {status: null, time: null}},
	{name: 'sss-google', url: 'https://www.google.com/', method: 'http', last: {status: null, time: null}},
	{name: 'sss-github', url: 'https://github.com/', method: 'http', last: {status: null, time: null}},
	{name: 'sss-brokenserver', url: '192.168.1.100', method: 'ping', last: {status: null, time: null}},
	{name: 'sss-alexandria', url: '13.37.0.104', method: 'ping', last: {status: null, time: null}},
];

var _ = require('lodash');
var m = require('moment');

var ping = require('ping');
var request = require('request');

function doStatus() {

	_.each(servers, function(server) {

		if (server.method == 'ping') {
			return ping.sys.probe(server.url, function(isAlive) {
				var stat = isAlive ? 1 : 0;
				if (m(m()).diff(server.last.time, 'seconds') > 10 || server.last.status != stat) {
					server.last = {
						time: new Date(),
						status: stat
					};
					send_event(server.name, {result: stat});
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
					send_event(server.name, {result: stat});
				}
			});
			req.end();
		}

	});
}

setInterval(doStatus, 6000);
doStatus();

/*SCHEDULER.every '1m', :first_in => 0 do |job|
	servers.each do |server|
		if server[:method] == 'http'
			begin
				uri = URI.parse(server[:url])
				http = Net::HTTP.new(uri.host, uri.port)
				http.read_timeout = httptimeout
				if uri.scheme == "https"
					http.use_ssl=true
					http.verify_mode = OpenSSL::SSL::VERIFY_NONE
				end
				request = Net::HTTP::Get.new(uri.request_uri)
				response = http.request(request)
				if response.code == "200"
					result = 1
				else
					result = 0
				end
			rescue Timeout::Error
				result = 0
			rescue Errno::ETIMEDOUT
				result = 0
			rescue Errno::EHOSTUNREACH
				result = 0
			rescue Errno::ECONNREFUSED
				result = 0
			rescue SocketError => e
				result = 0
			end
		elsif server[:method] == 'ping'
			result = `ping -q -c #{ping_count} #{server[:url]}`
			if ($?.exitstatus == 0)
				result = 1
			else
				result = 0
			end
		end

		send_event(server[:name], result: result)
	end
end
*/
