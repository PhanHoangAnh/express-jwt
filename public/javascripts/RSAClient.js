var NodeRSA = require('node-rsa');


function Encrypt_withPublicKey(pub,plainText){

	var key = new NodeRSA(pub);	
	return key.encrypt(plainText,'base64');
};

function Decrypt_withPrivateKey(priv, encText){

	var key = new NodeRSA(priv);
	return key.decrypt(encText,'utf8');
};

var RSAUtil = {
	Encrypt_withPublicKey: Encrypt_withPublicKey,
	Decrypt_withPrivateKey: Decrypt_withPrivateKey
};

module.exports = RSAUtil;