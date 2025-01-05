const mongoose = require('mongoose');
const createError = require('http-errors');
const { successResponse } = require('../utils/responseHandler');
const cloudinary = require('../config/cloudinary');
const Media = require('../models/MediaModel');


// Update profile by ID
const uploadImage = async (req, res, next) => {
    try {

        const image = req.file?.path;
        const fileType = req?.body?.fileType;

        // upload profile image
        const imageRes = await cloudinary.uploader.upload(image, {
            folder: 'neo-grocery',
        })

        const { url, format, width, height, bytes } = imageRes;


        const file = await Media.create({
            fileType: fileType,
            fileUrl: url,
            width,
            height,
            extension: format,
            size: bytes,
        })



        return successResponse(res, {
            statusCode: 201,
            message: "Image uploaded",
            payload: {
                file
            }
        })

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error) {
            return next(createError(400, "Invalid user ID"))
        }
        next(error)
    }
}

const getAllMedias = async (req, res,next) => {
    try {
        const userId = req?.user?.id;
        if(!userId) return;

        const medias = await Media.find({});
        return successResponse(res, {
            statusCode:200,
            payload:{
                medias
            }
            
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadImage,
    getAllMedias
}