
const categoryRoute = require("express").Router();

const { createNewCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require   ("../controllers/CategoryController");  
const { isAuth } = require("../middleware/isAuth"); 

categoryRoute.post('/category', isAuth, createNewCategory);
categoryRoute.get('/categories', getAllCategories);
categoryRoute.get('/category/:id', getCategoryById);
categoryRoute.patch('/category/:id', isAuth, updateCategoryById);
categoryRoute.delete('/category/:id', isAuth, deleteCategoryById);

module.exports = categoryRoute;