const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");
const User = require("../models/UserModel");



/**
 * @api {get} /user/:id Get user by ID
 * @params id
*/
const findUserById = async (req, res ,next) => {
    try {
        
        let userId = req.params?.id;
        
        const {id, email} = req.user;
        
        const user = await User.findById(userId).select('-password');
        if(!user) throw createError(404, "User not-found")
        
        return successResponse(res, {
            statusCode: 200,
            message: "Success",
            payload: user,
        })
       
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /user Get authenticated user
*/
const getAuthenticatedUser = async (req, res, next) => {
    try {
        const {id:userId,email} = req.user;
        const user = await User.findById(userId).select('-password');
        if(!user) throw createError(404, "User not-found")

        return successResponse(res, {
            message: "Success",
            payload:user,
            statusCode:200
        })
       
    } catch (error) {
        next(error)
    }
}


/**
 * Update user information by User ID
 * @param req.params.userId
 * @query accessBy=user || admin || manager
*/
const updateUserById = async (req, res, next) => {
    try {
        const {id:authId, email,role} = req.user;
        const userId = req.params?.userId;
        let body = req.body;

        const accessBy = req.query?.accessBy || 'User';
        if(!accessBy) throw createError(400, "Access query is required");

        // Check user exists
        const findUser = await User.findById(userId)
        if(!findUser) throw createError(404, "User not-found");

        
        // Authenticated user can update his/her information
        if(authId === userId ){
            // This properties can't be update
            delete body.email;
            delete body.role;
            delete body.status;
            delete body.password;
            
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            if(!user) throw createError(404, "User not-found");
            return successResponse(res, {
                message: "Successfully updated profile",
                payload:user,
                statusCode:200
            })
        }

        if(role === 'Manager' && accessBy === 'Manager'){
            // Manager can update user information
            if( findUser.role !== "User") throw createError(401, "Unauthorized access");
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            return successResponse(res, {
                message: "Updated user information",
                payload:user,
                statusCode:200
            })
        }

        if(role === 'Admin' && accessBy === 'Admin'){
            // Admin can update user information and manager information
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            return successResponse(res, {
                message: "Updated user information",
                payload:user,
                statusCode:200
            })
        }

        return successResponse(res, {
            message: "Invalid request",
            statusCode:200
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get all users
 * @param for admin
*/
const getAllUsers = async (req, res, next) => {
    try {
        const {id:userId, email,role} = req.user;
        
        // Check admin or manager role
        if(role === 'User' ) throw createError(401, "Unauthorized access");

        let query = {
            role: 'User',
            _id: { $ne: userId},
        };
        if(role === 'Manager') query = {role: 'User'}
        if(role === 'Admin') query = {role: { $in: ['User', 'Manager']}}

        const users = await User.find(query).select('-password');
        if(!users) throw createError(404, "Users not-found");

        return successResponse(res, {
            message: "Success",
            payload:users,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}




module.exports = {
    findUserById,
    updateUserById,
    getAllUsers,
    getAuthenticatedUser
}