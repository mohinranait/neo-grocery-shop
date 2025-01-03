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
   
    details: { type : String},
    rating: { type : Number},
    reviews: { type : Number},
    isStock: { 
        type: Number,
        default: 10,
    },
    isFeature : {
        type : String,
        default:'Inactive',
        enum: ['Active', 'Inactive']
    },
    delivery: {
        deliveryCharge : {
            type: Number,
            default:0,
        },
        deliveryStatus : {
            type: String, 
            default: "Free",
            enum:['Free',"Pay"]
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
    imageGallary:{
        type: [String],
    },
    name: {
        type: String,
        trim:true,
        required: true,
    },
    product_type: { 
        type: String,
        default: 'Physical', 
        enum: ['Physical', 'Digital']
    },
    price: { 
        sellPrice : {
            type:Number,
            default:0
        },
        productPrice : {
            type:Number,
            default:0
        },
    },
    offerDate:{
        start_date: {
            type : Date,
        },
        end_date: {
            type : Date,
        },
        offerPrice: {
            type : Number,
            default: 0
        }
    },
    publish_date: {
        type : Date,
        default: Date.now
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
    status : {
        type: String,
        default: 'Active', 
        enum:['Active', "Inactive"]
    },
    productFeatures : {
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