var express = require('express');
var router = express.Router();

var fs = require('fs');
var keyPair = JSON.parse(fs.readFileSync('temp', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log("from create new Shop");
	// res.sendStatus(200);

	res.render('createNewShop.ejs', {
	    data: keyPair.public,
	    title: 'create new Shop'
	    // basicURL: 'localhost.io:3000'
	});


});

module.exports = router;
