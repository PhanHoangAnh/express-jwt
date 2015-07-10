var express = require('express');
var config = require('../config');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.superSecret = config.secret;

mongoose.connect(config.database, function() {
        console.log(" mongodb is connected");
    })
    /* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


/// setup new user
router.post('/setup', check_isExisted, function(req, res, next) {

    var nick = new User({
        name: req.body.username,
        //password: req.body.password,
        password: bcrypt.hashSync(req.body.password, 10),
        admin: req.body.isAdmin
    });

    nick.save(function(err) {
        if (err) throw err;
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
router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        name: req.body.username
    }, function(err, user) {

        if (err) throw err;

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
                var token = jwt.sign(user, router.superSecret, {
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


var Auth = function(req, res, next) {
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
                message: 'Nick has been created'
            });
            //return next(new Error('User is existed'));
        } else {
            next();
        }

    }); //
};


// router.get('/testToken',Auth,function(req,res,next){
// 	res.render('Index', {
//         title: 'Authenticated..:D...wellcome with token with Get Method'
//     });
// });

router.use('/testToken', Auth, function(req, res, next) {
    var member = req.decoded.name;
    res.render('Index', {
        title: 'Authenticated..:D...Hello ' + member + '  with token with ' + req.method
    });
});
module.exports = router;
