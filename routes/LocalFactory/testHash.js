var hashmap = require("hashmap");
var map = new hashmap();

// map.set("1", 'first');

function getItems (){
	map.forEach(function(val,key){
		console.log('val--> ', val , 'key--> ', key);
	})
}

map.set(1, {}),
map.set(2, {}),

map.forEach(function(val,key){
	var arr = 'abcedefgh'
	for (i = 0; i< arr.length; i++){
		var temp = arr.substring(i, i+1);
		val[temp] = temp;
	}
})

map.forEach(function(val,key){
	console.log('val: ', val  , key);
})



exports.map = map;
exports.getItems = getItems;


