var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var dbManager = require("./database/dbManager.js");
var items = dbManager.item_maps;


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

router.get("/addItem", function(req, res, next) {
    objId = mongoose.Types.ObjectId();
    //1. check valid itemNumber
    res.render('addItem.ejs', {
        data: keyPair.public,
        title: "addItem",
        itemNumber: objId,
        isItem: false,
        item: null
    });
});

router.get("/addItem/:itemNumber", function(req, res, next) {
    // console.log("from create_new :", req.params.itemNumber);
    var _id = req.params.itemNumber;
    // console.log(items.has(_id));
    var isItem = false;
    var item = null;
    var objId;    
    
    if (items.has(_id)){
        objId = _id;
        isItem = true;
        item = items.get(_id);
        delete item.fb_uid
    } else {
        objId = mongoose.Types.ObjectId();
    }
    //1. check valid itemNumber

    res.render('addItem.ejs', {
        data: keyPair.public,
        title: "addItem",
        itemNumber: objId,
        isItem: isItem,
        item: item
    });
});

module.exports = router;
