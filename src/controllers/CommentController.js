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
        const newComment = new Comment({ productId, userId:authUser.id, content:comment, rating });
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

        const commentUpdate = await Comment.findByIdAndUpdate(commentId, {  content:comment, rating }, { new: true, runValidators:true });
        
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

        const user = await User.findById(authUser.id);
        if(!user) throw createError(404, "User not found");


        const existComment = await Comment.findById(commentId);
        if(!existComment) throw createError(404, "Comment not found");

        if(user.role !== 'admin' || user.role !== 'manager' || user.id !== existComment.userId.toString()) 
           {
             throw createError(403, "Can't delete comments without permission");
           }

        const comment = await Comment.findByIdAndDelete(commentId);
        
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


module.exports = {
    createNewCommentByProductId,
    updateCommentByCommentId,
    deleteCommentByCommentId,
}