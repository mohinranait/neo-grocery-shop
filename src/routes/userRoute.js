const userRoute = require("express").Router();
const { isAuth } = require("../middleware/isAuth");
const {   findUserById, getAuthenticatedUser,deleteUser, getAllUsers, updateUserById, getUsersStatics, } = require("../controllers/UserController");
const { registerNewUser, verifyRegisterProcess, loginUser, logoutUser, forgotPassword, chnagePasswordForAuthUser, forgotEmailVerifyMethod, changeForgotPassword } = require("../controllers/AuthController");

/**
 * User routes for Authentication
 */ 
// Register route for get user information
userRoute.post('/user/create', registerNewUser)
// Verify email and create user 
userRoute.post('/user', verifyRegisterProcess)
// Login user by email and password
userRoute.post('/user/login', loginUser)
// Logout user
userRoute.post('/user/logout',  logoutUser)

// Forgot password
userRoute.post('/forgot-password', forgotPassword)
userRoute.post('/forgot-email-verify', forgotEmailVerifyMethod  )
userRoute.post('/change-password', changeForgotPassword)

// Change password for authenticated user
userRoute.patch('/change-password',isAuth, chnagePasswordForAuthUser)


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
// Delete user
userRoute.delete('/user/:userId', isAuth, deleteUser)

userRoute.get('/statics', isAuth, getUsersStatics )

module.exports = userRoute;