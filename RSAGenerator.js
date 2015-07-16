var cryptico = require('cryptico');
var jsonfile = require('jsonfile');


var seed = "something very special";
var bits = 2048;

var RSAKey = cryptico.generateRSAKey(seed,bits);

var KeyStore = {};

KeyStore.public = cryptico.publicKeyString(RSAKey);
KeyStore.private = RSAKey.toJSON();

jsonfile.writeFile('temp', KeyStore, function(err) {
    console.error(err)
})


