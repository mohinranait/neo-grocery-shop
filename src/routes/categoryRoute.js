
const categoryRoute = require("express").Router();
const { isAuth } = require("../middleware/isAuth"); 
const { createNewCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require   ("../controllers/CategoryController");  

// Create new category
categoryRoute.post('/category', isAuth, createNewCategory);
// Get all categories
categoryRoute.get('/categories', getAllCategories);
// Get category by id
categoryRoute.get('/category/:id', getCategoryById);
// Update category by id
categoryRoute.patch('/category/:id', isAuth, updateCategoryById);
// Delete category by id
categoryRoute.delete('/category/:id', isAuth, deleteCategoryById);

module.exports = categoryRoute;