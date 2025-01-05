const shoppingCartRoute = require('express').Router();
const { addShoppingCart, getAllShoppingCart, deleteShoppingCart } = require('../controllers/ShoppingCartController');
const { isAuth } = require('../middleware/isAuth');


// Add product in shopping cart 
shoppingCartRoute.post('/shopping-cart', isAuth, addShoppingCart);
// Get all carts products
shoppingCartRoute.get('/shopping-carts', isAuth, getAllShoppingCart);
// Delete product from shopping cart by ID
shoppingCartRoute.delete('/shopping-cart/:id/:userId', isAuth, deleteShoppingCart);


module.exports = shoppingCartRoute;