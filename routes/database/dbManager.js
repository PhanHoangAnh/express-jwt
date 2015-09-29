var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var Shop_schema = new Schema({
    fb_uid          : String,
    // longFb_token    : String,
    // shortFb_token   : String,
    // iat             : String,
    // exp             : String,
    // app_token       : String,
    avatars         : String,
    walls           : String,
    longitude       : String,
    latitude        : String,
    pathName        : String,
    showName        : String,
    slogan          : String,
    companyName     : String,
    shop_description: String,
    contact_phone   : String,
    contact_email   : String,
    address         : String,
    uid             : String,
    updated: { type: Date, default: Date.now },
    item_lists      : [{ type: Schema.Types.ObjectId, ref: 'Items' }],
    category_lists  : [{ type: Schema.Types.ObjectId, ref: 'Category' }] 
});

var Items_schema = new Schema({
    shop_id : Schema.Types.ObjectId,
    Category_lists: [type: Schema.Types.ObjectId, ref: 'Category']
});

var Category_schema = new Schema({
    key             : String,
    item_lists      : [{ type: Schema.Types.ObjectId, ref: 'Items' }],
    shop_lists      : [{ type: Schema.Types.ObjectId, ref: 'Shop' }]
});

mongoose.connect('mongodb://localhost/virtualMarket');

exports.Shop = mongoose.model('Shop', Shop_schema);
exports.Shop = mongoose.model('Items', Items_schema);
exports.Shop = mongoose.model('Category', Category_schema);