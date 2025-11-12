const { model, Schema, Types } = require("mongoose");

const productSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: { type: [String], },
    category: {  type: [String], },
    details: {  type: String, },
    rating: { type: Number,default: 0, },
    reviews: { type: Number, default: 0,},
    isStock: { type: Number, default: 10, },
    isFeature: { type: String, default: "Inactive",enum: ["Active", "Inactive"], },
    delivery: {
      deliveryCharge: {  type: Number, default: 0, },
      deliveryStatus: { type: String, default: "Free", enum: ["Free", "Pay"], },
    },
    minStock: { type: Number, default: 5, },
    featureImage: {
      image: { type: String, required: true },
      videoUrl: { type: String }, },
    imageGallery: { type: [String], },
    name: { type: String, trim: true, required: true,},
    productName: { type: String, trim: true, },
    product_type: { type: String, default: "Physical", enum: ["Physical", "Digital"], },
    price: {
      discountValue: { type: Number, default: 0, },
      productPrice: { type: Number, default: 0, },
      discountType: { type: String, enum:['fixed',"percent"], default:'fixed' },
    },
    offerDate: {
      start_date: { type: Date },
      end_date: { type: Date },
      offerPrice: { type: Number, default: 0, },
    },
    publish_date: { type: Date, default: Date.now, },
    sellQuantity: { type: Number, default: 0, },
    slug: { type: String,lowercase: true, required: true, trim: true, unique: true, },
    skuCode: { type: String, },
    short_details: { type: String,},
    status: { type: String,  default: "Active",enum: ["Active", "Inactive"], },
    productShortDesc : { type: String, },
    productFeatures: {
      extraFeatures: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },
    variant: {
      type: String,
      default: "Single Product",
      enum: ["Single Product", "Variable Product", "Group Product", "Affiliate"],
    },
    manageStock: { type: Boolean, default: false,},
    variations: [
      {
        variantId: { type: String, required: true },
        attributes: { type: [String], required: true },
        attributeConfigs: [
          {
            attrIndex: { type: Number },
            value: { type: String },
          },
        ],
        offerPrice: { type: Number, default: 0 },
        productPrice: { type: Number, required: true },
        description: { type: String },
        image: { type: String },
        sku: { type: String },
        shipping: {
          weight: { type: Number, default: 0 },
          length: { type: Number, default: 0 },
          width: { type: Number, default: 0 },
          height: { type: Number, default: 0 },
        },
      },
    ],
    attributes: [
      {
        attribute: {
          type: Types.ObjectId,
          ref: "Attribute",
        },
        attributeConfig: [String],
      },
    ],
    shippingCharge:{ type: Number, default: 0, },
    tax:{ type: Number, default: 0, },
    shipping: {
      weight: { type: Number, default: 0, },
      length: { type: Number, default: 0, },
      width: {  type: Number, default: 0, },
      height: {  type: Number, default: 0, },
    },
    seo_title: { type: String, },
    seo_desc: { type: String, },
    seo_keyword: { type: [String],},
    freeShipping:{
      type:String,
      default:"no",
      enum:['yes','no']
    },
    returnTime: { type: Number, default:5,  }
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
module.exports = Product;
