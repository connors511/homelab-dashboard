var images = [];

function download(cb) {
  var http = require('http');
    var options = {
        host: 'feeds.feedburner.com',
        path: '/StartupQuote?format=xml'
    };

    http.get(options, function(res) {

        res.setEncoding('utf8');
        data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
           	var re = new RegExp('img.*?src="(.*?)"', 'ig');
           	data = data.match(re);
           	var tmp = [];
           	for (var i = data.length - 1; i >= 0; i--) {
           		if (data[i].indexOf('.png') > 0) {
	           		tmp.push(data[i].slice(9,-1));
	           	}
           	};
           	images = tmp;
            if (cb) {
              cb();
            }
        });
    }).on('error', function(e) {
        // Doesnt matter
        // console.log('ERROR: ' + e.message);
    });
}
setInterval(download, 3600000); // Download new every hour

download(function() {
    send_event('startup_quote', {image: images[Math.floor(Math.random() * images.length)]});
});
setInterval(function() {
	send_event('startup_quote', {image: images[Math.floor(Math.random() * images.length)]});
}, 60000);


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
