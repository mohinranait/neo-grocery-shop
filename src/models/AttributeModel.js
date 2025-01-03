const { Schema, model } = require("mongoose");

const attributeSchema = new Schema({
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
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    }
}, { timestamps: true });

const Attribute = model('Attribute', attributeSchema);

module.exports = Attribute;