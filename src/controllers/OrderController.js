const { Order } = require("../models/OrderModel");
const { successResponse } = require("../utils/responseHandler") ;


// Store new order in your datebase
const createNewOrder = async (req, res, next) => {
    try {
        const {userId} = req.body;
        const body = req.body;
       
        // Connect DB
        const order = await Order.create({...body});
        return successResponse(res, {
            message: "Success",
            statusCode:201,
            payload: order,
        })
    } catch (error) {
        next(error)
    }
}

// Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        // Admin or User
        const accessByUser = req.query?.userId || null;
    
        const query= {}

        // If request from user
        if(accessByUser){
            query.userId = accessByUser;
        }
       
        // Connect DB
        const orders = await Order.find(query);
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: orders,
        })
    } catch (error) {
        next(error)
    }
}

// Get Single order by UID
const getOrderByUID = async (req, res, next) => {
    try {
        const orderUid= req.params?.uid;

       
        // Connect DB
        const order = await Order.findOne({uid:orderUid});
        console.log({order});
        
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: order,
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createNewOrder,
    getAllOrders,
    getOrderByUID
}
