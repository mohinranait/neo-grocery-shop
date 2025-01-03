
const { createNewConfigAttribute, getAllConfigAttributes, updateConfigAttributeById, getConfigAttributeById, deleteConfigAttributeById } = require("../controllers/ConfigAttributeController");
const { isAuth } = require("../middleware/isAuth");

const configAttrRoute = require("express").Router();

configAttrRoute.post('/config-attribute', isAuth, createNewConfigAttribute);
configAttrRoute.get('/config-attributes',  getAllConfigAttributes);
configAttrRoute.patch('/config-attribute/:id', isAuth, updateConfigAttributeById);
configAttrRoute.get('/config-attribute/:id', getConfigAttributeById);
configAttrRoute.delete('/config-attribute/:id', isAuth, deleteConfigAttributeById);


module.exports = configAttrRoute;