const orderRouter = require('express').Router();
const {createNewOrder, getOrderByUID, getAllOrders, updateOrderById} = require('../controllers/OrderController');
const { isAuth } = require('../middleware/isAuth');

orderRouter.post('/order', createNewOrder)
orderRouter.get('/order/:uid', getOrderByUID)
orderRouter.get('/orders', isAuth, getAllOrders)
orderRouter.patch('/order/:id', isAuth, updateOrderById)

module.exports = orderRouter;