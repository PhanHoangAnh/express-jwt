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

function getItem_byId(item_arrs, item){
	var i = 0;
	for (i = 0 ; i < item_arrs.length; i ++){
		if (item_arrs[i]._id == item._id){
			return i;
		}
	}
	return -1;
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
	}	
	var pos = getItem_byId(shop.items, item);
	if(pos<0){
		shop.items.push(item);
	}else{
		shop.items[pos] = item;
	}
	shop.categories = arrayUnique(shop.categories, item.categories);
	shop_maps.set(item.shop, shop);
};
Shop.removeItem = function(item){
	var shop = shop_maps.get(item.shop);
	var pos = getItem_byId(shop.items,item);
	shop.items.splice(pos,1);
	for(var i = 0; i< item.categories.length;i++){
		if (checkCat_inItems(item.categories[i], shop.items) == false){
			shop.categories.splice(shop.categories.indexOf(item.categories[i]),1);
			Shop.removeItem(shop, item);
		}
	}
	shop_maps.set(shop.pathName, shop);
}

// key property = _id
function Item(){
	this._id = mongoose.Types.ObjectId();
};
Item.prototype.shop = null;
Item.prototype.categories = [];

// key property = key;
function Category(){
	this._id =mongoose.Types.ObjectId();
};
Category.prototype.items = [];
Category.prototype.shops = [];
Category.addItem = function(item){
	var category;
	for (var i = 0 ; i < item.categories.length ; i ++){
		if (category_maps.has(item.category_arrs[i])){
			category = category_maps.get(item.categories[i]);
		}else{
			category = new Category();
		}
		var pos = getItem_byId(category.items, item);
		if(pos<0){
			category.items.push(item);
		}else{
			category.items[pos] = item;
		}
		category.shops = arrayUnique(category.shop_arrs, item.shop);
		category_maps.set(item.categories[i], category);
	}
}

Category.removeItem = function(shop,item){
	category_maps.forEach(function(val,key){
		var pos = getItem_byId(val.items,item);
		if (pos != -1){
			val.items.splice(pos, 1);
		}
		val.shops.splice(val.shops.indexOf(shop.pathName),1);
		if(val.shops.length == 0){
			category_maps.remove(key);
		}else{
			category_maps.set(key, val);
		}
	});
}

function updateItem(updateObj){	
	item_maps.set(updateObj._id, updateObj);
	Shop.addItem(updateObj);
	Category.addItem(updateObj);
}

function removeItem(item){
	item_maps.remove(item._id);
	Shop.removeItem(item);
}

function addShop (shop){
	shop._id =mongoose.Types.ObjectId();
	shop_maps.set(shop.pathName, shop);
}


exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.addShop = addShop;