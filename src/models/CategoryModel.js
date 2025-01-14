const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required:true,
        trim:true,
        unique:true
    },
    parent: {
        type: String,
        default: null,
    },
    catBanner: {
        type: String,
    },
    catThumbnail: {
        type: String,
    },
    catIcon: {
        type: String
    },
   status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    }
   
}, { timestamps: true });

const Category = model('Category', categorySchema);

module.exports = Category;