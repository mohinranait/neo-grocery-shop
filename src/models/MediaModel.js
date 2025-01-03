const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
    fileType: {
        type: String,
        default: 'post',
        enum: ['post', "profile", 'cover'],
    },
    fileUrl: {
        type: String,
    },
    fileName: {
        type: String,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    extension: {
        type: String,
    },
    size: {
        type: Number,
    },
}, { timestamps: true });

const Media = model('Media', fileSchema);

module.exports = Media;