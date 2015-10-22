var express = require('express');
var router = express.Router();
var config = require('./middlewares/config.js');
var dbManager = require("./database/dbManager.js");

keyPair = config.keyPair;

/* GET home page. */
router.get('/', function(req, res, next) {

    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }
    var obj = {};
    var base_infos = ['address', 'companyName', 'contact_email', 'contact_phone', 'pathName', 'shop_description', 'showName', 'slogan', 'longitude', 'latitude', 'walls', 'avatars', 'categories'];
    for (var i = 0; i < base_infos.length; i++) {
        obj[base_infos[i]] = shop[base_infos[i]];
    }
    var items = shop.items;
    var hot_items = [];
    var new_items = [];
    for (var i = 0; i < items.length; i++) {
        if (hot_items.length < 9 && items[i].isHotProduct == "true") {
            hot_items.push(items[i]);
        }
        if (new_items.length < 9 && items[i].isNewproduct == "true") {
            new_items.push(items[i]);
        }
        if (new_items.length == 9 && hot_items.length == 9){
            break;
        }
    }
    obj.new_items = new_items;
    obj.hot_items = hot_items;    

    res.render('mainShop.ejs', {
        data: keyPair.public,
        title: shopName,
        shop: obj
    });
});

router.get('/:itemNumber',function(req,res,next){
    var shops = dbManager.shop_maps;
    var shopName = req.shopName;
    var shop = shops.get(shopName);
    if (!shop) {
        return;
    }
    var _id = req.params.itemNumber;
    var items = dbManager.item_maps;
    var item = null;
    if(items.has(_id)){
        item = items.get(_id);
        delete item.fb_uid
    }
    var similarItems = [];
    for(var i = 0;i<shop.items.length; i++){
        for(var j =0;j<item.categories.length;j++){
            if(shop.items[i].categories.indexOf(item.categories[j]) != -1 && similarItems.indexOf(shop.items[i]) == -1){
                similarItems.push(shop.items[i]);
            }
        }
    }
    // console.log(similarItems);
    res.render('ItemDetails',{
       data: keyPair.public,
        title: req.shopName,
        item: item,
        shop:shop,
        similarItems: similarItems
    });
});

module.exports = router;
