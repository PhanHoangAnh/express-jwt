var cryptico = require('cryptico');

function EncryptJSON(jSon, publicKey, aesKey) {
    // Encrypt username and pass with AESkey and then replace
    // plain username/pass by aes_username and aes_password
    // also add key inside this JSON object
    if (jSon.userName == null || jSon.password == null || publicKey == null) {
        return null;
    }

    var userName = jSon.userName;
    var password = jSon.password;
    var aes_key;
    if (aesKey == null || aesKey == undefined) {
        aes_key = cryptico.generateAESKey();
    } else {
        aes_key = aesKey;
    }

    jSon.userName = cryptico.encryptAESCBC(userName, aes_key);
    jSon.password = cryptico.encryptAESCBC(password, aes_key);
    jSon.key = aes_key;
    //Stringify this json object and then encrypt json_string by publicKey
    var string_aesObject = JSON.stringify(jSon);
    var EncryptionResult = cryptico.encrypt(string_aesObject, publicKey).cipher;
    // console.log('EncryptionResult : ', EncryptionResult);
    // post back to url
    return EncryptionResult;
}

function generateAESKey() {
    return cryptico.generateAESKey();
}

function aesDecryptor(encryptedMsg, aes_key) {
    return cryptico.decryptAESCBC(encryptedMsg, aes_key);
}

var cryptoUtil = {};
cryptoUtil.EncryptJSON = EncryptJSON;
cryptoUtil.generateAESKey = generateAESKey;
cryptoUtil.aesDecryptor = aesDecryptor;

module.exports = cryptoUtil;
