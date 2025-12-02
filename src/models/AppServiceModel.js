import mongoose, { Schema } from "mongoose";



const appIntegrationSchema = new Schema(
  {
    email: {
      provider: { type: String, enum: ["sendgrid", "smtp"], default: "smtp" },
      smtpPassword: { type: String },
      smtpEmail: { type: String },
      senderName: { type: String },
      isActive: { type: Boolean, default: false },
      lastUpdated: { type: Date,  },
    },

    cloudinary: {
      cloudName: { type: String },
      apiKey: { type: String },
      apiSecret: { type: String },
      isActive: { type: Boolean, default: false },
      lastUpdated: { type: Date,  },
    },

    facebookPixel: {
      pixelId: { type: String },
      accessToken: { type: String },
      enableTracking: { type: Boolean, default: true },
      isActive: { type: Boolean, default: false },
      lastUpdated: { type: Date,  },
    },

  },
  { timestamps: true }
);

export const AppIntegration = mongoose.model(
  "AppIntegration",
  appIntegrationSchema
);
