// http://woeid.rosselliot.co.nz/lookup/kongens%20lyngby
var woe_id = '554938'; // Kongens Lyngby
var format = 'c';

var parseString = require('xml2js').parseString;
var _ = require('lodash');

function weather() {
	var http = require('http');
	var path = '/forecastrss?w=' + woe_id + '&u=' + format;
	var options = {
		host: 'weather.yahooapis.com',
		path: path
	};

	http.get(options, function(res) {
		res.setEncoding('utf8');
		data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			parseString(data, function(err, result) {
				if (!err) {
					try {
						weather_data = result.rss.channel[0].item[0]['yweather:condition'][0]['$'];
						weather_location = result.rss.channel[0]['yweather:location'][0]['$'];
						weather_forecast = _.map(result.rss.channel[0].item[0]['yweather:forecast'], function(item) {
							item = item['$'];
							var tmp = {
								day: item.day,
								low: item.low + '&deg;' + format.toUpperCase(),
								high: item.high + '&deg;' + format.toUpperCase(),
								condition: item.text,
								climacon: climacon_class(item.code)
							};
							return tmp;
						});
					} catch(e) {
								// noop
							}
							send_event('weather', {
								temp: weather_data['temp'] + '&deg;' + format.toUpperCase(),
								condition: weather_data['text'],
								title: weather_location['city'] + ' Weather',
								climacon: climacon_class(weather_data.code),
								forecast: weather_forecast
							})
						}
					});
		});
	}).on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
}

setInterval(weather, 10000);
weather();


function climacon_class(weather_code) {

	var codes = {
		'tornado': [0, 1, 2],
		'lightning': [3, 4, 37, 38, 39, 45, 47],
		'snow': [5, 7, 13, 14, 15 ,16, 41, 42, 43, 46],
		'sleet': [6, 10, 18],
		'drizzle': [8, 9],
		'rain': [11, 12, 40],
		'hail': [17, 35],
		'haze': [19, 21, 22],
		'fog': [20],
		'wind': [23, 24],
		'thermometer low': [25],
		'cloud': [26, 44],
		'cloud moon': [27, 29],
		'cloud sun': [28, 30],
		'moon': [31, 33],
		'sun': [32, 34],
		'thermometer full': [36]
	}

	weather_code = parseInt(weather_code);
	return _.findKey(codes, function(code) {
		return _.contains(code, weather_code);
	});
}
