const attributeRoute = require("./attributeRoute");
const brandRoute = require("./brandRoute");
const categoryRoute = require("./categoryRoute");
const configAttrRoute = require("./configAttributeRoute");
const uploadImageRouter = require("./mediaRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");

module.exports = 
{
    userRoute,
    categoryRoute,
    attributeRoute,
    configAttrRoute,
    brandRoute,
    productRoute,
    uploadImageRouter
}