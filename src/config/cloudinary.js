
const cloudinary = require('cloudinary').v2

const configureCloudinary  = ({cloudName, apiKey, apiSecret}) => {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });
    return cloudinary;
}

module.exports = configureCloudinary


