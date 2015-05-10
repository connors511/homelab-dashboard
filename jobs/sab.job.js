// function download(cb) {
// }

// setInterval(function() {

// 	var http = require('http');
// 	var options = {
// 		host: 'hostname',
// 		path: '/status.php?type=sab'
// 	};

// 	http.get(options, function(res) {
// 		//console.log('STATUS: ' + res.statusCode);
// 		//console.log('HEADERS: ' + JSON.stringify(res.headers));
// 		res.setEncoding('utf8');
// 		data = '';
// 		res.on('data', function (chunk) {
// 			data += chunk;
// 			//socket.emit('hdd', chunk, (new Date).getTime());
// 		});
// 		res.on('end', function() {

// 			data = JSON.parse(data);
// 			data.slots = data.slots.slice(0,7);
// 			send_event('sab', data);
// 		});
// 	}).on('error', function(e) {
// 		console.log('ERROR: ' + e.message);
// 	});
// }, 1000);


// require 'simple-rss'
// require 'open-uri'

// url     = 'http://feeds.feedburner.com/StartupQuote?format=xml'
// feed    = SimpleRSS.parse open(url)
// entries = feed.entries

// SCHEDULER.every '1m', :first_in => 0 do
//   random_quote = entries.sample
//   if (src = random_quote.description.match(/img.*?src="(.*?)"/i)[1] rescue false)
//     send_event('startup_quote', {image: src})
//   end
// end
