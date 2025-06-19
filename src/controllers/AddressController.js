const Address = require("../models/AddressModel");
const { successResponse } = require("../utils/responseHandler");
const createError = require("http-errors");

/**
 * @Create new address for user
 * @POST => /api/address
*/
const createNewAddress = async (req, res, next) => {
    try {
         const authUser = req.user;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

        const body = req.body;
        const address = await Address.create({...body});
         return successResponse(res, {
            message: "Success",
            statusCode:201,
            payload: address,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * All address for authenticated user
 * @GET => /api/address
*/
const getAllAddressByUserId = async (req, res, next) => {
    try {
         const authUser = req.user;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

        const query = {
            userId : authUser?.id,
        };
        const address = await Address.find(query);
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: {address},
        })
    } catch (error) {
        next(error);
    }
}


/**
 * @ Update address for authenticated user
 * @patch => /api/address/:{addressId}
*/
const updateAddressByUserId = async (req, res, next) => {
    try {
         const authUser = req.user;
         const addressId = req.params?.addressId;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

         const checkOwnerAddress = await Address.findById(addressId);
        
         
         if(authUser?.id !== checkOwnerAddress?.userId?.toString() ) throw createError(401, "You are not authorized to edit this address");

        const body = req.body;
        const address = await Address.findByIdAndUpdate(addressId, {...body}, { new:true, runValidators:true });
         return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: address,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * @ delete address for authenticated user
 * @delete => /api/address/:{addressId}
*/
const deleteAddressByUserId = async (req, res, next) => {
    try {
         const authUser = req.user;
         const addressId = req.params?.addressId;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

         const checkOwnerAddress = await Address.findById(addressId);
        
         if(authUser?.id !== checkOwnerAddress?.userId.toString() ) throw createError(401, "You are not authorized to delete this address");

        const address = await Address.findByIdAndDelete(addressId);
         return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: address,
        })
    } catch (error) {
        next(error);
    }
}



module.exports = {
    createNewAddress,
    getAllAddressByUserId,
    updateAddressByUserId,
    deleteAddressByUserId,
}