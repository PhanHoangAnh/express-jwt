var RSAUtil = require ('./RSAClient');

/// This section for testing purpose only

//var fs = require('fs');

var savedKeyPair = {
    "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnddFVXm1w7NP6XD04UQd\n+igI6F8siqyMhpMudkzvUyEhnjl3MiNcMQy5qTO+2HzuLQP9+XdQgwrFyf8agTkz\n32SDweW4OpRZ1dF12bQ4zIikZK6e+qNlLlxwqtHLlpBTI6BieULvyt6BMLnSFm2f\n1QX6VQwjoECFUoH+mAzWWubpjECAxNA3VJXH0t9qZO7Ovhxh0zgi8k6jqUZB3lXd\nWnr0DuU7mA5fWJlRX56NuXCVaLuAiQa69NdlXXTqbRAehedkZh9x3YLbePZ120Fm\nm3jUx7wHGb8PipkUBH80Hm4OESUKYVdwfHyuQO2kUrY7xlmVf7lz0VziPDoFr1bO\nRQIDAQAB\n-----END PUBLIC KEY-----",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAnddFVXm1w7NP6XD04UQd+igI6F8siqyMhpMudkzvUyEhnjl3\nMiNcMQy5qTO+2HzuLQP9+XdQgwrFyf8agTkz32SDweW4OpRZ1dF12bQ4zIikZK6e\n+qNlLlxwqtHLlpBTI6BieULvyt6BMLnSFm2f1QX6VQwjoECFUoH+mAzWWubpjECA\nxNA3VJXH0t9qZO7Ovhxh0zgi8k6jqUZB3lXdWnr0DuU7mA5fWJlRX56NuXCVaLuA\niQa69NdlXXTqbRAehedkZh9x3YLbePZ120Fmm3jUx7wHGb8PipkUBH80Hm4OESUK\nYVdwfHyuQO2kUrY7xlmVf7lz0VziPDoFr1bORQIDAQABAoIBAADhqON3UIqNP87/\n8H4pkTlKa/JQRcFogUhnHgVPHK8MKlHl5EKFbAhiF89YGKLA39ukgBCal/qDXuNn\n50/9b8q5lvrIO6UoGvBUwSG8He0WfkSJrR2dN/1wSrjJfyeSGsTCKoqe0xQA9hu9\njezOI+xeoi1DaheFBLmXPELBH5lWWn/7TwU1VtXeeH4Hqqtt3LOIFISmR1lP5qfB\nRQAOLtTHYud4hS359I3IEmNegPbgIjvhQEO68VF82YfMW/ou24u0ihYleWDL214f\n1hjrizD5mvjq/wdd4Q63FjXBLYtXdjwWyCuSyfAFO0PLsqB0oxsNCNFs1OmlWhYj\nlgcqdgECgYEA+B9d4zvBcFiLPyfluh9fr/MmXY93H/gXzdyzXsv+bQN2qPdI/DX8\nWFNazAf4668nygY1T+3dnGTzilj0PBxE22b6QxBD+XUI2FK79/ylLE803XhYwMWk\ngl+ho2mXT/3TMwLlKHJS/7tWaCrQfCxjH+wquHf56CFWRKMdLHR/p0ECgYEAotoi\nQ6TIzSJMB55GI51ReiVX58axn/DyT76jJUreg0B7bBEEtfFdMpIYobYmGWGlvskB\nMVGSs/GyLn+vAHjHQVQGdMpGHrBbHyP8yOGovW6uUd9/SkV6x4GZEOQTv2RylWyq\nBKhmtLwik7TqgCxvZNBK7uUFQTYix+vglChQCgUCgYEA9tbNongaEtgjfysD4cvA\nd9xfeIh3LDi2BbjgQRiT/oOJksKfuzlB1+Tk2UG9I0rXPKY8d03eP+42UpX4M6yz\n28lwgzM1TIBf0kVMdoLDF3ec0g8dzHlTFdhph5ZOT+fmKkNhEoHZjEwkw/CEBGRs\nIJ/kSCwjVAmGNzZGmak0LYECgYAEU4EnhOAkuu2EIktAtPQuJ4HPUXL0icUWIz1Y\nR0Xj/LmKpGUYpEHSjxkCasFWWUa668IRWlZoW1pda9ztSUgZzy6guaLlO9Af4qfb\neksuRRtyZ1qNUY0ycZnsXfK8WeHFYG6f0w1vbbQJcnvsTcHjzri+4eyiz9par0R3\nCx8dNQKBgQDDC4UERF3HQwRifmX9x8wfS9+ugckKZUB8rVkYhwb01azkRmvLjCly\n94oN0TBiyDI6z99/AcUEddtf9O8uDkxL6uzYCYv05UNCv3kyS2I8aeSJ7uRYAt8g\n4iqTCN7NrSJdlhNVreEg3Vn4ZGFgoImyaInZ5M8FULkzlylg66DJog==\n-----END RSA PRIVATE KEY-----"
}

var PlainText = "co con vat than kinh";
var EncryptedText = RSAUtil.Encrypt_withPublicKey(savedKeyPair.publicKey, PlainText);
console.log (' EncryptedText: ', EncryptedText);
var DecryptedText = RSAUtil.Decrypt_withPrivateKey(savedKeyPair.privateKey, EncryptedText);
console.log ('DecryptedText: ', DecryptedText);

console.log(PlainText == DecryptedText);

/// End of testing section
/// Call in Browser purpose

function Encrypt_withPubRSA(text){
	return RSAUtil.Encrypt_withPublicKey(savedKeyPair.publicKey,text);
};

function Decrypt_withPrivRSA(encText){
	return RSAUtil.Decrypt_withPrivateKey(savedKeyPair.privateKey,encText);	
}

var RSA = {
	Encrypt_withPubRSA: Encrypt_withPubRSA,
	Decrypt_withPrivRSA: Decrypt_withPrivRSA
}

module.exports = RSA