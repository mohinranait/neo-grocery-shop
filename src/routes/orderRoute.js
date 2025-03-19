const orderRouter = require('express').Router();
const {createNewOrder, getOrderByUID, getAllOrders} = require('../controllers/OrderController');
const { isAuth } = require('../middleware/isAuth');

orderRouter.post('/order', createNewOrder)
orderRouter.get('/order/:uid', getOrderByUID)
orderRouter.get('/orders', isAuth, getAllOrders)

module.exports = orderRouter;