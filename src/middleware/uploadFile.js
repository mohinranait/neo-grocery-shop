const multer = require('multer')
const path = require("path");
const createError = require('http-errors');

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, 'public/img')
    // },
    filename: function (req, file, cb) {
        const exName = path.extname(file.originalname)
        cb(null, Date.now() + "_" + file.originalname.replace(exName, '') + exName)
    }
})


// filter file 
const fileFilter = (req, file, cb) => {
    const exName = path.extname(file.originalname)
    if (!['jpg', 'png','webp'].includes(exName.substring(1))) {
        // console.log("File Filter extansion error");
        return cb(new Error("File validation"))
    }

    cb(null, true)
}

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 2097152,
    },
    fileFilter,
})

module.exports = upload