var express = require('express');
var cryptico = require('cryptico');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var qs = require('qs');
var config = require('./config.js');
var request = require('request');
var hashmap = require("hashmap");
var map = new hashmap();


var callbackURL = 'http://' + process.env.OPENSHIFT_APP_DNS + '/callback';
var APP_ID = '203172309854130';
var APP_SECRET = 'd3fd1a8f36378cd23637970796855301';

var superSecret = config.secret;
var keyPair = config.keyPair;


function decryptRequest(req, res, next) {
    var RSAKey = cryptico.RSAKey.parse(JSON.stringify(keyPair.private));
    var encrypt_Request = req.body.data;
    if (encrypt_Request === null || encrypt_Request === undefined) {
        req.invalidRequest = true;
        // console.log("req.body.data: ", encrypt_Request);
        next();
        return;
    }
    try {
        var DecryptionResult = cryptico.decrypt(encrypt_Request, RSAKey);
        var DecryptRSA = JSON.parse(DecryptionResult.plaintext);

        var aes_key = DecryptRSA.key;
        var aes_userName = DecryptRSA.userName;
        var aes_password = DecryptRSA.password;
        var userName = cryptico.decryptAESCBC(aes_userName, aes_key);
        var password = cryptico.decryptAESCBC(aes_password, aes_key);
        req.body.uid = userName;
        req.body.token = password;
        req.body.key = aes_key;
        next();
    } catch (err) {
        // var err = new Error('Bad request');
        // err.status = 400;
        req.invalidRequest = true;
        next();
    }
}
//  request bear fb_uid and app_token;
function checkToken(req, res, next) {
    if (req.invalidRequest == true) {
        next();
        return;
    }
    var fb_uid = req.body.uid;
    var app_token = req.body.token;

    req.isAppToken = false;
    //  if token is existed in hashmap then return status of app_token is valid

    if (map.has(fb_uid)) {        
        var checkObject = map.get(fb_uid);
        if (checkObject.app_token == app_token) {
            // check validity of app_token
            jwt.verify(app_token, superSecret, decodeJwt);
        }
    } else {
        next();
    }

    function decodeJwt(err, decoded) {
        // console.log("decoded: ", decoded);
        if (!err) {
            req.isAppToken = true;
            next();
            return;
        }        
        next();
    }
}
//  request bear fb_uid and fb_shortToken
function getToken(req, res, next) {
    var fb_uid = req.body.uid;
    var fb_token = req.body.token;
    // make a request to Facebook to check the validity of fb_uid and fb_token
    var params = {
        access_token: fb_token,
        fields: "id"
    };
    request.get({
        url: ' https://graph.facebook.com/me',
        qs: params
    }, function(err, resp, body) {
        req.body.isValid = false;
        var results = qs.parse(body);
        for (var item in results) {
            var finalObject = JSON.parse(item);
            if (finalObject.id != null || finalObject.id != undefined) {
                if (finalObject.id == fb_uid) {
                    req.body.isValid = true;
                }
            }
        }
        next();
    });
}

function extendFbAccessToken(req, res, next) {
    if (req.body.isValid == false) {
        next();
        return;
    }
    var fb_uid = req.body.uid;
    var fb_token = req.body.token;
    var params = {
        client_id: APP_ID,
        client_secret: APP_SECRET,
        fb_exchange_token: fb_token
    };
    request.get({
        url: 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token',
        qs: params
    }, function(err, resp, body) {
        var results = qs.parse(body);
        if (results.access_token == undefined) {
            // console.log("wrong fb_key");
            next();
            return;
        }
        var obj = new MemberHandler();
        obj.fb_uid = fb_uid;
        obj.longFb_token = results.access_token;
        obj.shortFb_token = fb_token;
        var app_token = jwt.sign(obj, superSecret, {
            expiresInMinutes: 2880 // expires in 48 hours
        });
        obj.app_token = app_token;
        map.set(fb_uid, obj);
        req.app_token = app_token;
        // encrypt token then sendback to client
        var obj_token = {};
        obj_token.app_token = app_token;
        var key = req.body.key;
        encryptObject = cryptico.encryptAESCBC(JSON.stringify(obj_token), key);
        req.body.encryptObject = encryptObject;
        next();
    });
}

function writeImageToFile(req, res, next) {
    if(!req.isAppToken){        
        next();
        return;
    }
    var _image_fileName
    var type = req.body.u_type
    if (type == "Products"){
        _image_fileName = './public/products/' + req.body.imgName + '.png';
    }else{
        _image_fileName = './public/shops/'+type+'/' + req.body.uid + '.png';
            if (map.has(fb_uid)){
            var _obj = map.get(fb_uid);
            _obj[type] = _image_fileName;        
        }
    }
    var fb_uid = req.body.uid;
    // Store in temporary cache and write to database

    // Write to file
    var b64_data = req.body.img.replace(/^data:image\/png;base64,/, "");

    writeFileResult = {};
    writeFileResult.file_length = b64_data.length;
    writeFileResult.err = 0;
    writeFileResult.err.desc = "";
    fs.writeFile(_image_fileName, b64_data, 'base64', function(err) {        
        if(err){
            //res.sendStatus(500);
            writeFileResult.err = 1;
            writeFileResult.err.desc = err;
            }
    writeFileResult.uploadType = type;
    req.writeFileResult = writeFileResult;    
    next();    
    });
}

function MemberHandler(){
    var self = this;    
    setTimeout(function(){        
        if (map.has(self.fb_uid)){
            map.remove(self.fb_uid);            
        }        
        self = undefined;
    }, 1000*3600*24*2 )    
}

exports.hmap = map;
exports.decryptRequest = decryptRequest;
exports.checkToken = checkToken;
exports.getToken = getToken;
exports.extendFbAccessToken = extendFbAccessToken;
exports.writeImageToFile = writeImageToFile;

