const {model, Schema, Types} = require("mongoose")

const productSchema = new Schema({
    author : {
        type  : Types.ObjectId,
        ref: "User",
        required:true,
    },
    brand : {
        type : Types.ObjectId,
        ref: "Brand",
    },
    category : {
        type : Types.ObjectId,
        ref: "Category",
    },
    colors : [
        {
            label: {type:String},
            value: {type:String},
            slug: {type:String},
        }
    ],
    details: { type : String},
    rating: { type : Number},
    reviews: { type : Number},
    isStock: { 
        type: Number,
        default: 10,
    },
    isFeature : {
        type : String,
        default:'inActive'
    },
    delivery: {
        deliveryCharge : {
            type: Number,
        },
        deliveryStatus : {
            type: String, // Free, pay
        }
    },
    minStock: { 
        type: Number,
        default: 5
    },
    featureImage : {
        images : [String],
        videoUrl : {type:String}
    },
    name: {
        type: String,
        trim:true,
        required: true,
    },
    product_type: { 
        type: String,
        default: 'physical', // [ Physical, digital]
    },
    price: { 
        sellingPrice : {
            type:Number,
            default:0
        },
        productPrice : {
            type:Number,
            default:0
        },
        discountPrice : {
            type:Number,
            default:0
        },
    },
    publish_date: {
        type : Date,
        default: Date.now
    },
    categoryType: { 
        type: String
    },
    sellQuantity: {
        type:Number,
        default: 0
    },
    slug: { 
        type: String, 
        lowercase:true,
        required:true,
        trim:true,
        unique:true,
    },
    skuCode: { 
        type: String,
    },
    short_details: { type : String},
    // storage : {
    //     type : [String],
    // },
    status : {
        type: String,
        default: 'active', // [ active, pending]
    },
    productFeatures : {
        keyFeatures : {
            colors: Array,
            memorys: Array
        },
        extraFeatures : [
            {
                label: {type:String},
                value: {type:String},
            }
        ],
    }
},{timestamps:true})


const Product = model("Product", productSchema);

module.exports = Product;