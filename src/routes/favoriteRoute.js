const favoriteRoute = require('express').Router();
const { createFavoriteProduct, getFavoriteProducts, deleteFavoriteProduct } = require('../controllers/FavoriteController');
const { isAuth } = require('../middleware/isAuth');


// Create new favorite product 
favoriteRoute.post('/favorite', isAuth, createFavoriteProduct);
// Get all favorite products
favoriteRoute.get('/favorites', isAuth, getFavoriteProducts);
// Delete favorite by id
favoriteRoute.delete('/favorite/:id/:userId', isAuth, deleteFavoriteProduct);


module.exports = favoriteRoute;