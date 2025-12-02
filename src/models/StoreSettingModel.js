const { model, Schema } = require('mongoose') ;


const storeSettingsSchema = new Schema(
  {
    // Basic Store Information
    storeName: {
      type: String,
      trim: true,
    },
    storeEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    storePhone: {
      type: String,
      trim: true,
    },
    storeDescription: {
      type: String,
      trim: true,
    },

    // Logo & Branding
    logo: {
      url: String,
      publicId: String, 
    },
    favicon: {
      url: String,
      publicId: String,
    },
    brandColor: {
      type: String,
      default: "#000000",
    },

    // Metadata & SEO
    metadata: {
      title: String,
      description: String,
      keywords: [String],
    },

    // Social Media Links
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
      tiktok: String,
      pinterest: String,
    },


    // Payment Settings
    currency: {
      type: String,
      default: "BDT",
    },

    timezone: {
      type: String,
      default: "UTC",
    },
  },
  {
    timestamps: true,
  },
)

const StoreSetting = model('StoreSetting', storeSettingsSchema);

module.exports = StoreSetting;