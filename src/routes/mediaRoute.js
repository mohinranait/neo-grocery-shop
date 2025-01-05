
const { uploadImage, getAllMedias } = require("../controllers/MediaController");
const { isAuth } = require("../middleware/isAuth");

const upload = require("../middleware/uploadFile");

const uploadImageRouter = require("express").Router();


uploadImageRouter.post('/upload', isAuth , upload.single('file'), uploadImage)
uploadImageRouter.get('/media', isAuth , getAllMedias)


module.exports = uploadImageRouter;