const ConfigAttribute = require("../models/ConfigAttributeModel");
const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");
const { generateSlug } = require("../utils/helpers");


/**
 * @api {post} /config-attribute Request ConfigAttribute information
*/
const createNewConfigAttribute = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        const body = req.body;
        const genSlug = generateSlug( body?.slug || body?.name);
        const newConfigAttribute = new ConfigAttribute({...body,slug:genSlug});
        const configAttribute = await newConfigAttribute.save();
        if(!configAttribute) throw createError(500, "ConfigAttribute not created");
        return successResponse(res, {
            message: "Config Attribute created successfully",
            payload:configAttribute,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /config-attributes Get all ConfigAttributes
*/
const getAllConfigAttributes = async (req, res, next) => {
    try {
        const configAttributes = await ConfigAttribute.find({});
        if(!configAttributes) throw createError(404, "ConfigAttributes not-found");
        return successResponse(res, {
            message: "Success",
            payload:configAttributes,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /config-attribute/:id Request ConfigAttribute information
*/
const getConfigAttributeById = async (req, res, next) => {
    try {
        let configAttributeId = req.params?.id;

        const configAttribute = await ConfigAttribute.findById(configAttributeId).populate("attribute");
        if(!configAttribute) throw createError(404, "ConfigAttribute not-found");
        return successResponse(res, {
            message: "Success",
            payload:configAttribute,
            statusCode:200
        })
    }catch (error) {    
        next(error)    
    }
}

/**
 * @api {patch} /config-attribute/:id Update ConfigAttribute information
*/
const updateConfigAttributeById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        let configAttributeId = req.params?.id;
        const body = req.body;
        const genSlug = generateSlug( body?.slug || body?.name);
        const configAttribute = await ConfigAttribute.findByIdAndUpdate(configAttributeId, {...body,slug:genSlug}, {new:true,runValidators:true});
        if(!configAttribute) throw createError(500, "ConfigAttribute not updated");
        return successResponse(res, {
            message: "ConfigAttribute updated successfully",
            payload:configAttribute,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {delete} /config-attribute/:id Delete ConfigAttribute information
*/
const deleteConfigAttributeById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser?.role !== 'Admin' && authUser?.role !== "Manager" ) throw createError(401, "Unauthorized access");
        let configAttributeId = req.params?.id;
        const configAttribute = await ConfigAttribute.findByIdAndDelete(configAttributeId);
        if(!configAttribute) throw createError(500, "ConfigAttribute not deleted");
        return successResponse(res, {
            message: "Config Attribute deleted successfully",
            payload:configAttribute,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createNewConfigAttribute,
    getAllConfigAttributes,
    getConfigAttributeById,
    updateConfigAttributeById,
    deleteConfigAttributeById
}