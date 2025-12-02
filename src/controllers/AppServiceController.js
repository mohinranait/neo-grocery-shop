const { AppIntegration } = require("../models/AppServiceModel");
const { successResponse } = require("../utils/responseHandler");


// Get Application Integrations
const getAppService =  async (req, res,next) => {
  try {
    let integrations = await AppIntegration.findOne({});
    if (!integrations) {
      integrations = await AppIntegration.create({});
    }
  
     return successResponse(res, {
        message: "Success",
        payload:{
            integrations
        },
        statusCode:200
    })

  } catch (err) {
    console.error("GET INTEGRATIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch integrations" });
    next(err)
  }
};

// Setup Email Configuration
const emailConfiguration = async (req, res, next) => {
  try {
    const { provider, smtpPassword, smtpEmail, senderName,isActive,lastUpdated } = req.body;

    await AppIntegration.findOneAndUpdate(
      {},
      {
        email: {
          provider,
          smtpPassword,
          smtpEmail,
          senderName,
          isActive,
          lastUpdated
        },
      },
      { upsert: true, new: true }
    );

     return successResponse(res, {
        message: "Email configuration saved successfully",
        payload:{},
        statusCode:200
    })
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    next(error)
  }
};

// Setup Facebook Pixel
const facebookPixelSetup = async (req, res,next) => {
  try {
    
   const { pixelId, accessToken, enableTracking,isActive,lastUpdated } = req.body;

    await AppIntegration.findOneAndUpdate(
      {},
      {
        facebookPixel: {
          pixelId,
          accessToken,
          enableTracking,
          isActive,
          lastUpdated
        },
      },
      { upsert: true, new: true }
    );

     return successResponse(res, {
        message: "Facebook Pixel settings saved successfully",
        payload:{},
        statusCode:200
    })

  } catch (error) {
    console.error("PIXEL ERROR:", error);
    next(error)
  }
};


// Setup Cloudinary Configuration
const cloudinaryConfiguration =  async (req, res,next) => {
  try {
    const { cloudName, apiKey, apiSecret,isActive ,lastUpdated} = req.body;

    await AppIntegration.findOneAndUpdate(
      {},
      {
        cloudinary: {
          cloudName,
          apiKey,
          apiSecret,
          isActive,
          lastUpdated
        },
      },
      { upsert: true, new: true }
    );


    return successResponse(res, {
        message: "Cloudinary configuration saved successfully",
        payload:{},
        statusCode:200
    })

  } catch (error) {
    console.error("CLOUDINARY ERROR:", error);
    next(error)
  }
};


module.exports = {
    getAppService,
  emailConfiguration,
  facebookPixelSetup,
  cloudinaryConfiguration,
};


