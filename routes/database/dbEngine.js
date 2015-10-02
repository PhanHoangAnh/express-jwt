var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var Shop_schema = new Schema({
    _id             : Schema.Types.ObjectId,
    fb_uid          : String,    
    avatars         : String,
    walls           : String,
    longitude       : String,
    latitude        : String,
    pathName        : String,
    showName        : { type: String, unique: true },
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

// var Items_schema = new Schema({
//     _id  : Schema.Types.ObjectId,
//     shop : String,
//     categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
//     extends         : [Schema.Types.Mixed]
// });

// var Category_schema = new Schema({
//     _id             : Schema.Types.ObjectId,
//     key             : String,
//     item_lists      : [{ type: Schema.Types.ObjectId, ref: 'Items' }],
//     shop_lists      : [{ type: Schema.Types.ObjectId, ref: 'Shop' }],
//     extends         : [Schema.Types.Mixed]
// });


mongoose.connect('mongodb://localhost/virtualMarket');

exports.Shop = mongoose.model('Shops', Shop_schema);
// exports.Items = mongoose.model('Items', Items_schema);
// exports.Categories = mongoose.model('Category', Category_schema);