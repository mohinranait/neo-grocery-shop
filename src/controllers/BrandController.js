const Brand = require("../models/BrancModel");
const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");
const { generateSlug } = require("../utils/helpers");

/**
 * @api {get} /brands Get all brands
 * AccessBy=[user, admin,manager]
*/
const getAllBrands = async (req, res, next) => {
    try {
        // const brands = await Brand.find();
        const accessBy = req.query.accessBy || 'user';
        const limit  = req.query.limit || 1000;
        const query = {};

        if(accessBy === 'user'){
            query.status = "Active"
        }

        const brands = await Brand.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from:"products",
                    let: {brandId: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: { 
                                    $in :[
                                        "$$brandId", {
                                            $map: {
                                                input: "$brand",
                                                as : "c",
                                                in: { $toObjectId: "$$c" }
                                            }
                                        } 
                                    ] 
                                }
                            }
                        }
                    ],
                    as: "brands"
                }
            },
            {
                $addFields: {
                    totalProduct: { $size: "$brands" }
                }
            },
            { $sort: {createdAt: -1} },
            { $limit: limit},
            {
                $project: {
                    brands: 0,
                }
            }
        ])

        if(!brands) throw createError(404, "Brands not-found");
        return successResponse(res, {
            message: "Success",
            payload:brands,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /brand/:id Request Brand information
*/
const getBrandById = async (req, res, next) => {
    try {
        let brandId = req.params?.id;

        const brand = await Brand.findById(brandId);
        if(!brand) throw createError(404, "Brand not-found");
        return successResponse(res, {
            message: "Success",
            payload:brand,
            statusCode:200
        })
    }catch (error) {
        next(error)
    }
}


/**
 * @api {post} /brand Request Brand information
*/
const createNewBrand = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        const body = req.body;
        const genSlug = generateSlug( body?.slug || body?.name);
        const newBrand = new Brand({...body, slug:genSlug});
        const brand = await newBrand.save();
        if(!brand) throw createError(500, "Brand not created");
        return successResponse(res, {
            message: "Brand created successfully",
            payload:brand,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {patch} /brand/:id Update Brand information
*/
const updateBrandById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        const body = req.body;
        const brandId = req.params?.id;
        const genSlug = generateSlug( body?.slug || body?.name);
        const brand = await Brand.findByIdAndUpdate(brandId, {...body, slug:genSlug}, {new:true,runValidators:true}); 
        if(!brand) throw createError(500, "Brand not updated");
        return successResponse(res, {
            message: "Brand updated successfully",
            payload:brand,
            statusCode:200
        })  
    } catch (error) {
        next(error)
        
    }
}

/**
 * @api {delete} /brand/:id Delete Brand information
*/
const deleteBrandById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        const brandId = req.params?.id;
        const brand = await Brand.findByIdAndDelete(brandId);
        if(!brand) throw createError(500, "Brand not deleted");
        return successResponse(res, {
            message: "Brand deleted successfully",
            payload:brand,
            statusCode:200
        })
    } catch (error) {
        next(error)
        
    }
}

module.exports = {
    getAllBrands,
    getBrandById,
    createNewBrand,
    updateBrandById,
    deleteBrandById
}