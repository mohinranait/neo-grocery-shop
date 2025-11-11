const { Schema, Types, model } = require("mongoose");

// section Schema 
const sectionSchema = new Schema({
    name: { type: String },
    products: [{ type: Types.ObjectId, ref: "Product" }],
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['grid', 'carousel'],
        default: 'grid'
    }
},{timestamps:true})

const Section = model('Section', sectionSchema);

module.exports =  Section;