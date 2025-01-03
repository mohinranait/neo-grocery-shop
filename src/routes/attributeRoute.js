const attributeRoute = require('express').Router();
const { isAuth } = require("../middleware/isAuth");
const { createNewAttribute, getAllAttributes, getAttributeById, updateAttributeById, deleteAttributeById } = require    ("../controllers/AttributeController");     

// Create attribute route
attributeRoute.post('/attribute', isAuth, createNewAttribute);
// Get all attributes
attributeRoute.get('/attributes', getAllAttributes);
// Get attribute by id
attributeRoute.get('/attribute/:id', getAttributeById);
// Update attribute by id
attributeRoute.patch('/attribute/:id', isAuth, updateAttributeById);
// Delete attribute by id
attributeRoute.delete('/attribute/:id', isAuth, deleteAttributeById);


module.exports = attributeRoute;