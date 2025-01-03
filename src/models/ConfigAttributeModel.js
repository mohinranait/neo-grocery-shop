const { Schema, model } = require("mongoose");

const configAttributeSchema = new Schema({
    attribute: {
        type: Schema.Types.ObjectId,
        ref: "Attribute",
        required: true
    },
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

const ConfigAttribute = model('ConfigAttribute', configAttributeSchema);

module.exports = ConfigAttribute;