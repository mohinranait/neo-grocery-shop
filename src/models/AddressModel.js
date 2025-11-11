const { Schema, Types, model } = require("mongoose");

// Address Schema 
const addressSchema = new Schema({
    userId: {
        type : Types.ObjectId,
        ref: "User",
        required:true,
    },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    subCity: { type: String },
    type: {
        type: String,
        enum: ['Home',"Office","Others"],
        default:'Home'
    }
},{timestamps:true})

const Address = model('Address', addressSchema);

module.exports =  Address;