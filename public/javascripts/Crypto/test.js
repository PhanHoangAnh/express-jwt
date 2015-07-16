
var cryptoUtil = require('./postJson_withEncrypt.js');
var cryptico = require('cryptico');

var fs = require('fs');
var savedKeyPair = JSON.parse(fs.readFileSync('../../../temp', 'utf8'));

var publicKey = savedKeyPair.public;


var mock_obj = {};
mock_obj.userName = "concho con meo va co gi nua day";
mock_obj.password = "123456"

var result = cryptoUtil.EncryptJSON(mock_obj, publicKey);

console.log('result: ', result);

// Decrypt result

console.log('PrivateKey: ', savedKeyPair.private);

var RSAKey = cryptico.RSAKey.parse(JSON.stringify(savedKeyPair.private));

var DecryptionResult = cryptico.decrypt(result, RSAKey);

console.log ('DecryptionResult: ', DecryptionResult.plaintext);

var DecryptRSA = JSON.parse(DecryptionResult.plaintext);

var aes_key = DecryptRSA.key;

var aes_userName = DecryptRSA.userName;

var aes_password = DecryptRSA.password;

var userName = cryptico.decryptAESCBC(aes_userName, aes_key); console.log ('userName: ', userName);

var password = cryptico.decryptAESCBC(aes_password, aes_key); console.log ('password: ', password);