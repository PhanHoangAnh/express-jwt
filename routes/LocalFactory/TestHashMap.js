var HashMap = require('hashmap');
var map = new HashMap();


var clientToken = {};
clientToken.fb_shortID = "asdf";
clientToken.fb_longID = "12349842sdflkjdsfsafd";
clientToken.app_token = "dsdafkjqruodsfd";

var clientID = "concho con meo";

map.set(clientID, clientToken);

_has = map.has(clientID);	console.log("_has ", _has);
_obj = map.get(clientID);	console.log("_obj ", _obj );

console.log("is equal: ", clientToken === _obj);

_obj.app_token = "New Token";
map.set(clientID,_obj);

_chk = map.get(clientID);	console.log("_chk ", _chk);