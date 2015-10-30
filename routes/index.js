var express = require('express');
var request = require('request');
var qs = require('qs');
var mongoose = require('mongoose');
var router = express.Router();
var config = require('./middlewares/config.js');
var utils = require('./middlewares/utils.js');
var dbManager = require("./database/dbManager.js");
var hashmap = require('hashmap');
var orderMap_fromId = new hashmap;
var orderMap_fromShop = new hashmap;

keyPair = config.keyPair;
var APP_ID = '203172309854130';
var APP_SECRET = 'd3fd1a8f36378cd23637970796855301';

/* GET home page. */

router.get('/similar/:itemNumber', function(req, res, next) {
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }
    var _id = req.params.itemNumber;
    var items = dbManager.item_maps;
    var item = null;
    if (items.has(_id)) {
        item = items.get(_id);
        delete item.fb_uid
    }
    var similarItems = [];
    for (var i = 0; i < shop.items.length; i++) {
        for (var j = 0; j < item.categories.length; j++) {
            if (shop.items[i].categories.indexOf(item.categories[j]) != -1 && similarItems.indexOf(shop.items[i]) == -1) {
                similarItems.push(shop.items[i]);
            }
        }
    }
    res.send(JSON.stringify(similarItems));

});

router.get('/orderList',function(req, res, next){
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }

    var obj = {};
    var base_infos = ['_id', 'address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }
   res.render('orderList.ejs', {
        data: keyPair.public,
        title: req.shopName,
        // item: item,
        shop: obj,
        // similarItems: similarItems
    }); 
});

router.get('/orderList/:orderId',function(req,res,next){
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }

    var obj = {};
    var base_infos = ['_id', 'address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }
   res.render('orderList.ejs', {
        data: keyPair.public,
        title: req.shopName,
        // item: item,
        shop: obj,
        // similarItems: similarItems
    }); 
});

router.get('/item/:itemNumber', function(req, res, next) {
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }

    var obj = {};
    var base_infos = ['_id', 'address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }

    var _id = req.params.itemNumber;
    var items = dbManager.item_maps;
    var item = null;
    if (items.has(_id)) {
        item = items.get(_id);
        delete item.fb_uid
    }
    var similarItems = [];
    for (var i = 0; i < shop.items.length; i++) {
        for (var j = 0; j < item.categories.length; j++) {
            if (shop.items[i].categories.indexOf(item.categories[j]) != -1 && similarItems.indexOf(shop.items[i]) == -1) {
                similarItems.push(shop.items[i]);
            }
        }
    }
    // console.log(similarItems);
    res.render('ItemDetails', {
        data: keyPair.public,
        title: req.shopName,
        item: item,
        shop: obj,
        similarItems: similarItems
    });
});

router.post('/order', utils.decryptRequest, utils.checkToken, function(req, res, next) {
    var orderResult = {};
    orderResult.err = 0;
    orderResult.msg = "Ok";
    if (req.invalidRequest == true || req.isAppToken == false) {
        // Object send from an annonymous person
        // Just add information of order without detail of buyer
        return;
    }

});

router.get('/', function(req, res, next) {
    orderId = 'orderId'+ mongoose.Types.ObjectId();
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        res.sendStatus(403);
        return;
    }
    var obj = {};
    var base_infos = ['address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }
    var items = shop.items;
    
    if (!items||items.constructor !== Array) {
        res.sendStatus(500);
        return;
    }
    var hot_items = [];
    var new_items = [];
    for (var i = 0; i < items.length; i++) {
        delete items[i].fb_uid;
        if (hot_items.length < 9 && items[i].isHotProduct == "true") {
            hot_items.push(items[i]);
        }
        if (new_items.length < 9 && items[i].isNewproduct == "true") {
            new_items.push(items[i]);
        }
        if (new_items.length == 9 && hot_items.length == 9) {
            break;
        }
    }
    obj.new_items = new_items;
    obj.hot_items = hot_items;

    res.render('mainShop.ejs', {
        data: keyPair.public,
        title: shopName,
        shop: obj,
        orderId: orderId
    });
});

// function checkShopMapsChanged(map){
//     if(map){
//         console.log("changed",map);
//     }
// }
// dbManager.addShopListener(checkShopMapsChanged);

module.exports = router;
