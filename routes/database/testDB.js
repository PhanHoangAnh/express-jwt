var randomstring = require('randomstring');
var mongoose = require('mongoose');
var dbManager = require("./dbManager");

var handle_items = [];
var Shop = mongoose.model('Shops');

var shops = [];
for (var i = 0; i < 3; i++) {
    shops.push(createNewShop());
}
// console.log('/------------------Create shops--------------------------------/');
// for(var i in shops){
//     console.log(shops[i].pathName);
// }
// console.log('/------------------End of Create shops-------------------------/');

function createNewShop() {
    var shopObj = new Shop;
    // shopObj._id = mongoose.Types.ObjectId();
    shopObj.fb_uid = randomstring.generate(7);
    shopObj.avatars = randomstring.generate(7);
    shopObj.walls = randomstring.generate(7);
    shopObj.longitude = randomstring.generate(7);
    shopObj.latitude = randomstring.generate(7);
    shopObj.pathName = randomstring.generate(7); //'abcdef' //
    shopObj.showName = randomstring.generate(7);
    shopObj.slogan = randomstring.generate(7);
    shopObj.companyName = randomstring.generate(7);
    shopObj.shop_description = randomstring.generate(7);
    shopObj.contact_phone = randomstring.generate(7);
    shopObj.contact_email = randomstring.generate(7);
    shopObj.address = randomstring.generate(7);

    for (var i = 0; i < 8; i++) {
        shopObj.uid.push(randomstring.generate(7));
        // shopObj.items.push(randomstring.generate(7));
        // shopObj.categories.push(randomstring.generate(7));
        shopObj.extends.push(randomstring.generate(7));
    }
    dbManager.addShop(shopObj, function(err, msg) {
        if (err) {
            console.log(msg);
        }
    })
    return shopObj;
}



function createItems(num, shopNum) {
    var item = {};
    item._id = mongoose.Types.ObjectId().toString();
    // item.shop = randomstring.generate(7);
    var shopNum = Math.floor(Math.random() * (3 - 0));
    item.shop = shops[shopNum].pathName;
    // item.shop = 'abcdef';
    var categories_arr = [];
    for (var i = 0; i < 10; i++) {
            categories_arr.push(randomstring.generate(15));
            // categories_arr.push("abcdef" + i.toString());
            // console.log("categories_arr: ", categories_arr[i])
    };
    item.categories = categories_arr;
    console.log('item created', num, item);

    return item;
}



for (var i = 0; i < 3; i++) {
    // var shopNum = Math.floor(Math.random() * (3 - 0));
    handle_items.push(createItems(i, i));
    // console.log("item.pathName: ", handle_items[i].shop);    
    displayResult(handle_items[i]);
}


function displayResult(item) {
    // console.log("sample item: ", item);
    dbManager.updateItem(item, function(shops, items, categories) {
        // check(categories);
        console.log('----------------- Shop --------------------');
        if (shops == 1) {
            console.log(items);
            return;
        }
        shops.forEach(function(val, key) {
            //console.log(key, '\n from shop.pathName:', val.pathName, "\n from Shop.items: ", val.items, '\n from Shop.categories:', val.categories);
            for (var i in val.items) {
                //console.log(' item:', val.items[i]);
            }
        })

        console.log("typical items: ", shops.values()[0].items);
        var result = shops.has(handle_items[0].shop);
        console.log("has shop: ? ", result);
        console.log('categories.count()', categories.count());

        // console.log('detailed categories: \n', categories.values());
        // console.log("shop.count()", shops.count(),'\n item', items.count(), '\n categories', categories.count());
        // console.log('----------------- Items -------------------');
        // items.forEach(function(val,key){
        //  console.log("\n from item.shop: ", val.shop ,"\n from items.categories: ", val.categories);
        // })    
        // console.log('----------------- Categories --------------');
        // categories.forEach(function(val, key) {
        //     console.log("category: ", key, "\nfrom category.shop: ", val.shops, '\n from category.items: ', val.items);
        // });
        // console.log("category.count()", categories.count());
    });
    // setTimeout(function(){ 
    //  // console.log("wating for second");
    // }, 1000);
    // console.log("_id", handle_items[0]._id, handle_items[0].shop);
}

function check(categories) {
    // console.log(" categories: \n", categories.values());
    console.log("handle_items[0]._id ", handle_items[0]._id);
    categories.forEach(function(val, key) {
        console.log(handle_items[0]._id);
        for (var i = 0; i < val.items.length; i++) {
            console.log(val.items[i] == handle_items[0]._id, " handle_items[0]._id ", handle_items[0]._id, val.items[i], typeof(handle_items[0]._id), typeof(val.items[i]));
            if (val.items[i]._id == handle_items[0]._id) {
                console.log(val);
            }
        }
    });
}
setTimeout(function() {
    console.log("start removeItem....");
    removeItem();
}, 500);

function removeItem() {
    dbManager.removeItem(handle_items[1], function(shops, items, categories, err, shop) {        

        if (err) {
            console.log(err, shop);
            var shop = shops.get(handle_items[1].pathName);
            console.log(shop);
            console.log(shop.items.indexOf(handle_items._id));
        }
        var result = items.has(handle_items[1]);
        console.log(result);
        categories.forEach(function(val, key) {
            for (var i = 0; i < val.items.length; i++) {
                if (val.items[i] == handle_items[1]._id) {
                    console.log(val);
                }
                // }else{
                //  console.log ("okie");
                // }
            }
        });
        console.log("shop.count: ", shops.count(), "items.count: ", items.count(), "categories.count: ", categories.count());
        console.log('detailed categories: \n', categories.values());
    })
}


var a = ['a', 'b', 'c'];
console.log('a: ', a);
a = a.splice(0, 1, 'd', 'e');
console.log('a: ', a);
