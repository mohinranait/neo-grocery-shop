const { Schema, model } = require("mongoose");

const brandSchema = new Schema({
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

    brandBanner: {
        type: String,
    },
    brandThumbnail: {
        type: String,
    },
    categoryIds:{
        type : [String],
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    }
   
}, { timestamps: true });

const Brand = model('Brand', brandSchema);

module.exports = Brand;