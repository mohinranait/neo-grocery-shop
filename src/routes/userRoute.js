const userRoute = require("express").Router();
const { isAuth } = require("../middleware/isAuth");
const {   findUserById, getAuthenticatedUser, getAllUsers, updateUserById, } = require("../controllers/UserController");
const { registerNewUser, verifyRegisterProcess, loginUser, logoutUser, forgotPassword, resetPassword,chnagePassword } = require("../controllers/AuthController");

/**
 * User routes for Authentication
 */ 
// Register route
userRoute.post('/user/create', registerNewUser)
// Verify email and create user
userRoute.post('/user', verifyRegisterProcess)
// Login user by email and password
userRoute.post('/user/login', loginUser)
// Logout user
userRoute.post('/user/logout',  logoutUser)
userRoute.post('/forgot-password', forgotPassword)
userRoute.post('/reset-password', resetPassword)
userRoute.patch('/change-password',isAuth, chnagePassword)


/**
 * User routes
*/
// Get user by ID
userRoute.get('/user/:id', isAuth, findUserById)
// Update user by ID
userRoute.patch('/user/:userId', isAuth, updateUserById)
// Get all users ( Only Admin and Manager)
userRoute.get('/users', isAuth, getAllUsers)
// Get authenticated user
userRoute.get('/user', isAuth, getAuthenticatedUser)

module.exports = userRoute;