const { Schema, model, Types } = require("mongoose");

const favoriteSchema = new Schema({
    user: {
        type : Types.ObjectId,
        ref: "User",
    },
    product:{
        type: Types.ObjectId,
        ref: "Product",
    },
   
}, { timestamps: true });

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;