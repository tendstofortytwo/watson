var https = require('https');
var http = require('http');
var url = require('url');
var express = require('express');
var router = express.Router();
var api = require('./api');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { searchType: 'text' });
});

router.get('/q/text', function(req, res, next) {
	if(req.query.term) {
		var apiRequest = https.request({
			method: 'GET',
			hostname: 'api.cognitive.microsoft.com',
			path: '/bing/v7.0/search?q=' + encodeURIComponent(req.query.term),
			headers: {
				'Ocp-Apim-Subscription-Key': api.key
			}
		}, function(apiResponse) {
			var body = '';

			apiResponse.on('data', function(d) {
				body += d;
			});

			apiResponse.on('end', function() {
				body = JSON.parse(body);
				res.render('search', {
					searchResults: body.webPages.value,
					searchTerm: body.queryContext.originalQuery,
					searchType: 'text'
				})
			})
		});

		apiRequest.end();
	} else {
		res.redirect('/');
	}
});

var bundles = [];

function Bundle(ip, links, title) {
	this.ip = ip;
	this.links = links;
	this.title = title;
}

function Link(url, title) {
	this.url = url;
	this.title = title;
}


router.post('/addbundle', function(req, res, next) {
	if(req.body && req.body.links && req.body.title) {
		var a = [];

		for(var i = 0; i < req.body.links.length; i++) {
			a[i] = new Link(req.body.links[i].url, req.body.links[i].title);
		}

		bundles[bundles.length] = new Bundle(req.ip, a, req.body.title);
		console.log(bundles);
		res.send('ok');
	} else {
		res.send('no');
	}
});

router.get('/bundles', function(req, res, next) {
	var yourBundles = [];

	for(var i = 0; i < bundles.length; i++) {
		if(bundles[i].ip == req.ip) {
			yourBundles[yourBundles.length] = bundles[i];
		}
	}

	res.render('bundles', {
		bundles: yourBundles,
		searchTerm: 'My Pinboards',
		searchType: 'text'
	})
})

router.get('/about', function(req, res, next) {
	res.render('about');
});

module.exports = router;
