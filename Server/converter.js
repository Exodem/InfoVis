var request = require('request');
var express = require('express');
var cors = require('cors');
var iconv = require('iconv-lite');

var app = express();
app.use(cors()); // allow cross-origin resource-sharing
var router = express.Router();

// send pubHtml on request
router.get('/', function (req, res) {
    request({
        "uri": "http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all",
        "content-type": "text/html;",
        "encoding": null
    }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            res.send(iconv.decode(new Buffer(body), "latin1"));
        }
    });
});

app.use(router);
var server = app.listen(3000, function () {
    console.log("Server running on port " + server.address().port);
});
