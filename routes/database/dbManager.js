var hashmap = require('hashmap');
var mongoose = require('mongoose');

var shop_maps = new hashmap();
var item_maps = new hashmap();
var category_maps = new hashmap();

// From http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
function arrayUnique(a, b) {
    return c = a.concat(b.filter(function(item) {
        return a.indexOf(item) < 0;
    }));
}

function checkCat_inItems(cat, items){
	for (i = 0 ; i< items.length; i++){
		if (items[i].categories.indexOf(cat) != -1){
			return true;
		}
	}		
	return false;
}

// key property = pathName
function Shop(){
	
};
Shop.prototype.items  = [];
Shop.prototype.categories = [];
Shop.addItem = function(item){
	var shop;
	if (shop_maps.has(item.shop)){
		shop = shop_maps.get(item.shop);
	}else{
		shop = new Shop();
		shop.pathName = item.shop;
	}	
	var pos = shop.items.indexOf(item._id);	
	if(pos == -1){
		shop.items.push(item);
	}else{
		shop.items[pos] = item;
	}
	shop.categories = arrayUnique(shop.categories, item.categories);
	shop_maps.set(item.shop, shop);
	// update to database
};
Shop.removeItem = function(item){
	var shop = shop_maps.get(item.shop);
	var pos = shop.items.indexOf(item._id);
	shop.items.splice(pos,1);
	for(var i = 0; i< item.categories.length;i++){
		if (checkCat_inItems(item.categories[i], shop.items) == false){
			shop.categories = shop.categories.splice(shop.categories.indexOf(item.categories[i]),1);
			Category.removeItem(item, shop.pathName);
		}else{
			Category.removeItem(item);
		}
	}
	shop_maps.set(shop.pathName, shop);
	// update to database
}

// key property = _id
function Item(){
	// this._id = mongoose.Types.ObjectId();
};
Item.prototype.shop = null;
Item.prototype.categories = [];

// key property = key;
function Category(){
	// this._id =mongoose.Types.ObjectId();
};
Category.prototype.items = [];
Category.prototype.shops = [];
Category.addItem = function(item){
	var category;
	for (var i = 0 ; i < item.categories.length ; i ++){
		if (category_maps.has(item.categories[i])){
			category = category_maps.get(item.categories[i]);			
		}else{
			category = new Category();
			category.shops = [item.shop];
			category.items = [item._id];
		}
		var pos = category.items.indexOf(item._id);
		if(pos== -1){
			category.items.push(item._id);
		}				
		category.shops = arrayUnique(category.shops, new Array(item.shop));
		category_maps.set(item.categories[i], category);
		// update to database
	}
}

Category.removeItem = function(item, shop){
	category_maps.forEach(function(val,key){
		var pos = val.items.indexOf(item._id);
		if(shop){			
			val.shops.splice(val.shops.indeOf(shop),1);
		}
		if (pos != -1){			
			val.items.splice(pos, 1);
		}
		if(val.items.length == 0){
			category_maps.remove(key);
		}else{
			category_maps.set(key, val);
		}
		// update to database
	});
}

function updateItem(updateObj, fn){		
	item_maps.set(updateObj._id, updateObj);
	Shop.addItem(updateObj);
	Category.addItem(updateObj);
	if(fn){
		fn(shop_maps,item_maps,category_maps);
	}
	// update to database
}

function removeItem(item, fn){
	item_maps.remove(item._id);
	Shop.removeItem(item);
	if (fn){
		fn(shop_maps,item_maps,category_maps);	
	}
	// update to database
}

function addShop (shop){
	shop._id =mongoose.Types.ObjectId();
	shop_maps.set(shop.pathName, shop);
	// update to database
}

function removeShop(shop){
	for (var i = 0; i< shop.items.length; i ++){
		removeItem(shop.items[i]);
	}
	shop_maps.remove(shop.pathName);
	// update to database
}

exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.addShop = addShop;
exports.removeShop = removeShop;