var hashmap = require("hashmap");
var map = new hashmap();
var list = new hashmap();

// console.log(list.constructor);
var Temp_Obj = function (){
	var self = this;
	setTimeout(function(){
		if(map.has(self.id)){
			map.remove(self.id);
		}
	},20);
}

for (var i = 0; i < 10; i ++){
	temp_obj = new Temp_Obj();
	temp_obj.id = i;
	map.set(i, temp_obj);
	list.set(i,temp_obj);
}

var removeObj = list.get(4);
removeObj = undefined;

list.remove(2);

console.log('------------Map---------------');

map.forEach(function(val, key){
	console.log(key, ':' , val, val.id);
});

console.log('------------List--------------');

list.forEach(function( val, key){
	val = val + 1
	console.log(key, ':' , val, val.id);
})

list.forEach(function( val, key){
	// val = val + 1
	console.log(key, ':' , val, val.id);
})


console.log('to Array: ?', list.values(), list.keys());

function addItem (){

}
addItem.addCategory = function(obj){
	console.log("from addCategory", obj.id);
}

var temp = {};
temp.id = "hello";
addItem.addCategory(temp);



