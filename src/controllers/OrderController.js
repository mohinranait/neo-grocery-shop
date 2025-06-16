
const Order = require("../models/OrderModel");
const { successResponse } = require("../utils/responseHandler") ;
const createError = require("http-errors");

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
        // Access order for Admin or User
        const accessByUser = req.query?.userId || null;
    
        // DB Query
        const query= {}

        // If request from user
        if(accessByUser){
            query.userId = accessByUser;
        }
       
        // Filter from DB
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

/**
 * @api {pathc} /api/order/:id 
 * Update Order by ID
*/
const updateOrderById = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");

        const order = await Order.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true})
        if(!order) throw createError(500, "Order not found");
        return successResponse(res, {
            message: "Order has been updated",
            payload:order,
            statusCode:200
        })  

    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    createNewOrder,
    getAllOrders,
    getOrderByUID,
    updateOrderById
}
