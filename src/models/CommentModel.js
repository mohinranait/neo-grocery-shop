const {Schema,Types, model} = require('mongoose');

const commentSchema = new Schema({
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false },
},{timestamps: true});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
