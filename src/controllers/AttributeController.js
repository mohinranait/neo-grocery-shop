const Attribute = require("../models/AttributeModel");
const createError = require("http-errors");
const { generateSlug } = require("../utils/helpers");
const { successResponse } = require("../utils/responseHandler");

/**
 * @api {get} /attributes Get all attributes
*/
const getAllAttributes = async (req, res, next) => {
    try {
        const attributes = await Attribute.find();
        if(!attributes) throw createError(404, "Attributes not-found");

        return successResponse(res, {
            message: "Success",
            payload:attributes,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /attribute/:id Get attribute by ID
*/
const getAttributeById = async (req, res, next) => {
    try {
        let attributeId = req.params?.id;

        const attribute = await Attribute.findById(attributeId);
        if(!attribute) throw createError(404, "Attribute not-found");
        return successResponse(res, {
            message: "Success",
            payload:attribute,
            statusCode:200
        })
    }catch (error) {    
        next(error)    
    }
}   

/**
 * @api {post} /attribute Create new attribute
*/
const createNewAttribute = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");

        const body = req.body;
        const genSlug = generateSlug( body?.slug || body?.name);
        const newAttribute = new Attribute({...body,slug:genSlug});
        const attribute = await newAttribute.save();
        if(!attribute) throw createError(500, "Attribute not created");
        return successResponse(res, {
            message: "Attribute created successfully",
            payload:attribute,
            statusCode:200
        })

    } catch (error) {
        next(error)
    }
}

/**
 * @api {patch} /attribute/:id Update attribute by ID
*/
const updateAttributeById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        let attributeId = req.params?.id;
        const body = req.body;
        const attribute = await Attribute.findByIdAndUpdate(attributeId, body, {new:true, runValidators:true});
        if(!attribute) throw createError(404, "Attribute not found");
        return successResponse(res, {
            message: "Attribute updated successfully",
            payload:attribute,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {delete} /attribute/:id Delete attribute by ID
*/
const deleteAttributeById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        let attributeId = req.params?.id;
        const attribute = await Attribute.findByIdAndDelete(attributeId);
        if(!attribute) throw createError(404, "Attribute not found");
        return successResponse(res, {
            message: "Attribute deleted successfully",
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllAttributes,
    getAttributeById,
    createNewAttribute,
    updateAttributeById,
    deleteAttributeById
}