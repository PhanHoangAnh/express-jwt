var dbEngine = require("./dbEngine");
var randomstring = require('randomstring');
var mongoose = require ("mongoose");

// var OrderOfFbUid = mongoose.model('OrderOfFbUid');

// var orderObject = new OrderOfFbUid();
// orderObject._id = mongoose.Types.ObjectId();
// orderObject.fb_uid = randomstring.generate(7);
// var items = [];
// for (var i = 0; i<5; i++){
// 	items[i] = randomstring.generate(7);
// }
// orderObject.items = items;
// orderObject.save(function(err){
// 	console.log(err);
// })

// console.log(mongoose.model('Shop'));
var Shop = mongoose.model('Shops');
Shop.find({},function(err,obj){
	console.log(obj);
})

// var savedObj = new Shop;
// savedObj._id 			 = mongoose.Types.ObjectId();
// savedObj.fb_uid          = randomstring.generate(7);
// savedObj.avatars         = randomstring.generate(7);
// savedObj.walls           = randomstring.generate(7);
// savedObj.longitude       = randomstring.generate(7);
// savedObj.latitude        = randomstring.generate(7);
// savedObj.pathName        = 'abcdef' //randomstring.generate(7);
// savedObj.showName        = randomstring.generate(7);
// savedObj.slogan          = randomstring.generate(7);
// savedObj.companyName     = randomstring.generate(7);
// savedObj.shop_description= randomstring.generate(7);
// savedObj.contact_phone   = randomstring.generate(7);
// savedObj.contact_email   = randomstring.generate(7);
// savedObj.address         = randomstring.generate(7);

// for (var i = 0;i< 8;i ++){
// 	savedObj.uid.push(randomstring.generate(7));
// 	savedObj.items.push(randomstring.generate(7));	
// 	savedObj.categories.push(randomstring.generate(7));
// 	savedObj.extends.push(randomstring.generate(7));
// }

// savedObj.save(function(err){
// 	console.log(err);
// })

// console.log(savedObj);

// savedObj.save(function(err){
// 	console.log(err);
// })

// console.log(savedObj);
// console.log(savedObj._id);