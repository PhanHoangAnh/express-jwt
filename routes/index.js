var express = require('express');
var request = require('request');
var qs = require('qs');
var mongoose = require('mongoose');
var router = express.Router();
var config = require('./middlewares/config.js');
var utils = require('./middlewares/utils.js');
var dbManager = require("./database/dbManager.js");
var hashmap = require('hashmap');

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

router.get('/cartReview', function(req, res, next) {
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    orderId = 'orderId_' + mongoose.Types.ObjectId();
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }

    var obj = {};
    var base_infos = ['_id', 'address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }
    res.render('cartReview.ejs', {
        data: keyPair.public,
        title: req.shopName,
        shop: obj,
        orderId: orderId
    });
});


var order_fromOrderId = new hashmap;
var order_fromFb_uid = new hashmap;
var order_toShop = new hashmap;
var translateOrderId_toUid = new hashmap;

router.get('/order/:orderId', function(req, res, next) {
    var orderResult = {};
    orderResult.err = 0;
    orderResult.msg = "Ok";    
    var orderId = req.params.orderId;
    var orderLists = order_fromOrderId.get(orderId);
    orderResult.orderLists = orderLists;
    res.send(JSON.stringify(orderResult));
});

router.post('/order', utils.decryptRequest, utils.checkToken, function(req, res, next) {    
    var shops = dbManager.shop_maps;    
    var orderResult = {};
    orderResult.err = 0;
    orderResult.msg = "Ok";
    var orderId = req.body.orderId;
    var cartItems = JSON.parse(req.body.cartItems);
    
    if (cartItems.constructor !== Array) {
        orderResult.err = 1;
        orderResult.msg = "invalidRequest: cartItems is not array";
        res.send(JSON.stringify(orderResult));
        return
    }

    for(var i = 0; i<cartItems.length; i++){
        var shop = cartItems[i].shop;
        if(!shops.get(shop)){
            cartItems.splice(indexOf(cartItems[i]),1);
            console.log('here', cartItems[i]);
            continue;
        }
        var orderToShop = order_toShop.get(shop);
        if (orderToShop) {
            orderToShop = orderToShop.concat(cartItems[i]);
        } else {
            orderToShop = [cartItems[i]];
        }
        order_toShop.set(shop, orderToShop);
    	cartItems[i].date = Date();
    	cartItems[i].status = "Waiting.."
    }
    function orderOfShopToDb(shop, cartItemArrays, fn) {}
    order_toShop.forEach(function(value, key){
        dbManager.orderOfShopToDb(key,value, function(result){
            if(result.err){
                // Log
                console.log(result);
            }
        })
    });

    if (req.invalidRequest == false && req.isAppToken == true) {
        // Object send from an identified person.Add information of order within detail of buyer
        translateOrderId_toUid.set(orderId, req.uid);
        var orderLists = order_fromFb_uid.get(req.uid)
        if (orderLists) {
            orderLists = orderLists.concat(cartItems);
        } else {
            orderLists = cartItems;
        }
        order_fromFb_uid.set(req.uid, orderLists);
    };

    var _orderLists = order_fromOrderId.get(orderId);
    // function orderToDb(orderId,cartItemArrays, fn){}
    if (_orderLists) {
        _orderLists = _orderLists.concat(cartItems);
    } else {
        _orderLists = cartItems;
    };
    order_fromOrderId.set(orderId, _orderLists);    

    dbManager.orderToDb(orderId,_orderLists,function(result){
        if (!result.err){
            // Write to logfiles   
            return;
        }
    });
    orderResult.orderLists = _orderLists;
    orderResult.history = order_fromOrderId;
    res.send(JSON.stringify(orderResult));
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

router.get('/', function(req, res, next) {
    orderId = 'orderId_' + mongoose.Types.ObjectId();
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

    if (!items || items.constructor !== Array) {
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


module.exports = router;
