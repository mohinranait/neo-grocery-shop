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
 * @api {get} /products?accessBy=User -> get all products
 * @query {accessBy=[User, Admin,Manager]}
*/
const getAllProducts = async (req, res , next) => {
    try {

      
      

        // Find all querys
        const accessBy = req.query?.accessBy || "User";
        const status = req.query?.status || ''; 
        const search = req.query?.search || '';
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 10;
        let sorting = req.query?.sort || 'asc'; // asc, desc
        const sortField = req.query?.sortField || 'name';
        const requestSell = req.query?.request; // Top Sell , Offers
        const features = req.query?.features; 
       
        const firstDate = req.query?.firstDate ? new Date(req.query.firstDate) : null;
        const lastDate = req.query?.lastDate ? new Date(req.query.lastDate) : null;

        const searchText = new RegExp('.*'+search+'.*','i')



        let query = {
            status: "Active"
        }

         

        // Sorting products by asc OR desc
        sorting === "asc" ? 1 : -1;
       

       // Search Product
        if(search){
            query.$or = [
                { name: {$regex : searchText } },
                { slug: {$regex : searchText } },
                { skuCode: {$regex : searchText } }
            ]
        }

        // features product
        if(requestSell){
            if(requestSell === 'isFeature'){
                query.isFeature = 'Active'
            }else if(requestSell === 'Offers'){
                // TODO This logic is comming soon
                // query['price.discountPrice'] = { $gt : 0}
            }
        }
        

        // features product
        if(features){
            if(features === 'All'){
                query.features = {
                    $in: ['Active',"Inactive"]
                }
            }
            else{
               query.features = features
            }
        }

       
        // Date wish
        if (firstDate && lastDate) {
            query.createdAt = {
                $gte: firstDate,
                $lte: lastDate,
            };
        } else if (firstDate) {
            const nextDay = new Date(firstDate);
            nextDay.setDate(nextDay.getDate() + 1); 
            query.createdAt = {
                $gte: firstDate,
                $lt: nextDay, 
            };
        }
       
        

        // Access Products
        if(accessBy === 'Admin' || accessBy === 'Manager'){
            if(!status || status == 'All'){
                query.status = {
                    $in: ['Active',"Inactive"]
                }
            }else{
                query.status = status;
                
            }
           
        }else{
            // User can access only Active Products
            query.status = 'Active'
        }

        console.log({query});
        

        const products = await Product.find(query)
        .skip((page-1)*limit)
        .limit(limit)
        .sort({[sortField]: sorting });
        const total = await Product.find(query)
        .skip((page-1)*limit)
        .sort({[sortField]: sorting }).countDocuments();
    
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: {
                products,
                limit,
                total,
            },
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