const Product = require("../models/ProductModel");
const { generateSlug } = require("../utils/helpers");
const { successResponse } = require("../utils/responseHandler");

/**
 * @api {post} /product -> Create new product method
*/
const createNewProduct = async (req, res, next) => {

    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");

        const body = req?.body;
        const genSlug = generateSlug(body?.slug || body?.name);

        const product = await Product.create({...body, slug: genSlug, author: authUser?.id })
        if(!product) throw createError(500, "Product not created");
        return successResponse(res, {
            message: "Product has been created",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /products?accessBy=user -> get all products
 * @query {accessBy=[user, admin,manager]}
*/
const getAllProducts = async (req, res , next) => {
    try {
        // Find all querys
        const accessBy = req.query?.accessBy;
        const search = req.query?.search || '';

        let query = {
            status: "Active"
        }

        const searchText = new RegExp('.*'+search+'.*','i')

        if(search){
            query.$or = [
                { name: {$reg: searchText } },
                { slug: {$reg: searchText } }
            ]
        }

        if(accessBy === 'Admin' || accessBy === 'Manager'){
            query.status = {
                $in: ['Active',"Inactive"]
            }
        }
        const products = await Product.find(query);
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: products,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * @api {get} /product/:id Get product by ID
*/
const getSingleProductById = async (req, res, next) => {
    try{
        const productId = req.params?.id;
        const product = await Product.findById(productId);
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Success",
            statusCode: 200,
            payload:product
        })
    }catch(error){
        next(error)
    }
}
/**
 * @api {get} /product/:slug Get product by ID
*/
const getSingleProductBySlug = async (req, res, next) => {
    try{
        const productSlug = req.params?.slug;
        const product = await Product.findOne({slug:productSlug});
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Success",
            statusCode: 200,
            payload:product
        })
    }catch(error){
        next(error)
    }
}

/**
 * @api {patch} /product/:id Update product by ID
*/
const updateProductByID = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        const productId = req.params?.id;
        const body = req?.body;
        const product = await Product.findByIdAndUpdate(productId, body, {new:true, runValidators:true});
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Product has been updated",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}


/**
 * @api {delete} /product/:id Delete product by ID
*/
const deleteProductById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        const productId = req.params?.id;
        const product = await Product.findByIdAndDelete(productId);
        if(!product) throw createError(500, "Product not deleted");
        return successResponse(res, {
            message: "Product has been deleted",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNewProduct,
    getAllProducts,
    getSingleProductById,
    getSingleProductBySlug,
    updateProductByID,
    deleteProductById
}