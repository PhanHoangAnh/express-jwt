var express = require('express');
var router = express.Router();
var config = require('./middlewares/config.js');
var dbManager = require("./database/dbManager.js");
var items = dbManager.item_maps;
var shops = dbManager.shop_maps;
;
keyPair = config.keyPair;

/* GET home page. */
router.get('/', function(req, res, next) {
 	var shopName = req.shopName;
 	var shop = shops.get(shopName);
 	if(!shop){
 		return;
 	}
 	var obj = {};
 	var base_infos = ['address','companyName','contact_email','contact_phone','pathName','shop_description','showName','slogan','longitude','latitude','walls','avatars','categories'];
 	for(var i = 0;i<base_infos.length;i++){
 		obj[base_infos[i]] = shop[base_infos[i]];
 	}
 	var items = shop.items;

 	console.log(shop.items);

  	res.render('MainShop.ejs', { 
  	data: keyPair.public,
  	title: shopName,
  	shop: obj
  	 });  
});



module.exports = router;
