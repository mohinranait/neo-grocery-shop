
const configAttrRoute = require("express").Router();
const { isAuth } = require("../middleware/isAuth");
const { createNewConfigAttribute, getAllConfigAttributes, updateConfigAttributeById, getConfigAttributeById, deleteConfigAttributeById } = require("../controllers/ConfigAttributeController");

// Config Attribute routes
configAttrRoute.post('/config-attribute', isAuth, createNewConfigAttribute);
// Get all config attributes
configAttrRoute.get('/config-attributes',  getAllConfigAttributes);
// Update config attribute by id
configAttrRoute.patch('/config-attribute/:id', isAuth, updateConfigAttributeById);
// Get config attribute by id
configAttrRoute.get('/config-attribute/:id', getConfigAttributeById);
// Delete config attribute by id
configAttrRoute.delete('/config-attribute/:id', isAuth, deleteConfigAttributeById);


module.exports = configAttrRoute;