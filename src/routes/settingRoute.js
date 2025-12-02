
const { getSetting, updateSetting } = require('../controllers/SettingController');
const { isAuth } = require('../middleware/isAuth');
const settingRoute =  require('express').Router();


settingRoute.get('/settings',  getSetting )
settingRoute.post('/settings', isAuth, updateSetting )

module.exports = settingRoute;

