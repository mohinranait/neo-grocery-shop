const addressRoute = require("./addressRoute");
const attributeRoute = require("./attributeRoute");
const brandRoute = require("./brandRoute");
const categoryRoute = require("./categoryRoute");
const commentRoute = require("./commentRoute");
const configAttrRoute = require("./configAttributeRoute");
const dealRoute = require("./dealRoute");
const favoriteRoute = require("./favoriteRoute");
const uploadImageRouter = require("./mediaRoute");
const orderRouter = require("./orderRoute");
const productRoute = require("./productRoute");
const sectionRoute = require("./sectionRoute");
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
    orderRouter,
    addressRoute,
    commentRoute,
    dealRoute,
    sectionRoute
}