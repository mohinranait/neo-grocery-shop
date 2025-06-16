const { createNewAddress, updateAddressByUserId, getAllAddressByUserId, deleteAddressByUserId } = require('../controllers/AddressController');
const { isAuth } = require('../middleware/isAuth');

const addressRoute = require('express').Router();


addressRoute.post(`/address`, isAuth, createNewAddress );
addressRoute.patch(`/address/:addressId`, isAuth, updateAddressByUserId );
addressRoute.get(`/address`, isAuth, getAllAddressByUserId );
addressRoute.delete(`/address/:addressId`, isAuth, deleteAddressByUserId );

module.exports = addressRoute;