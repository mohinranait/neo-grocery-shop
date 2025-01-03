const { createNewUser, loginUser, logoutUser, findUserById, getAuthenticatedUser, getAllUsers, updateUserById } = require("../controllers/UserController");
const { isAuth } = require("../middleware/isAuth");

const userRoute = require("express").Router();

userRoute.post('/user/create', createNewUser)
userRoute.post('/user/login', loginUser)
userRoute.post('/user/logout', isAuth, logoutUser)
userRoute.get('/user/:id', isAuth, findUserById)
userRoute.patch('/user/:userId', isAuth, updateUserById)
userRoute.get('/users', isAuth, getAllUsers)
userRoute.get('/user', isAuth, getAuthenticatedUser)

module.exports = userRoute;