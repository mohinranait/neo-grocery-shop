const productRoute = require('express').Router();

const {  getAllProducts, createNewProduct, getSingleProductById, getSingleProductBySlug, updateProductByID, deleteProductById } = require('../controllers/ProductController');
const { isAuth } = require('../middleware/isAuth');

productRoute.post('/product', isAuth, createNewProduct);
productRoute.get('/products', getAllProducts);
productRoute.get('/product/:id', getSingleProductById);
productRoute.get('/view-product/:slug', getSingleProductBySlug);
productRoute.patch('/product/:id', isAuth, updateProductByID);
productRoute.delete('/product/:id', isAuth, deleteProductById);

module.exports = productRoute;