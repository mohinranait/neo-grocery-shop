const Favorite = require("../models/FavoriteModel");
const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");
/**
 * @api {post} /favorite Add favorite product 
*/
const createFavoriteProduct = async (req, res, next) => {
    try {

        const body = req.body;
        const authId = req?.user?.id;
        
         if(!body?.product) throw createError(404, "Product is required")
        const favorite  = await Favorite.create({...body,user:authId});
        if(!favorite) throw createError(404, "Favorite not added");
        return successResponse(res, {
            message: "Success",
            statusCode:201,
            payload: favorite,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /favorites Get all favorite products 
*/
const getFavoriteProducts = async (req, res, next) => {
    try {

        const user = req?.user;

        const favorites  = await Favorite.find({user: user?.id})
        if(!favorites) throw createError(404, "Favorite not added");
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: favorites,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {delete} /favorite/:id/:userId Delete favorite product by ID 
*/
const deleteFavoriteProduct = async (req, res, next) => {
    try {

        const authUser = req?.user;
        const favoriterId = req?.params?.id;
        const userId = req?.params?.userId;
        if(authUser?.id !== userId) throw createError(401, "Bad request ")

        const favorite  = await Favorite.findByIdAndDelete(favoriterId)
        if(!favorite) throw createError(404, "Favorite not added");
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: favorite,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createFavoriteProduct,
    getFavoriteProducts,
    deleteFavoriteProduct
}