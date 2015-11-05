var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var Shop_schema = new Schema({
    _id             : Schema.Types.ObjectId,
    fb_uid          : { type : String , unique : true, required : true, dropDups: true },
    avatars         : String,
    walls           : String,
    longitude       : String,
    latitude        : String,
    pathName        : { type : String , unique : true, required : true, dropDups: true },
    showName        : String,
    slogan          : String,
    companyName     : String,
    shop_description: String,
    contact_phone   : String,
    contact_email   : String,
    address         : String,
    uid             : [String],
    updated         : { type: Date, default: Date.now },
    items           : [Schema.Types.Mixed],
    categories      : [Schema.Types.Mixed] ,
    extends         : [Schema.Types.Mixed]
});


var Order_schema = new Schema({
    _id         : Schema.Types.ObjectId,
    items       : [Schema.Types.Mixed],
    time        : { type: Date, default: Date.now }
});

var OrderToShops_schema = new Schema({
    // _id is Shop id
    _id         : Schema.Types.ObjectId,
    shop        : String,
    items       : [Schema.Types.Mixed],
    time        : { type: Date, default: Date.now }
});

var TranslateOrderIdToFbUid_schema = new Schema({
    // _id is orderID
    _id         :Schema.Types.ObjectId,
    fb_uid      :String
});

var OrderOfFbUid_schema = new Schema({
    // _id = fb_uid
    _id     : Schema.Types.ObjectId,
    items       : [Schema.Types.Mixed],
    time        : String  
});

mongoose.connect('mongodb://localhost/virtualMarket');

exports.Shops = mongoose.model('Shops', Shop_schema);
exports.Orders = mongoose.model('Orders', Order_schema);
exports.OrderToShops = mongoose.model('OrderToShops',OrderToShops_schema);
exports.TranslateOrderIdToFbUid = mongoose.model('TranslateOrderIdToFbUid', TranslateOrderIdToFbUid_schema);
exports.OrderOfFbUid = mongoose.model('OrderOfFbUid', OrderOfFbUid_schema);
// exports.Items = mongoose.model('Items', Items_schema);
// exports.Categories = mongoose.model('Category', Category_schema);