var mongoose = require('mongoose');
var hashmap = require('hashmap');

// shops_map[i] = {shop.pathName, shop()}
var shop_maps = new hashmap();
// items_map[i] = {item()._id, item()}
var item_maps = new hashmap();
// category_map[i] = {category.key, category}
var category_maps = new hashmap();


// From http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
var arrayUnique = function(a, b) {    
    return c = a.concat(b.filter(function(item) {
        return a.indexOf(item) < 0;
    }));
}

function shop() {
    this._id = mongoose.Types.ObjectId();
};
shop.prototype.item_lists = [],
    shop.prototype.category_lists = []


function item() {
    this._id = mongoose.Types.ObjectId();
};
// Add more properties
item.prototype.shop_pathName = null;
item.prototype.category_lists = [];

function category() {
    this._id = mongoose.Types.ObjectId();
}
category.prototype.key = null;
category.prototype.item_lists = [];
category.prototype.shop_lists = [];


// importand property of each type
// category.key, shop.pathName, item._id
function updateShop(updated_obj) {
    var _sh = new shop;
    // update attribute here
    shops_map.set(_sh.pathName, _sh);
}


function updateItem(updated_obj) {
    var _item = new item();
    for (var i in updated_obj) {
        _item[i] = updated_obj[i];
    }
    // update item_maps and shop_maps	
    item_maps.set(_item._id, _item);
    var _shop = shop_maps.get(updated_obj.shop_pathName);

    var _item_arr = [];
    var _shop_arr = [];

    _item_arr.push(_item._id);
    _shop_arr.push(updated_obj.shop_pathName);

    _shop.item_lists = arrayUnique(_shop.item_lists, _item_arr);
    _shop.category_lists = arrayUnique(_shop.category_lists, updated_obj.category_lists)
    shop_maps.set(updated_obj.shop_pathName, _shop);

    // update category_map.item_list[] and category.shop_list[]
    var categories = updated_obj.category_lists;
    var _cat_maps = category_maps.keys();
    var joint_cats = arrayUnique(categories, _cat_maps);
    for (var i = 0; i < joint_cats.length; i++) {
        var _cat;
        if (category_maps.has(joint_cats[i])) {
            _cat = category_maps.get(joint_cats[i]);
            _cat.shop_list = arrayUnique(_cat.shop_list, _shop_arr);
            _cat.item_lists = arrayUnique(_cat.item_lists, _item_arr);
            category_maps.set(joint_cats[i], _cat);
        } else {
            _cat = new category();
            _cat.key = joint_cats[i];
            _cat.shop_list = _shop_arr;
            _cat.item_lists = _item_arr;
            category_maps.set(joint_cats[i], _cat);
        }
    }
}


function deleteShop(updated_obj) {

}

function deleteItem(updated_obj) {

}


console.log(new shop()._id);
