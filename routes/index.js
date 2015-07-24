var express = require('express');
var config = require('../config');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var cryptico = require('cryptico');
var User = require('../models/user');

//console.log('GenRSAKeyPair....')
var fs = require('fs');
var keyPair = JSON.parse(fs.readFileSync('temp', 'utf8'));
var fs = require('fs');
//console.log(keyPair);

var superSecret = config.secret;


mongoose.connect(config.database, function(error) {
    console.log(" mongodb is connecting...");
    if (error) {
        throw error; // Handle failed connection
    }
    console.log('conn ready:  ' + mongoose.connection.readyState);

})

router.use(function(req, res, next) {
    // console.log('conn ready:  '+ mongoose.connection.readyState);
    // next();
    if (mongoose.connection.readyState == 0) {
        var err = new Error('Database Error');
        err.status = 503;
        next(err);
    }
    next();

})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/check', function(req, res, next) {

});

router.get('/setup', function(req, res, next) {
    //console.log(" Public key: ", keyPair.public);
    res.render('registry', {
        data: keyPair.public
    });;

});

/// setup new user
//router.post('/setup',decrypt_Request, check_isExisted, function(req, res, next) {
router.post('/setup', decrypt_Request, check_isExisted, writeImageToFile, function(req, res, next) {

    //console.log('setup: ', req.body);        
    var nick = new User({
        name: req.body.username,
        //password: req.body.password,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
        admin: req.body.isAdmin
    });

    nick.save(function(err) {
        if (err) {
            throw err;
        }
        console.log('User saved successfully');
        res.json({
            success: true
        });
    });

});

// Show all users

router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/login', decrypt_Request, function(req, res) {
    // find the user
    User.findOne({
        name: req.body.username
    }, function(err, user) {
        if (err) {
            console.log("Error:-----------: ", err);
            throw err;
        }
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches
            //if (user.password != req.body.password) {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, superSecret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

router.use('/testToken', Auth, function(req, res, next) {
    var member = req.decoded.name;
    res.render('Index', {
        title: 'Authenticated..:D...Hello ' + member + '  with token with ' + req.method
    });
});

function Auth(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, router.superSecret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                //console.log(decoded);
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

function check_isExisted(req, res, next) {
    // If nick is existed then return
    User.findOne({
        name: req.body.username
    }, function(err, user) {
        if (user) {
            console.log('user is existed');
            res.json({
                success: false,
                message: 'Nick is existed already'
            });
            //return next(new Error('User is existed'));
        } else {
            next();
        }

    }); //
};

function decrypt_Request(req, res, next) {
    var RSAKey = cryptico.RSAKey.parse(JSON.stringify(keyPair.private));
    var encrypt_Request = req.body.data;
    //console.log("encrypted request: ", req.body.data);
    var DecryptionResult = cryptico.decrypt(encrypt_Request, RSAKey);
    var DecryptRSA = JSON.parse(DecryptionResult.plaintext);

    var aes_key = DecryptRSA.key;
    var aes_userName = DecryptRSA.userName;
    var aes_password = DecryptRSA.password;

    var userName = cryptico.decryptAESCBC(aes_userName, aes_key);
    //console.log('userName: ', userName);
    var password = cryptico.decryptAESCBC(aes_password, aes_key);
    //console.log('password: ', password);

    req.body.username = userName;
    req.body.password = password;
    next();
};

function writeImageToFile(req, res, next) {
    var fileName = '../public/images/avatars/' + req.body.username + '.png';
    var b64_data = req.body.avatar.replace(/^data:image\/png;base64,/, "");    
    console.log("file size: ",b64_data.length);
    fs.writeFile(fileName, b64_data, 'base64', function(err) {
        if(err){
            console.log(err);    
        }else{
            console.log("writeFile success:");
        }        
        //res.json({err: err});
    });
    req.body.avatar = fileName;
    next();
}

module.exports = router;
