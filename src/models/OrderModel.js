const {Schema, Types, model} = require('mongoose');

// Order Item Schema (For multiple products in an order)
const OrderItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  attributes: { type: Map, of: String },
  sku: {type:String} ,
  name: {type:String} ,
  image: {type:String} ,
});

// Address Schema 
const addressSchema = new Schema({
    userId: {
        type : Types.ObjectId,
        ref: "User",
        required:true,
    },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
})

// Main Order Schema
const OrderSchema = new Schema(
  {
    // If user is logged in, store userId
    userId: { 
        type:Types.ObjectId, 
        ref: "User", 
        required: false
    },

    // If user is a guest, store their details
    shippingAddress: {
        firstName: { type: String, required: function () { return !this.userId; } },
        lastName: { type: String, required: function () { return !this.userId; } },
        address: { type: String, required: function () { return !this.userId; } },
        city: { type: String, required: function () { return !this.userId; } },
        postalCode: { type: String, required: function () { return !this.userId; } },
    },
    shippingAddressId : {
        type : Types.ObjectId,
        ref: "Address", 
        required: function () { return !!this.userId; } 
    },

    items: [OrderItemSchema], 
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending",
    },
    paymentStatus: { 
      type: String, 
      enum: ["Pending", "Paid", "Failed", "Refunded"], 
      default: "Pending",
    },
    paymentMethod: { type: String, enum: ["COD", "Card", "Bank Transfer"], default:'COD' },
    uid:{ type:String, required:true },
    email:{type:String},
    phone: {type:String, required:true}
  },
  { timestamps: true }
);

const Address = model('Address', addressSchema)
const Order = model("Order", OrderSchema);

module.exports = {
  Address, Order
}
