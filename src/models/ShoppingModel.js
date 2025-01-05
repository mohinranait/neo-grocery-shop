const { Schema, model, Types } = require("mongoose");

const shoppingSchema = new Schema({
    user: {
        type : Types.ObjectId,
        ref: "User",
    },
    product:{
        type: Types.ObjectId,
        ref: "Product",
    },
    price: {
        type: Number,
        default:0,
    },
    quantity: {
        type: Number,
        default:1
    },   
}, { timestamps: true });

const ShoppingCart = model('ShoppingCart', shoppingSchema);

module.exports = ShoppingCart;