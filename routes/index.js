var express = require('express');
var router = express.Router();
var config = require('./middlewares/config.js');


keyPair = config.keyPair;

/* GET home page. */
router.get('/', function(req, res, next) {
 	var shopName = req.shopName;
  	res.render('MainShop.ejs', { 
  	data: keyPair.public,
  	title: shopName });  
});



module.exports = router;
