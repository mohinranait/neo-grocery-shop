const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
    name : {
        firstName: {
            type: String,
            required: true,
            trim:true,
        },
        lastName: {
            type: String,
            required: true,
            trim:true,
        },
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
    },
    verify:{
        email: Boolean,
        phone: Boolean,
    },
    phone: {
        type: String,
        trim:true,
    },
    password: {
        type: String,
        required: true,
        trim:true,
    },
    profile:{
        type : String,
    },
    role:{
        type: String,
        default:"User",
        enum:['Admin',"User","Manager"]
    },
    status:{
        type: String,
        default:"Active",
        enum: ['Active', 'Pending', 'Banned'],
    },
    dateOfBirth: {
        type : String,
    },
    gender: {
        type: String,
        default:'Male'  ,
        enum : ['Male','Female','Other'],
    }
},{timestamps:true});

const User = model("User", userSchema);

module.exports = User;