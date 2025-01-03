const brandRoute = require('express').Router();
const { isAuth } = require('../middleware/isAuth');
const { createNewBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById } = require('../controllers/BrandController');   

// Brand create route
brandRoute.post('/brand', isAuth, createNewBrand);
// Get all brands
brandRoute.get('/brands', getAllBrands);
// Get brand by id
brandRoute.get('/brand/:id', getBrandById);
// Update brand by id
brandRoute.patch('/brand/:id', isAuth, updateBrandById);
// Delete brand by id
brandRoute.delete('/brand/:id', isAuth, deleteBrandById);

module.exports = brandRoute;