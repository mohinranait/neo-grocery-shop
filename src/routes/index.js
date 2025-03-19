const attributeRoute = require("./attributeRoute");
const brandRoute = require("./brandRoute");
const categoryRoute = require("./categoryRoute");
const configAttrRoute = require("./configAttributeRoute");
const favoriteRoute = require("./favoriteRoute");
const uploadImageRouter = require("./mediaRoute");
const orderRouter = require("./orderRoute");
const productRoute = require("./productRoute");
const shoppingCartRoute = require("./shoppingCartRoute");
const userRoute = require("./userRoute");

module.exports = 
{
    userRoute,
    categoryRoute,
    attributeRoute,
    configAttrRoute,
    brandRoute,
    productRoute,
    uploadImageRouter,
    favoriteRoute,
    shoppingCartRoute,
    orderRouter
}