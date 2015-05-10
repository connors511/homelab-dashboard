var parseString = require('xml2js').parseString;
var _ = require('lodash');

var news_feeds = {
	// "seattle-times": "http://seattletimes.com/rss/home.xml",
	// 'dr-dk': 'http://www.dr.dk/nyheder/service/feeds/allenyheder',
	'v2': 'http://www.version2.dk/it-nyheder/rss',
	'recordere': 'http://www.recordere.dk/_rss/'
}

function parseFeed(feed, widget_id) {
	var http = require('http');
	var url = require('url');
	var uri = url.parse(feed);
	var options = {
		host: uri.host,
		path: uri.path
	};

	http.get(options, function(res) {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			parseString(data, function(err, result) {
				if (!err) {
					try {
						var items = result.rss.channel[0].item;
						var tmp = [];
						_.each(items, function(item) {
							tmp.push({
								title: item.title[0],
								description: item.description[0]
							});
						});

						send_event(widget_id, { headlines: tmp });
					} catch(e) {
						console.log(widget_id, err)
						// noop
						return;
					}
 				} else {
 					console.log(widget_id, err);
 				}
			});
		});
	}).on('error', function(e) {
		// Doesnt matter
		// console.log(options, 'ERROR: ' + e.message);
	});
}

function parseAll() {
	_.each(_.keys(news_feeds), function(k) {
		parseFeed(news_feeds[k], k);
	});
}

setInterval(parseAll, 60000);
parseAll();
