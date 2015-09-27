var express = require('express');
var router = express.Router();
var utils = require('./middlewares/utils.js');

router.get('/', function(req, res, next) {
    res.send('respond from api with a resource');
});

//  request bear fb_uid and app_token;
router.post("/checktoken", utils.decryptRequest, utils.checkToken, function(req, res, next) {

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
router.post("/gettoken", utils.decryptRequest, utils.getToken, utils.extendFbAccessToken, function(req, res, next) {
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
        send_obj.message = 'checktoken: fb_uid';
        res.send(JSON.stringify(send_obj));
        return;
    }

    encryptObject = req.body.encryptObject;
    send_obj.err = 0;
    send_obj.message = "ok";
    send_obj.encrypted_app_token = encryptObject;
    res.send(JSON.stringify(send_obj));
    // res.send('respond from api/gettoken with a resource');
});

router.post("/uploadImage",utils.decryptRequest,utils.checkToken, utils.writeImageToFile, function(req,res,next){
    writeFileResult = req.writeFileResult;
    res.send(JSON.stringify(writeFileResult));
});

router.post("/createShop", function(req,res,next){
    console.log('createShop..', req.body);
    next();
},
 utils.decryptRequest, utils.checkToken, function(req,res){
    var createShopResult = {};
    createShopResult.err = 0;
    createShopResult.message = "Shop is created successfully";
    if (!req.isAppToken){
        createShopResult.err = 1;
        createShopResult.message = "invalidRequest";
    }    
    res.send(JSON.stringify(createShopResult));

});


module.exports = router;
