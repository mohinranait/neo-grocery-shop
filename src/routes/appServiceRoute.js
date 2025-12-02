
const { isAuth } = require("../middleware/isAuth.js");
const  { cloudinaryConfiguration, emailConfiguration, facebookPixelSetup, getAppService } = require( "../controllers/AppServiceController.js")
const appService = require('express').Router();

appService.get("/", isAuth, getAppService);
appService.post("/facebook-pixel", isAuth, facebookPixelSetup);
appService.post("/email", isAuth, emailConfiguration);
appService.post("/cloudinary", isAuth, cloudinaryConfiguration);

module.exports = appService;
