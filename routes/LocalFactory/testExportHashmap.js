var map = require('./testHash').map;
var obj = require('./testHash');

 map.set('2','two');

// console.log('map ', map);

map.forEach(function(value,key){
	console.log('val: ', value, ' key: ', key);
});

// obj.getItems();

function Self_Destruct(time_ofLive){
	// this.id = time_ofLive;
	var self = this;
	// setTimeout(function(){
	// 	if(map.has(self)){
	// 		map.remove(self);
	// 	}		
	// 	console.log ("self removing ", time_ofLive, ' count: ', map.count(), ' try to get' , map.get(self), map.has(self) ," id: ", self.id);
	// 	self = undefined;
	// 	if (time_ofLive == 99){
	// 		obj.getItems();
	// 	}		
	// }, time_ofLive * 100);
}

for(var i = 1; i < 100; i++){
	self_destruct = new Self_Destruct(i);
	self_destruct.id = i;
	map.set(self_destruct, i);
}

setTimeout(function(){
	obj.getItems();
	var i ;
	map.forEach(function(val, key){
		i ++;
		val.newProperty = i;
		console.log (val);
	})
},1);

setTimeout(function(){
	console.log('after 10s ');
	map.forEach(function(val,key){
		console.log (val.newProperty);
	})
}, 10000);
