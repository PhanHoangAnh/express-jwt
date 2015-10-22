var hashmap = require('hashmap');
var mongoose = require('mongoose');
var shop_maps = new hashmap();
var item_maps = new hashmap();
var category_maps = new hashmap();
var dbEngine = require("./dbEngine.js");

function init() {
    var _shop = mongoose.model('Shops');
    _shop.find({}, function(err, shops) {
        shops.forEach(function(s) {
            if (!s.items) {
                s.items = [];
            }
            shop_maps.set(s.pathName, s);
            for (var i = 0; i < s.items.length; i++) {
                item_maps.set(s.items[i]._id.toString(), s.items[i]);
                Category.addItem(s.items[i]);
            }
        })
    })
}

init();
// From http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
function arrayUnique(a, b) {
    return c = a.concat(b.filter(function(item) {
        return a.indexOf(item) < 0;
    }));
}

function checkCat_inItems(cat, items) {
    for (i = 0; i < items.length; i++) {
        if (items[i].categories.indexOf(cat) != -1) {
            return true;
        }
    }
    return false;
}

// key property = pathName
function Shop() {

};
Shop.prototype.items = [];
Shop.prototype.categories = [];
Shop.addItem = function(item, fn) {
    if (item._id == null || item._id == undefined) {
        if (fn) {
            fn(1, "missing item._id");
        }
        return;
    }
    var shop;
    if (shop_maps.has(item.shop)) {
        shop = shop_maps.get(item.shop);
    } else {
        // shop = new Shop();
        // shop.pathName = item.shop;
        fn(1, "cannot find a Shop, from Shop.addItem");
    }

    var checkFlag = false;

    if (!(shop.items && shop.items.constructor === Array)) {
        if (fn) {
            fn(2, "missing item array of Shop");
        }
        return;
    }
    for (var i = 0; i < shop.items.length; i++) {
        if (shop.items[i]._id == item._id) {
            checkFlag = true;
            var temp_item = shop.items[i];
            shop.items[i] = item;
            break;
        }
    }

    if (!(shop.categories && shop.categories.constructor === Array) || !(item.categories && item.categories.constructor === Array)) {
        if (fn) {
            fn(3, "missing item array of categories");
        }
        return;
    }
    if (checkFlag == false) {
        shop.items.push(item);
        //update categories for shop        
    } else {
        for (var i = 0; i < temp_item.categories.length; i++) {
            // not existed == false
            if (checkCat_inItems(temp_item.categories[i], shop.items) == false) {
                shop.categories.splice(shop.categories.indexOf(temp_item.categories[i]), 1);
                Category.removeItem(temp_item, shop.pathName);
            } else {
                Category.removeItem(temp_item);
            }
        }
    }
    shop.categories = arrayUnique(shop.categories, item.categories);
    shop_maps.set(item.shop, shop);
    setTimeout(function() {
        ShopToDb(shop, true);
    }, 200);
    if (fn) {
        fn(null, "item is added successfully");
    }
};
Shop.removeItem = function(item, fn) {
    if (!shop_maps.has(item.shop)) {
        if (fn) {
            fn(1, "invalid shop.pathName");
        }
        return;
    }
    var shop = shop_maps.get(item.shop);
    if (!(shop.items && shop.items.constructor === Array) || !(shop.items && shop.items.constructor === Array) || !(shop.categories && shop.categories.constructor === Array)) {
        if (fn) {
            fn(2, 'invalid shop properties');
        }
        return;
    }
    var _item;
    for (var i = 0; i < shop.items.length; i++) {
        if (shop.items[i]._id == item._id) {
            checkFlag = true
                // shop.items[i]= item;
            _item = shop[i];
            var pos = shop.items.indexOf(item);
            shop.items.splice(pos, 1);
        }
    }
    if (!item || !(item.categories && item.categories.constructor === Array)) {
        if (fn) {
            fn(3, 'invalid item');
        }
        return;
    }
    // shop.items.splice(pos, 1);
    for (var i = 0; i < item.categories.length; i++) {
        if (checkCat_inItems(item.categories[i], shop.items) == false) {
            shop.categories.splice(shop.categories.indexOf(item.categories[i]), 1);
            Category.removeItem(item, shop.pathName);
        } else {
            Category.removeItem(item);
        }
    }
    if (fn) {
        fn(0, null);
    }
    // update to database
    setTimeout(function() {
        ShopToDb(shop, true);
    }, 200);
}

// key property = _id
function Item() {
    // this._id = mongoose.Types.ObjectId();
};
Item.prototype.shop = null;
Item.prototype.categories = [];

// key property = key;
function Category() {
    // this._id =mongoose.Types.ObjectId();
};
Category.prototype.items = [];
Category.prototype.shops = [];
Category.addItem = function(item) {
    var category;
    for (var i = 0; i < item.categories.length; i++) {
        if (category_maps.has(item.categories[i])) {
            category = category_maps.get(item.categories[i]);
        } else {
            category = new Category();
            category.shops = [item.shop];
            category.items = [item._id];
        }
        var pos = category.items.indexOf(item._id);
        if (pos == -1) {
            category.items.push(item._id);
        }
        category.shops = arrayUnique(category.shops, new Array(item.shop));
        category_maps.set(item.categories[i], category);
        // update to database
    }
}

Category.removeItem = function(item, shop) {
    category_maps.forEach(function(val, key) {
        var pos = val.items.indexOf(item._id);
        if (shop) {
            val.shops.splice(val.shops.indexOf(shop), 1);
        }
        if (pos != -1) {
            val.items.splice(pos, 1);
        }
        if (val.items.length == 0) {
            category_maps.remove(key);
        } else {
            category_maps.set(key, val);
        }
        // update to database
    });
}

function updateItem(updateObj, fn) {

    if (updateObj.shop == null || updateObj.shop == undefined) {
        return fn(1, 'invalid pathName');
    }
    if (!shop_maps.has(updateObj.shop)) {
        var m_Shop = mongoose.model('Shops');
        m_Shop.findOne({
            pathName: updateObj.shop
        }, function(err, shop) {
            if (err) {
                return fn(1, 'invalid pathName');
            } else {
                shop_maps.set(shop.pathName, shop);
                f_update();
            }
        });
    } else {
        f_update();
    }

    function f_update() {
        // 
        item_maps.set(updateObj._id.toString(), updateObj);
        Shop.addItem(updateObj, function(err, msg) {
            if (err) {
                return fn(err, msg);
            } else {
                for (var i = 0; i < shop_funcs_stack.length; i++) {
                    shop_funcs_stack[i].call(shop_maps);
                }
            }
        });
        Category.removeItem(updateObj, updateObj.shop);
        Category.addItem(updateObj);
        if (fn) {
            return fn(shop_maps, item_maps, category_maps);
        }
    }
}


function removeItem(item, fn) {
    if (item.shop == null || item.shop == undefined || !shop_maps.has(item.shop)) {
        return fn(1, 'invalid pathName');
    }
    item_maps.remove(item._id);
    Shop.removeItem(item, function(err, msg) {
        if (fn) {
            fn(err, msg);
        }
        if (err == 0) {
            for (var i = 0; i < shop_funcs_stack.length; i++) {
                shop_funcs_stack[i].call(shop_maps);
            }
        }
    });

    // update to database
}

function addShop(shop, fn) {
    if (shop.pathName == null || shop.pathName == undefined) {
        return fn(1, 'invalid pathName');
    }
    checkShopWithFb_Uid(shop.fb_uid, function(err, objs) {
        if (objs == null) {
            shop._id = mongoose.Types.ObjectId();
            shop_maps.set(shop.pathName, shop);
            fn(null, null);
            // update to database
            ShopToDb(shop, false);
        } else {
            shop._id = objs._id;
            shop_maps.set(objs.pathName, shop);
            ShopToDb(shop, true);
            fn(null, objs);
            return;
        }
        for (var i = 0; i < shop_funcs_stack.length; i++) {
            shop_funcs_stack[i].call(shop_maps);
        }
    });
}

function removeShop(shop, fn) {
    for (var i = 0; i < shop.items.length; i++) {
        removeItem(shop.items[i]);
    }
    shop_maps.remove(shop.pathName);
    // update to database
    for (var i = 0; i < shop_funcs_stack.length; i++) {
        shop_funcs_stack[i].call(shop_maps);
    }
}

function ShopToDb(shop, isUpdate, fn) {
    var Shop = mongoose.model('Shops');
    var _shop;
    if (isUpdate == false) {
        _shop = new Shop();
        for (var i in shop) {
            _shop[i] = shop[i];
        }
        _shop.save(function(err) {
            if (err && fn) {
                fn(1, err);
                return;
            }
        });
    } else {
        Shop.findById(shop._id, function(err, sh) {
            if (err && fn) {
                fn(2, err);
                return;
            }
            // sh = shop;            
            for (var i in shop) {
                sh[i] = shop[i];
            }
            sh.markModified('items');
            sh.markModified('categories');
            sh.save(function(error) {
                if (error && fn) {
                    fn(3, error);
                    return;
                }
            })
        });
    }
    if (fn) {
        fn(null, "save successfully");
    }

}

function checkShopWithFb_Uid(_uid, cb) {
    var Shop = mongoose.model('Shops');
    Shop.findOne({
        fb_uid: _uid
    }, function(err, obj) {
        if (obj) {
            cb(0, obj.toObject());
            return true;
        }
        cb(1, null);
        return false;
    });
}

var shop_funcs_stack = [];

function addShopListener(func) {
    if (!func || typeof func !== "function") {
        return;
    }
    shop_funcs_stack.push(func);
}

exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.addShop = addShop;
exports.removeShop = removeShop;
exports.checkShopWithFb_Uid = checkShopWithFb_Uid;
exports.item_maps = item_maps;
exports.shop_maps = shop_maps;
exports.addShopListener = addShopListener;