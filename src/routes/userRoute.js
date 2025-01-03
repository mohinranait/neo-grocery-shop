const userRoute = require("express").Router();
const { isAuth } = require("../middleware/isAuth");
const { createNewUser, loginUser, logoutUser, findUserById, getAuthenticatedUser, getAllUsers, updateUserById } = require("../controllers/UserController");

/**
 * User routes for Authentication
 */ 
// Create new user OR Register
userRoute.post('/user/create', createNewUser)
// Login user by email and password
userRoute.post('/user/login', loginUser)
// Logout user
userRoute.post('/user/logout', isAuth, logoutUser)


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