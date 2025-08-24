const createError = require("http-errors");
const { successResponse } = require("../utils/responseHandler");
const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");

/**
 * Create a new comment for a product
 * @route POST /api/comments
*/
const createNewCommentByProductId  = async (req, res,next) => {
    try {
        const authUser = req.user;
        if(!authUser) throw createError(401, "Unauthorized access");
        const { productId, comment, rating } = req.body;
        if(!productId || !comment) throw createError(400, "Product ID and comment are required");
        const newComment = new Comment({ productId, userId:authUser.id, comment, rating });
        const savedComment = await newComment.save();
        if(!savedComment) throw createError(500, "Comment not created");
        return successResponse(res, {
            statusCode: 201,
            message: "Comment created successfully",
            payload: savedComment,
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Update  comment using comment ID
 * @route PATCH /api/comments/:commentId
*/
const updateCommentByCommentId  = async (req, res,next) => {
    try {
        const authUser = req.user;
        const commentId = req.params.commentId;
        if(!authUser) throw createError(401, "Unauthorized access");
        const {  comment, rating } = req.body;
        if( !comment) throw createError(400, "Product ID and comment are required");

        // find comment
        const existComment = await Comment.findById(commentId);
        if(!existComment) throw createError(404, "Comment not found");

        

        // check user permission
        if (
            authUser.role !== 'admin' && 
            authUser.role !== 'manager' && 
            authUser.id.toString() !== existComment.userId.toString()
        ) {
            throw createError(403, "Can't update comments without permission");
        }

        const commentUpdate = await Comment.findByIdAndUpdate(commentId, {  comment, rating }, { new: true, runValidators:true });
        
        if(!commentUpdate) throw createError(404, "Comment not created");

        return successResponse(res, {
            statusCode: 200,
            message: "Comment updated successfully",
            payload: commentUpdate,
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Delete  comment using comment ID
 * @route DELETE /api/comments/:commentId
*/
const deleteCommentByCommentId  = async (req, res,next) => {
    try {

        const authUser = req.user;
        const commentId = req.params.commentId;
        if(!authUser) throw createError(401, "Unauthorized access");
        if( !commentId) throw createError(400, "Product ID and comment are required");

        // find comment
        const existComment = await Comment.findById(commentId);
        if(!existComment) throw createError(404, "Comment not found");

        // check user permission
        if(authUser.role !== 'admin' || authUser.role !== 'manager' || authUser.id !== existComment.userId.toString()) 
           {
             throw createError(403, "Can't delete comments without permission");
           }

        // delete comment 
        const comment = await Comment.findByIdAndDelete(commentId);
        // If comment not found
        if(!comment) throw createError(404, "Comment not created");

        return successResponse(res, {
            statusCode: 200,
            message: "Comment delete successfully",
            payload: comment,
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Get all comments by product ID
 * @route GET /api/comments/:productId
 * @access accessMode: public, auth, admin
 * @queryParam accessMode=public|auth|admin & userId={userID} 
*/
const getCommentByProductId = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.query?.userId || null; 
        const accessMode = req.query.accessMode || 'public'; 

        if (!productId) throw createError(400, "Product ID is required");

        const query=  { productId };

        // Authenticated user can cee her comments
        if(accessMode === 'auth' ){
            // Commenter user can see her comments
            query.userId = userId;
        } else if(accessMode ==='admin' ){ 
            // Admin can see all comments
            query['$or'] = [ { isApproved: false }, { isApproved: true } ];
        }else {
            // Unauthenticated user can see only approved comments
            query.isApproved = true;
        }

        const comments = await Comment.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }); 

        return successResponse(res, {
                statusCode: 200,
                message: "Get all comments by product ID successfully",
                payload: {
                    comments,
                },
            });
    } catch (error) {
        next(error);
    }
}




module.exports = {
    createNewCommentByProductId,
    updateCommentByCommentId,
    deleteCommentByCommentId,
    getCommentByProductId
}