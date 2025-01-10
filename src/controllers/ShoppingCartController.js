const ShoppingCart = require("../models/ShoppingModel");
const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");

/**
 * @api {post} /shopping-cart Create shopping cart
*/
const addShoppingCart = async (req, res, next) => {
    try {
        const authUser = req?.user;
        const body = req?.body;
        if(!body?.product) throw createError(404, "Product is required")
        const cart = await ShoppingCart.create({...body,user:authUser?.id});
        if(!cart) throw createError(404, "Shopping cart not added");
        return successResponse(res,{
            message:"Success",
            statusCode:201,
            payload:cart,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /shopping-carts Get all shopping carts
*/
const getAllShoppingCart = async (req, res, next) => {
    try {
        const authUser = req?.user;
        const carts = await ShoppingCart.find({user:authUser?.id}).populate({
            path:"user",
            select:"-password -email -role"
        }).populate({
            path:'product',
            select: "-isStock -isFeature -minStock -sellQuantity -publish_date -createdAt"
        });
        if(!carts) throw createError(404, "Shopping cart not added");
        return successResponse(res,{
            message:"Success",
            statusCode:200,
            payload:carts,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {delete} /shopping-cart/:id/:userId Delete shopping cart 
*/
const deleteShoppingCart = async (req, res, next) => {
    try {
        const authUser = req?.user;
        const userId = req?.params?.userId;
        const shopCartId = req?.params?.id;
        if(authUser?.id !== userId) throw createError(403, "Can't delete this item");
        const cart = await ShoppingCart.findByIdAndDelete(shopCartId);
        if(!cart) throw createError(404, "Cart not found");
        return successResponse(res, {
            message:"Success",
            statusCode:200,
            payload:cart,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addShoppingCart,
    getAllShoppingCart,
    deleteShoppingCart
}