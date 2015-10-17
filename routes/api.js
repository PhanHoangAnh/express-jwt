var express = require('express');
var router = express.Router();
var utils = require('./middlewares/utils.js');
var hmap = utils.hmap;
var hashmap = require("hashmap");
var dbManager = require("./database/dbManager.js");
var mongoose = require('mongoose');
var trim = require('trim');

router.get('/', function(req, res, next) {
    res.send('respond from api with a resource');
});

//  request bear fb_uid and app_token;
router.post("/checktoken", utils.decryptRequest, utils.checkToken, isShopExisted, function(req, res, next) {
    var send_obj = {};
    if (req.invalidRequest == true) {
        send_obj.err = 1;
        send_obj.message = 'checktoken: invalidRequest';
        res.send(JSON.stringify(send_obj));
        return;
    }
    if (req.isAppToken == false) {
        send_obj.err = 2;
        send_obj.message = 'checktoken: invalidToken';
        res.send(JSON.stringify(send_obj));
        return;
    } else {        
        if (req.shop != null || req.shop != undefined) {
            send_obj.shop = req.shop;
            send_obj.isShop = 1;
        }
        send_obj.err = 0;
        send_obj.message = 'checktoken: validToken';
        res.send(JSON.stringify(send_obj));
        return;
    }
    send_obj.err = 4;
    send_obj.message = 'checktoken: unknown err';
    res.send(JSON.stringify(send_obj));
});

//  request bear fb_uid and fb_shortToken
router.post("/gettoken", utils.decryptRequest, utils.getToken, utils.extendFbAccessToken, isShopExisted, function(req, res, next) {
    var send_obj = {}
    if (req.invalidRequest == true) {
        // res.sendStatus(400);
        send_obj.err = 1;
        send_obj.message = 'checktoken: invalidRequest';
        res.send(JSON.stringify(send_obj));
        return;
    }
    if (req.body.isValid == false) {
        send_obj.err = 2;
        send_obj.message = 'checktoken: invalid fb_uid';
        res.send(JSON.stringify(send_obj));
        return;
    }    
    if (req.shop != null || req.shop != undefined) {
        send_obj.shop = req.shop;
        send_obj.isShop = 1;
    }
    encryptObject = req.body.encryptObject;
    send_obj.err = 0;
    send_obj.message = "ok";
    send_obj.encrypted_app_token = encryptObject;
    res.send(JSON.stringify(send_obj));
    // res.send('respond from api/gettoken with a resource');
});


router.post("/uploadImage", utils.decryptRequest, utils.checkToken, utils.writeImageToFile, function(req, res, next) {
    writeFileResult = req.writeFileResult;
    res.send(JSON.stringify(writeFileResult));
});

router.post("/createShop", utils.decryptRequest, utils.checkToken, function(req, res) {
    var createShopResult = {};
    createShopResult.err = 0;
    createShopResult.message = "Shop is created successfully";
    if (!req.isAppToken) {
        createShopResult.err = 1;
        createShopResult.message = "Cannot create a Shop: invalid Request";
        res.send(JSON.stringify(createShopResult));
        return;
    }
    if (hmap.has(req.body.uid)) {
        var update_Obj = hmap.get(req.body.uid);
        for (var item in req.body) {
            if (!(item == "id" || item == "token" || item == "key" || item == "data")) {
                update_Obj[item] = req.body[item];
            }
        }
        // Update to ShopManager and write down to database
        dbManager.addShop(update_Obj, function(err, msg) {
                // console.log("from router.post /createShop:", err, msg);
            });            
        res.send(JSON.stringify(createShopResult));
        return;
    }
    createShopResult.err = 2;
    createShopResult.message = "Cannot create a Shop: unknown reasons";
    res.send(JSON.stringify(createShopResult));
});

router.post('/updateItem',utils.decryptRequest, utils.checkToken, function(req,res,next){
    var createItemResult = {};
    createItemResult.err = 0;
    createItemResult.message = "Item is updated successfully";
    var item = req.body.item;
    if (!req.isAppToken || !item._productId) {
        createItemResult.err = 1;
        createItemResult.message = "Cannot create a Item: invalid Request";
        res.send(JSON.stringify(createItemResult));
        return;
    }    
    
    dbManager.checkShopWithFb_Uid(req.body.uid, function(err, obj) {
        //1. getShop information to compare pathNaame, fb_uid
        if(err || obj.fb_uid != req.body.uid|| item.shop != obj.pathName){
            createItemResult.err = 2;
            createItemResult.message = "Cannot create a Item: invalid Shop";
            res.send(JSON.stringify(createItemResult));
            return;
        }
        //1.b   normalize and validate obj properties
        // a Items
        if (item.hasOwnProperty('categories') && item.categories.constructor === Array){
            for(var i = 0; i < item.categories.length; i++){
                item.categories[i] = trim(item.categories[i]);
            }
        }else if(!item.categories.constructor === Array){
            createItemResult.err = 3;
            createItemResult.message = "Cannot create a Item: invalid categories type";
            res.send(JSON.stringify(createItemResult));
            return;   
        }
        
        // b Categories
        //2.    update information of Item to Shop          
        var _id = item._productId;
        
        item._id = _id;
        
        dbManager.updateItem(item,function(err, msg){
            if (err == 1){
                console.log(err);
                res.sendStatus(msg);
            }
            else{                
                res.send(JSON.stringify(createItemResult));
            }
        });
    });
})

function isShopExisted(req, res, next) {    
    // if(req.body.fromCreateNewShop != 1){
    //     next();
    //     return;
    // }
    dbManager.checkShopWithFb_Uid(req.body.uid, function(err, obj) {        
        if (obj != null || obj != undefined) {
            req.shop = {};
            for (var i in obj) {
                // console.log("checkShopWithFb_Uid:", i, obj[i]);
                if (!(i == "fb_uid" || i == "uid" || i == "items")) {
                    req.shop[i] = obj[i];
                }
            }
            // console.log("checkShopWithFb_Uid", req.shop);
            next();
            return;
        }
        req.shop = null;
        next();
    })
}
module.exports = router;
