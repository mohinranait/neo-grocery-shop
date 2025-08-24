
const commentRoute = require('express').Router();

const { isAuth } = require('../middleware/isAuth');
const { createNewCommentByProductId, getCommentByProductId, updateCommentByCommentId } = require('../controllers/CommentController');
// Create new comment
commentRoute.post('/comment', isAuth, createNewCommentByProductId);
commentRoute.get('/comments/:productId',  getCommentByProductId);
commentRoute.patch('/comment/:commentId', isAuth, updateCommentByCommentId);


module.exports =  commentRoute;