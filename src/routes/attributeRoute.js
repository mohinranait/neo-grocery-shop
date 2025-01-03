const attributeRoute = require('express').Router();


const { createNewAttribute, getAllAttributes, getAttributeById, updateAttributeById, deleteAttributeById } = require    ("../controllers/AttributeController");     
const { isAuth } = require("../middleware/isAuth");
attributeRoute.post('/attribute', isAuth, createNewAttribute);
attributeRoute.get('/attributes', getAllAttributes);
attributeRoute.get('/attribute/:id', getAttributeById);
attributeRoute.patch('/attribute/:id', isAuth, updateAttributeById);
attributeRoute.delete('/attribute/:id', isAuth, deleteAttributeById);


module.exports = attributeRoute;