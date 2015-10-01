var randomstring = require('randomstring');
var mongoose = require('mongoose');
var dbManager = require("./dbManager");

var handle_items = [];


function createItems() {
    var item = {};
    item._id = mongoose.Types.ObjectId().toString();
    item.shop = randomstring.generate(7);
    // item.shop = 'abcdef';
    for (var i = 0; i < 3; i++) {
        var categories_arr = [];
        for (var i = 0; i < 10; i++) {
            //categories_arr.push(randomstring.generate(5));
            categories_arr.push("abcdef" + i.toString());
            // console.log("categories_arr: ", categories_arr[i])
        };
    }
    item.categories = categories_arr;
    // console.log('item.categories', item.categories);
    return item;
}



for (var i = 0; i < 3; i++) {
    handle_items.push(createItems());
    // console.log("item.pathName: ", handle_items[i].shop);	
    displayResult(handle_items[i]);
}




function displayResult(item) {
    // console.log("sample item: ", item);
    dbManager.updateItem(item, function(shops, items, categories) {
        // check(categories);
        console.log('----------------- Shop --------------------');
        shops.forEach(function(val, key) {
            // console.log(key, '\n from shop.pathName:', val.pathName, "\n from Shop.items: ", val.items, '\n from Shop.categories:', val.categories);
        })
        var result = shops.has(handle_items[0].shop);
        console.log("has shop: ? ", result);
        console.log('categories.count()', categories.count());
        console.log('detailed categories: \n', categories.values());
        // console.log("shop.count()", shops.count(),'\n item', items.count(), '\n categories', categories.count());
        // console.log('----------------- Items -------------------');
        // items.forEach(function(val,key){
        // 	console.log("\n from item.shop: ", val.shop ,"\n from items.categories: ", val.categories);
        // })    
        // console.log('----------------- Categories --------------');
        // categories.forEach(function(val, key) {
        //     console.log("category: ", key, "\nfrom category.shop: ", val.shops, '\n from category.items: ', val.items);
        // });
        // console.log("category.count()", categories.count());
    });
    // setTimeout(function(){ 
    // 	// console.log("wating for second");
    // }, 1000);
    // console.log("_id", handle_items[0]._id, handle_items[0].shop);
}

function check(categories) {
	// console.log(" categories: \n", categories.values());
	console.log("handle_items[0]._id ", handle_items[0]._id);
    categories.forEach(function(val, key) {
    	console.log(handle_items[0]._id);    	
        for (var i = 0; i < val.items.length; i++) {
        	console.log(val.items[i] == handle_items[0]._id, " handle_items[0]._id ", handle_items[0]._id, val.items[i], typeof(handle_items[0]._id), typeof(val.items[i])) ;
            if (val.items[i]._id == handle_items[0]._id) {
                console.log(val);
            }
        }
    });
} 

dbManager.removeItem(handle_items[1], function (shops, items, categories){
	var result = items.has(handle_items[1]);
	console.log (result);
	categories.forEach(function(val, key){
		for(var i = 0 ; i < val.items.length ; i ++){
			if (val.items[i] == handle_items[1]._id){
				console.log(val);
			}	
			// }else{
			// 	console.log ("okie");
			// }
		}
	});
	console.log("shop.count: ", shops.count(), "items.count: ", items.count(), "categories.count: ", categories.count());
	console.log('detailed categories: \n', categories.values());

})



var a = ['a', 'b', 'c'];
console.log('a: ', a);
a = a.splice(0,1,'d', 'e');
console.log('a: ', a);