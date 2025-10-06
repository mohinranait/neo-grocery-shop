
const { Schema, Types, model } = require("mongoose");

const dealSchema = new Schema({
    dealName: {
        type:String,
        required:true,
    },
    slug: {
        type:String,
        required:true,
        trim:true,
    },
    products:{
        type : [
            {
                productId: {
                    type: Types.ObjectId,
                    ref:"Product"
                },
                dealPrice: {
                    type: Number,
                },
                offerPrice: {
                    type: Number,
                },
                offerType:{
                    type:  String,
                    enum:['Parcent',"Fixed"],
                    default: "Parcent"
                }
            }
        ],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    status:{
        type: Boolean,
        default: true,
    },
    dealDesign: {
        type: String,
        enum:["grid", "slider"],
        default:"grid"
    }
},{timestamps:true});

const DealProduct = model("DealProduct", dealSchema);
module.exports = DealProduct;