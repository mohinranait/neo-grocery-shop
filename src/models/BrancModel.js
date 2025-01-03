const { Schema, model, Types } = require("mongoose");

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
        type: Types.ObjectId,
        ref:"Media",
    },
    brandThumbnail: {
        type: Types.ObjectId,
        ref:"Media",
    },
   status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    }
   
}, { timestamps: true });

const Brand = model('Brand', brandSchema);

module.exports = Brand;