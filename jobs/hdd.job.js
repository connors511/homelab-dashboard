// setInterval(function() {

//   var http = require('http');
//     var options = {
//         host: 'hostname',
//         path: '/status.php?type=hdd'
//     };

//     http.get(options, function(res) {
//         //console.log('STATUS: ' + res.statusCode);
//         //console.log('HEADERS: ' + JSON.stringify(res.headers));
//         res.setEncoding('utf8');
//         data = '';
//         res.on('data', function (chunk) {
//             data += chunk;
//             //socket.emit('hdd', chunk, (new Date).getTime());
//         });
//         res.on('end', function() {
//             for (var i = 0; i < data.length; i++) {
//                 if (data[i].name == '/media/raid5') {
//                     send_event('hdd', data[i]);
//                 }
//             }
//         });
//     }).on('error', function(e) {
//         console.log('ERROR: ' + e.message);
//     });

// }, 10000);

var sequest = require('sequest')

function checkHDD() {
	sequest('alexandria@13.37.0.104', {
			command: 'df -h'
		}, function (e, drives) {
			if (e) throw e

			drives = drives.split('\n');

			data = {slots: []};
			drives.forEach(function(d) {
				if (d.indexOf('/dev/') >= 0) {
					tmp = d.replace(/\s+/g,' ').split(' ');
					pct = tmp[tmp.length-2];
					data.slots.push({
						filename: tmp[tmp.length-1],
						details: tmp[1] + ' / ' + tmp[2] + ' | ' + tmp[3],
						percentage: pct
					});
				}
			})
			send_event('hdd', data);
	})
}

setInterval(checkHDD, 1000 * 60 * 60); // Every hour
checkHDD();
